import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, Bell, CheckCircle2, ExternalLink, Info, X, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router'
import {
  useNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from '../../hooks/notificationQuery'
import type { Notification, NotificationType } from '../../types/api/notification.types'

const TYPE_CONFIG: Record<NotificationType, { label: string; icon: LucideIcon; iconClass: string; bgClass: string }> = {
  INFO: { label: 'Info', icon: Info, iconClass: 'text-blue-600', bgClass: 'bg-blue-50' },
  SUCCESS: { label: 'Success', icon: CheckCircle2, iconClass: 'text-emerald-600', bgClass: 'bg-emerald-50' },
  WARNING: { label: 'Warning', icon: AlertTriangle, iconClass: 'text-amber-600', bgClass: 'bg-amber-50' },
  ERROR: { label: 'Error', icon: XCircle, iconClass: 'text-red-600', bgClass: 'bg-red-50' },
}

const TABS: Array<{ key: 'ALL' | NotificationType; label: string }> = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'INFO', label: 'Thông tin' },
  { key: 'SUCCESS', label: 'Thành công' },
  { key: 'WARNING', label: 'Cảnh báo' },
  { key: 'ERROR', label: 'Lỗi' },
]

function formatRelativeTime(iso: string) {
  const date = new Date(iso)
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diffSec < 60) return 'Vừa xong'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} phút trước`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}h trước`
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 7) return `${diffDay} ngày trước`
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

function formatFullDateTime(iso: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

// Trang /notifications: gọi GET /notifications, tự phân loại theo type (INFO/SUCCESS/WARNING/ERROR).
// Click 1 thông báo mở modal xem chi tiết (thay vì đánh dấu đọc ngay và im lặng); đóng modal mới
// gọi PATCH /notifications/:id/read (useMarkNotificationReadMutation) — readOverrides chỉ dùng để
// cập nhật UI ngay lập tức (optimistic) trong lúc chờ request, sau đó query được invalidate nên
// data thật từ server sẽ ghi đè lại. "Mark all read" dùng endpoint bulk PATCH /notifications/read-all.
export default function NotificationsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'ALL' | NotificationType>('ALL')
  const [limit, setLimit] = useState(20)
  const [readOverrides, setReadOverrides] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<Notification | null>(null)

  const { data: response, isLoading, isError } = useNotificationsQuery({ limit })
  const { mutate: markAsRead } = useMarkNotificationReadMutation()
  const { mutate: markAllRead } = useMarkAllNotificationsReadMutation()
  const notifications = response?.data?.data?.data ?? []
  const meta = response?.data?.data?.meta

  const withReadState = useMemo(
    () => notifications.map((n) => ({ ...n, isRead: n.isRead || readOverrides.has(n.id) })),
    [notifications, readOverrides],
  )

  const unreadCount = withReadState.filter((n) => !n.isRead).length

  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: withReadState.length }
    for (const type of Object.keys(TYPE_CONFIG)) {
      map[type] = withReadState.filter((n) => n.type === type).length
    }
    return map
  }, [withReadState])

  const filtered = activeTab === 'ALL' ? withReadState : withReadState.filter((n) => n.type === activeTab)
  const canLoadMore = !!meta && notifications.length < meta.total

  const handleMarkAllRead = () => {
    const unreadIds = withReadState.filter((n) => !n.isRead).map((n) => n.id)
    if (unreadIds.length === 0) return
    setReadOverrides((prev) => new Set([...prev, ...unreadIds]))
    markAllRead()
  }

  // Mở modal chi tiết — chưa đánh dấu đọc, chỉ đọc khi đóng modal
  const handleItemClick = (n: Notification) => {
    setSelected(withReadState.find((item) => item.id === n.id) ?? n)
  }

  // Đóng modal = coi như đã đọc xong thông báo đó
  const handleCloseDetail = () => {
    if (selected && !selected.isRead) {
      setReadOverrides((prev) => new Set(prev).add(selected.id))
      markAsRead(selected.id)
    }
    setSelected(null)
  }

  const handleGoToLink = () => {
    if (selected?.link) {
      const link = selected.link
      handleCloseDetail()
      navigate(link)
    }
  }

  return (
    <div className='h-full min-h-0 overflow-y-auto bg-gray-50 p-6'>
      <div className='max-w-3xl mx-auto'>
        <div className='flex items-start justify-between gap-4 mb-6'>
          <div>
            <h1 className='text-xl font-semibold text-gray-900'>Notifications</h1>
            <p className='mt-1 text-sm text-gray-500'>
              {unreadCount} chưa đọc · {meta?.total ?? withReadState.length} tổng cộng
            </p>
          </div>
          <button
            type='button'
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className='rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-900 px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0'
          >
            Mark all read
          </button>
        </div>

        <div className='flex items-center gap-1.5 mb-4 overflow-x-auto'>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type='button'
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {counts[tab.key] !== undefined && <span className='ml-1.5 opacity-70'>{counts[tab.key]}</span>}
            </button>
          ))}
        </div>

        <div className='bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden'>
          {isLoading ? (
            <div className='p-10 text-center text-sm text-gray-400'>Đang tải thông báo...</div>
          ) : isError ? (
            <div className='p-10 text-center text-sm text-red-500'>Không thể tải thông báo. Vui lòng thử lại.</div>
          ) : filtered.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16 px-6 text-center'>
              <div className='w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center'>
                <Bell className='w-5 h-5 text-gray-400' />
              </div>
              <p className='mt-4 text-sm font-medium text-gray-900'>Không có thông báo</p>
              <p className='mt-1 text-xs text-gray-500'>Bạn sẽ thấy thông báo mới ở đây.</p>
            </div>
          ) : (
            <div className='divide-y divide-gray-100'>
              {filtered.map((n) => {
                const config = TYPE_CONFIG[n.type]
                const Icon = config.icon
                return (
                  <button
                    key={n.id}
                    type='button'
                    onClick={() => handleItemClick(n)}
                    className={`w-full flex items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-gray-50 ${
                      !n.isRead ? 'bg-indigo-50/30' : ''
                    }`}
                  >
                    <div className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${config.bgClass}`}>
                      <Icon className={`w-4.5 h-4.5 ${config.iconClass}`} />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center gap-2'>
                        <p
                          className={`text-sm truncate ${
                            !n.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                          }`}
                        >
                          {n.title}
                        </p>
                        {!n.isRead && <span className='w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0' />}
                      </div>
                      <p className='mt-0.5 text-sm text-gray-500 line-clamp-2'>{n.message}</p>
                      <p className='mt-1 text-xs text-gray-400'>{formatRelativeTime(n.createdAt)}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {canLoadMore && (
          <div className='mt-4 flex justify-center'>
            <button
              type='button'
              onClick={() => setLimit((l) => l + 20)}
              className='rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 px-5 py-2.5 hover:bg-gray-50 transition-colors'
            >
              Tải thêm
            </button>
          </div>
        )}
      </div>

      {/* Modal chi tiết thông báo — đóng lại thì đánh dấu đã đọc */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key='backdrop'
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleCloseDetail}
          >
            <motion.div
              className='w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden'
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const config = TYPE_CONFIG[selected.type]
                const Icon = config.icon
                return (
                  <>
                    <div className='flex items-start gap-3 px-5 pt-5'>
                      <div
                        className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${config.bgClass}`}
                      >
                        <Icon className={`w-5 h-5 ${config.iconClass}`} />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <span className={`text-xs font-medium ${config.iconClass}`}>{config.label}</span>
                        <h2 className='text-base font-semibold text-gray-900 mt-0.5'>{selected.title}</h2>
                      </div>
                      <button
                        type='button'
                        onClick={handleCloseDetail}
                        className='shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors'
                      >
                        <X className='w-4 h-4' />
                      </button>
                    </div>

                    <div className='px-5 py-4'>
                      <p className='text-sm text-gray-700 whitespace-pre-wrap'>{selected.message}</p>
                      <p className='mt-3 text-xs text-gray-400'>{formatFullDateTime(selected.createdAt)}</p>
                    </div>

                    <div className='flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50'>
                      {selected.link && (
                        <button
                          type='button'
                          onClick={handleGoToLink}
                          className='inline-flex items-center gap-1.5 rounded-xl bg-gray-900 text-white text-sm font-medium px-4 py-2 hover:bg-gray-800 transition-colors'
                        >
                          Đi tới liên kết
                          <ExternalLink className='w-3.5 h-3.5' />
                        </button>
                      )}
                      <button
                        type='button'
                        onClick={handleCloseDetail}
                        className='rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 px-4 py-2 hover:bg-gray-50 transition-colors'
                      >
                        Đóng
                      </button>
                    </div>
                  </>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
