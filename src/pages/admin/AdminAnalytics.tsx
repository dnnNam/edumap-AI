import { useMemo, useState } from 'react'
import {
  Activity,
  BarChart3,
  ChevronDown,
  Clock,
  Compass,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Globe,
  Info,
  Laptop,
  Radio,
  RefreshCw,
  Share2,
  Smartphone,
  Tablet,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import { FaFacebook, FaGoogle, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa'
import Skeleton from 'react-loading-skeleton'
import { exportAnalyticsToExcel, exportAnalyticsToPDF } from '../../utils/analyticsExport'
import {
  useAnalyticsDevicesQuery,
  useAnalyticsEventsQuery,
  useAnalyticsOverviewQuery,
  useAnalyticsRealtimeQuery,
  useAnalyticsStatusQuery,
  useAnalyticsTimeseriesQuery,
  useAnalyticsTopPagesQuery,
  useAnalyticsTrafficSourcesQuery,
} from '../../hooks/useAnalyticsQuery'

type DateRangeOption = 'today' | 'yesterday' | '7daysAgo' | '30daysAgo'

const DATE_RANGE_LABELS: Record<DateRangeOption, { vi: string; en: string }> = {
  today: { vi: 'Hôm nay', en: 'Today' },
  yesterday: { vi: 'Hôm qua', en: 'Yesterday' },
  '7daysAgo': { vi: '7 ngày qua', en: 'Last 7 days' },
  '30daysAgo': { vi: '30 ngày qua', en: 'Last 30 days' },
}

const getSourceMeta = (source: string, medium: string, channelGroup: string) => {
  const s = (source || '').toLowerCase()
  const c = (channelGroup || '').toLowerCase()
  const m = (medium || '').toLowerCase()

  if (s.includes('facebook') || s.includes('fb.') || s.includes('meta')) {
    return {
      label: 'Facebook',
      sub: `${source} / ${medium}`,
      Icon: FaFacebook,
      color: 'text-[#1877F2]',
      bg: 'bg-[#1877F2]/10 dark:bg-[#1877F2]/20',
      category: 'social' as const,
      badge: 'Mạng xã hội',
    }
  }
  if (s.includes('instagram')) {
    return {
      label: 'Instagram',
      sub: `${source} / ${medium}`,
      Icon: FaInstagram,
      color: 'text-[#E4405F]',
      bg: 'bg-[#E4405F]/10 dark:bg-[#E4405F]/20',
      category: 'social' as const,
      badge: 'Mạng xã hội',
    }
  }
  if (s.includes('tiktok')) {
    return {
      label: 'TikTok',
      sub: `${source} / ${medium}`,
      Icon: FaTiktok,
      color: 'text-gray-900 dark:text-gray-100',
      bg: 'bg-gray-900/10 dark:bg-white/10',
      category: 'social' as const,
      badge: 'Mạng xã hội',
    }
  }
  if (s.includes('youtube')) {
    return {
      label: 'YouTube',
      sub: `${source} / ${medium}`,
      Icon: FaYoutube,
      color: 'text-[#FF0000]',
      bg: 'bg-[#FF0000]/10 dark:bg-[#FF0000]/20',
      category: 'social' as const,
      badge: 'Mạng xã hội',
    }
  }
  if (s.includes('google')) {
    return {
      label: 'Google Search',
      sub: `${source} / ${medium}`,
      Icon: FaGoogle,
      color: 'text-[#4285F4]',
      bg: 'bg-[#4285F4]/10 dark:bg-[#4285F4]/20',
      category: 'search' as const,
      badge: 'Tìm kiếm',
    }
  }
  if (c.includes('social') || m.includes('social')) {
    return {
      label: source,
      sub: `${source} / ${medium}`,
      Icon: Share2,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10 dark:bg-pink-500/20',
      category: 'social' as const,
      badge: 'Mạng xã hội',
    }
  }
  if (c.includes('search') || m.includes('cpc') || m.includes('organic')) {
    return {
      label: source,
      sub: `${source} / ${medium}`,
      Icon: Globe,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      category: 'search' as const,
      badge: 'Tìm kiếm',
    }
  }
  if (s.includes('(direct)') || c.includes('direct')) {
    return {
      label: 'Truy cập trực tiếp (Direct URL)',
      sub: 'Người dùng gõ URL hoặc mở Bookmark',
      Icon: Compass,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      category: 'direct' as const,
      badge: 'Trực tiếp',
    }
  }
  return {
    label: source,
    sub: `${source} / ${medium} (${channelGroup})`,
    Icon: Globe,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    category: 'other' as const,
    badge: channelGroup || 'Giới thiệu',
  }
}

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRangeOption>('7daysAgo')
  const [sourceCategory, setSourceCategory] = useState<'all' | 'social' | 'search' | 'direct'>('all')
  const [exportMenuOpen, setExportMenuOpen] = useState(false)

  const queryParams = useMemo(() => {
    return {
      startDate: dateRange,
      endDate: 'today',
    }
  }, [dateRange])

  // Status Query
  const { data: statusRes, isLoading: isStatusLoading } = useAnalyticsStatusQuery()
  const status = statusRes?.data?.data
  const isConfigured = Boolean(status?.isConfigured)

  // Report Queries (only execute if GA4 is configured on the backend server)
  const {
    data: overviewRes,
    isLoading: isOverviewLoading,
    refetch: refetchOverview,
    isFetching: isOverviewFetching,
  } = useAnalyticsOverviewQuery(queryParams, isConfigured)
  const { data: realtimeRes } = useAnalyticsRealtimeQuery(isConfigured)
  const { data: timeseriesRes, isLoading: isTimeseriesLoading } = useAnalyticsTimeseriesQuery(queryParams, isConfigured)
  const { data: topPagesRes, isLoading: isTopPagesLoading } = useAnalyticsTopPagesQuery(
    { ...queryParams, limit: 7 },
    isConfigured,
  )
  const { data: sourcesRes, isLoading: isSourcesLoading } = useAnalyticsTrafficSourcesQuery(
    {
      ...queryParams,
      limit: 15,
    },
    isConfigured,
  )
  const { data: devicesRes, isLoading: isDevicesLoading } = useAnalyticsDevicesQuery(queryParams, isConfigured)
  const { data: eventsRes, isLoading: isEventsLoading } = useAnalyticsEventsQuery(
    { ...queryParams, limit: 6 },
    isConfigured,
  )

  const overview = overviewRes?.data?.data
  const realtime = realtimeRes?.data?.data
  const timeseries = timeseriesRes?.data?.data ?? []
  const topPages = topPagesRes?.data?.data ?? []
  const sources = sourcesRes?.data?.data ?? []
  const devices = devicesRes?.data?.data ?? []
  const events = eventsRes?.data?.data ?? []

  const filteredSources = useMemo(() => {
    if (sourceCategory === 'all') return sources
    return sources.filter((s) => {
      const meta = getSourceMeta(s.source, s.medium, s.channelGroup)
      return meta.category === sourceCategory
    })
  }, [sources, sourceCategory])

  const socialStats = useMemo(() => {
    let socialSessions = 0
    let searchSessions = 0
    let directSessions = 0
    for (const s of sources) {
      const cat = getSourceMeta(s.source, s.medium, s.channelGroup).category
      if (cat === 'social') socialSessions += s.sessions
      else if (cat === 'search') searchSessions += s.sessions
      else if (cat === 'direct') directSessions += s.sessions
    }
    return { socialSessions, searchSessions, directSessions }
  }, [sources])

  const handleRefreshAll = () => {
    void refetchOverview()
  }

  // Format seconds to mm:ss
  const formatDuration = (seconds?: number) => {
    if (!seconds && seconds !== 0) return '0s'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins === 0) return `${secs}s`
    return `${mins}m ${secs}s`
  }

  return (
    <div className='p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto print:p-0 print:space-y-4 print:max-w-none'>
      {/* PRINT-ONLY EXECUTIVE HEADER */}
      <div className='hidden print:block mb-4 border-b border-gray-300 pb-3'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-bold text-gray-900'>BÁO CÁO PHÂN TÍCH LƯU LƯỢNG EDUMAP AI (GA4)</h1>
            <p className='text-xs text-gray-600 mt-0.5'>
              Khoảng thời gian: {DATE_RANGE_LABELS[dateRange].vi} • Ngày xuất: {new Date().toLocaleDateString('vi-VN')}
            </p>
          </div>
          <div className='text-right text-[11px] text-gray-500'>
            <div>Mã GA4 Property: {status?.propertyId || '559513268'}</div>
            <div>Nền tảng: edumapai.io.vn</div>
          </div>
        </div>
      </div>

      {/* HEADER SECTION */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden'>
        <div>
          <div className='flex items-center gap-2.5'>
            <div className='p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl'>
              <BarChart3 className='w-6 h-6' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white tracking-tight'>
                Phân tích & Thống kê GA4
              </h1>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Báo cáo lưu lượng truy cập, tương tác người dùng theo Google Analytics 4
              </p>
            </div>
          </div>
        </div>

        {/* CONTROLS (Date Filter, Refresh & Export) */}
        <div className='flex items-center gap-2.5 flex-wrap'>
          {/* Status Badge */}
          {!isStatusLoading && status && (
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                status.isConfigured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${status.isConfigured ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              {status.isConfigured ? `Live GA4 (${status.propertyId})` : 'Chưa cấu hình GA4'}
            </div>
          )}

          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRangeOption)}
            className='px-3.5 py-1.5 bg-white dark:bg-[#1a191d] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
          >
            <option value='today'>{DATE_RANGE_LABELS.today.vi}</option>
            <option value='yesterday'>{DATE_RANGE_LABELS.yesterday.vi}</option>
            <option value='7daysAgo'>{DATE_RANGE_LABELS['7daysAgo'].vi}</option>
            <option value='30daysAgo'>{DATE_RANGE_LABELS['30daysAgo'].vi}</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={handleRefreshAll}
            disabled={isOverviewFetching}
            className='inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-[#1a191d] hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors shadow-2xs disabled:opacity-50'
          >
            <RefreshCw className={`w-4 h-4 ${isOverviewFetching ? 'animate-spin text-indigo-500' : ''}`} />
            <span>Làm mới</span>
          </button>

          {/* Export Dropdown Button */}
          <div className='relative'>
            <button
              onClick={() => setExportMenuOpen((prev) => !prev)}
              className='inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-2xs cursor-pointer'
            >
              <Download className='w-4 h-4' />
              <span>Xuất báo cáo</span>
              <ChevronDown className='w-3.5 h-3.5 opacity-80' />
            </button>

            {exportMenuOpen && (
              <>
                <div className='fixed inset-0 z-20' onClick={() => setExportMenuOpen(false)} />
                <div className='absolute right-0 mt-2 w-60 bg-white dark:bg-[#1a191d] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl z-30 p-1.5 animate-in fade-in zoom-in-95 duration-150'>
                  <button
                    onClick={() => {
                      exportAnalyticsToExcel({
                        dateRangeLabel: DATE_RANGE_LABELS[dateRange].vi,
                        propertyId: status?.propertyId,
                        overview,
                        timeseries,
                        topPages,
                        sources,
                        devices,
                      })
                      setExportMenuOpen(false)
                    }}
                    className='w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 text-xs font-medium transition-colors cursor-pointer'
                  >
                    <div className='p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0'>
                      <FileSpreadsheet className='w-4 h-4' />
                    </div>
                    <div>
                      <div className='font-semibold'>Xuất file Excel (.csv)</div>
                      <div className='text-[10px] text-gray-400'>Mở trực tiếp bằng Microsoft Excel</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      exportAnalyticsToPDF()
                      setExportMenuOpen(false)
                    }}
                    className='w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 text-xs font-medium transition-colors cursor-pointer mt-0.5'
                  >
                    <div className='p-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg shrink-0'>
                      <FileText className='w-4 h-4' />
                    </div>
                    <div>
                      <div className='font-semibold'>Xuất file PDF / In báo cáo</div>
                      <div className='text-[10px] text-gray-400'>Lưu dưới dạng PDF định dạng A4</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* UNCONFIGURED ALERT BANNER */}
      {!isStatusLoading && status && !status.isConfigured && (
        <div className='p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl flex items-start gap-3 text-amber-800 dark:text-amber-300 text-sm'>
          <div className='p-1.5 bg-amber-500/10 rounded-lg shrink-0 mt-0.5'>
            <Activity className='w-4 h-4 text-amber-600 dark:text-amber-400' />
          </div>
          <div>
            <p className='font-semibold'>Google Analytics 4 chưa được kết nối trên máy chủ</p>
            <p className='mt-1 text-xs text-amber-700 dark:text-amber-400/90 leading-relaxed'>
              Vui lòng bổ sung 3 biến môi trường{' '}
              <code className='px-1 py-0.5 bg-amber-100 dark:bg-amber-900/50 rounded font-mono font-medium'>
                GA_PROPERTY_ID
              </code>
              ,{' '}
              <code className='px-1 py-0.5 bg-amber-100 dark:bg-amber-900/50 rounded font-mono font-medium'>
                GA_CLIENT_EMAIL
              </code>{' '}
              và{' '}
              <code className='px-1 py-0.5 bg-amber-100 dark:bg-amber-900/50 rounded font-mono font-medium'>
                GA_PRIVATE_KEY
              </code>{' '}
              vào file{' '}
              <code className='px-1 py-0.5 bg-amber-100 dark:bg-amber-900/50 rounded font-mono font-medium'>.env</code>{' '}
              trên máy chủ production để lấy số liệu thực tế từ GA4.
            </p>
          </div>
        </div>
      )}

      {/* REALTIME PULSE WIDGET & TOP KPI CARDS */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Realtime Card */}
        <div className='bg-linear-to-br from-indigo-600 to-violet-700 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='relative flex h-3 w-3'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75' />
                <span className='relative inline-flex rounded-full h-3 w-3 bg-emerald-400' />
              </span>
              <span className='text-xs font-semibold tracking-wider uppercase text-indigo-100'>Realtime (30 phút)</span>
            </div>
            <Radio className='w-4 h-4 text-indigo-200' />
          </div>

          <div className='my-3'>
            <div className='text-4xl font-extrabold tracking-tight'>
              {realtime ? realtime.activeUsers : <Skeleton width={60} />}
            </div>
            <div className='text-xs text-indigo-100 mt-1'>Người dùng đang online (30 phút qua)</div>
          </div>

          <div className='pt-2 border-t border-white/15 text-xs text-indigo-200'>
            <div className='truncate'>
              {realtime?.topActivePages && realtime.topActivePages.length > 0 ? (
                <span>Đang xem: {realtime.topActivePages[0].pagePath}</span>
              ) : (
                <span>Chưa có phiên truy cập đang hoạt động</span>
              )}
            </div>
            <div className='text-[10px] text-indigo-200/80 mt-1 leading-tight'>
              *Tính người dùng có thao tác trong 30 phút qua (chuẩn GA4)
            </div>
          </div>
        </div>

        {/* KPI 1: Active Users */}
        <div className='bg-white dark:bg-[#1a191d] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-2xs flex flex-col justify-between'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
              Người dùng hoạt động
            </span>
            <div className='p-2 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-lg'>
              <Users className='w-4 h-4' />
            </div>
          </div>
          <div className='my-2'>
            <div className='text-3xl font-bold text-gray-900 dark:text-white'>
              {isOverviewLoading ? <Skeleton width={80} /> : (overview?.activeUsers ?? 0).toLocaleString()}
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1'>
              <span className='text-emerald-600 dark:text-emerald-400 font-medium'>
                +{(overview?.newUsers ?? 0).toLocaleString()}
              </span>
              <span>người dùng mới</span>
            </div>
          </div>
          <div className='text-xs text-gray-400 dark:text-gray-500'>Đo lường trong khoảng thời gian chọn</div>
        </div>

        {/* KPI 2: Sessions & Pageviews */}
        <div className='bg-white dark:bg-[#1a191d] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-2xs flex flex-col justify-between'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
              Lượt xem trang & Phiên
            </span>
            <div className='p-2 bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 rounded-lg'>
              <Eye className='w-4 h-4' />
            </div>
          </div>
          <div className='my-2'>
            <div className='text-3xl font-bold text-gray-900 dark:text-white'>
              {isOverviewLoading ? <Skeleton width={80} /> : (overview?.screenPageViews ?? 0).toLocaleString()}
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
              Tổng số phiên:{' '}
              <span className='font-semibold text-gray-700 dark:text-gray-300'>
                {(overview?.sessions ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
          <div className='text-xs text-gray-400 dark:text-gray-500'>Lượt xem màn hình (Page Views)</div>
        </div>

        {/* KPI 3: Engagement & Bounce Rate */}
        <div className='bg-white dark:bg-[#1a191d] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-2xs flex flex-col justify-between'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
              Thời gian & Tỷ lệ thoát
            </span>
            <div className='p-2 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 rounded-lg'>
              <Clock className='w-4 h-4' />
            </div>
          </div>
          <div className='my-2'>
            <div className='text-3xl font-bold text-gray-900 dark:text-white'>
              {isOverviewLoading ? <Skeleton width={80} /> : formatDuration(overview?.averageSessionDuration)}
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
              Tỷ lệ thoát (Bounce Rate):{' '}
              <span className='font-semibold text-gray-700 dark:text-gray-300'>
                {overview ? `${Math.round((overview.bounceRate ?? 0) * 100)}%` : '0%'}
              </span>
            </div>
          </div>
          <div className='text-xs text-gray-400 dark:text-gray-500'>Thời lượng phiên trung bình</div>
        </div>
      </div>

      {/* TIMESERIES CHART SECTION */}
      <div className='bg-white dark:bg-[#1a191d] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-2xs'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6'>
          <div>
            <h2 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
              <TrendingUp className='w-5 h-5 text-indigo-500' />
              <span>Biểu đồ tăng trưởng theo ngày</span>
            </h2>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
              Biến thiên số lượng người dùng hoạt động và lượt xem trang
            </p>
          </div>

          <div className='flex items-center gap-4 text-xs font-medium'>
            <div className='flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400'>
              <span className='w-3 h-1.5 bg-indigo-500 rounded-full' />
              <span>Người dùng (Active Users)</span>
            </div>
            <div className='flex items-center gap-1.5 text-violet-500 dark:text-violet-400'>
              <span className='w-3 h-1.5 bg-violet-400 rounded-full' />
              <span>Lượt xem (Page Views)</span>
            </div>
          </div>
        </div>

        {/* SVG Area Chart */}
        {isTimeseriesLoading ? (
          <div className='h-64 flex items-center justify-center'>
            <Skeleton height={200} width='100%' />
          </div>
        ) : timeseries.length === 0 ? (
          <div className='h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200 dark:border-white/10 rounded-xl'>
            <Activity className='w-10 h-10 text-gray-300 dark:text-gray-600 mb-2' />
            <p className='text-sm font-medium text-gray-600 dark:text-gray-300'>Chưa có dữ liệu chuỗi thời gian</p>
            <p className='text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-sm'>
              Dữ liệu chuỗi thời gian sẽ được Google Analytics tự động cập nhật sau khi có các phiên truy cập trang web.
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {/* Custom SVG Line Chart */}
            <div className='relative h-60 w-full'>
              <svg className='w-full h-full overflow-visible' viewBox='0 0 800 200' preserveAspectRatio='none'>
                <defs>
                  <linearGradient id='userGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                    <stop offset='0%' stopColor='#6366f1' stopOpacity='0.3' />
                    <stop offset='100%' stopColor='#6366f1' stopOpacity='0.0' />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Lines */}
                <line
                  x1='0'
                  y1='50'
                  x2='800'
                  y2='50'
                  stroke='currentColor'
                  className='text-gray-100 dark:text-white/5'
                />
                <line
                  x1='0'
                  y1='100'
                  x2='800'
                  y2='100'
                  stroke='currentColor'
                  className='text-gray-100 dark:text-white/5'
                />
                <line
                  x1='0'
                  y1='150'
                  x2='800'
                  y2='150'
                  stroke='currentColor'
                  className='text-gray-100 dark:text-white/5'
                />

                {/* Path Lines & Points */}
                {(() => {
                  const points = timeseries
                  const n = points.length
                  const maxVal = Math.max(...points.map((p) => p.activeUsers), 10)
                  const stepX = 800 / Math.max(n - 1, 1)

                  const coords = points.map((p, i) => {
                    const x = i * stepX
                    const y = 180 - (p.activeUsers / maxVal) * 150
                    return { x, y, p }
                  })

                  const pathD = coords.reduce((acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '')
                  const areaD = `${pathD} L ${coords[coords.length - 1].x} 190 L 0 190 Z`

                  return (
                    <>
                      <path d={areaD} fill='url(#userGradient)' />
                      <path d={pathD} fill='none' stroke='#6366f1' strokeWidth='3' strokeLinecap='round' />
                      {coords.map((c, i) => (
                        <circle
                          key={i}
                          cx={c.x}
                          cy={c.y}
                          r='4'
                          fill='#ffffff'
                          stroke='#6366f1'
                          strokeWidth='2.5'
                          className='transition-transform hover:scale-150'
                        >
                          <title>{`${c.p.date}: ${c.p.activeUsers} users`}</title>
                        </circle>
                      ))}
                    </>
                  )
                })()}
              </svg>
            </div>

            {/* X-axis date labels */}
            <div className='flex justify-between text-[11px] text-gray-400 dark:text-gray-500 px-1 pt-1 border-t border-gray-100 dark:border-white/5'>
              {timeseries.map((pt, i) => {
                if (timeseries.length > 7 && i % 2 !== 0 && i !== timeseries.length - 1) return null
                return <span key={pt.date}>{pt.date.slice(5)}</span>
              })}
            </div>
          </div>
        )}
      </div>

      {/* TWO COLUMNS SECTION: TOP PAGES & TRAFFIC SOURCES */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Top Pages Table */}
        <div className='bg-white dark:bg-[#1a191d] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-2xs flex flex-col justify-between'>
          <div>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-base font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                <Eye className='w-4 h-4 text-indigo-500' />
                <span>Nội dung xem nhiều nhất</span>
              </h2>
              <span className='text-xs text-gray-400 dark:text-gray-500'>Top {topPages.length} trang</span>
            </div>

            {isTopPagesLoading ? (
              <div className='space-y-3'>
                <Skeleton count={5} height={32} />
              </div>
            ) : topPages.length === 0 ? (
              <p className='text-sm text-gray-400 dark:text-gray-500 text-center py-8'>Chưa có dữ liệu trang xem</p>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full text-left text-xs'>
                  <thead>
                    <tr className='text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-white/5 pb-2 font-medium'>
                      <th className='pb-2'>Đường dẫn trang</th>
                      <th className='pb-2 text-right'>Lượt xem</th>
                      <th className='pb-2 text-right'>Người xem</th>
                      <th className='pb-2 text-right'>T.gian TB</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100 dark:divide-white/5'>
                    {topPages.map((page, idx) => (
                      <tr key={idx} className='hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors'>
                        <td className='py-2.5 pr-2 max-w-[200px] truncate font-medium text-gray-800 dark:text-gray-200'>
                          <span className='text-indigo-600 dark:text-indigo-400 mr-1.5'>#{idx + 1}</span>
                          <span title={page.pageTitle || page.pagePath}>{page.pagePath}</span>
                        </td>
                        <td className='py-2.5 text-right font-semibold text-gray-900 dark:text-white'>
                          {page.screenPageViews.toLocaleString()}
                        </td>
                        <td className='py-2.5 text-right text-gray-500 dark:text-gray-400'>
                          {page.activeUsers.toLocaleString()}
                        </td>
                        <td className='py-2.5 text-right text-gray-500 dark:text-gray-400'>
                          {formatDuration(page.averageEngagementDuration)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Traffic Sources & Channels */}
        <div className='bg-white dark:bg-[#1a191d] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-2xs flex flex-col justify-between'>
          <div>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4'>
              <div>
                <h2 className='text-base font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                  <Share2 className='w-4 h-4 text-pink-500' />
                  <span>Nguồn lưu lượng & Mạng xã hội</span>
                </h2>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                  Phân loại người dùng đến từ Facebook, Instagram, Google, Direct...
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div className='flex items-center gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-xl text-xs font-medium'>
                <button
                  type='button'
                  onClick={() => setSourceCategory('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    sourceCategory === 'all'
                      ? 'bg-white dark:bg-[#25242a] text-indigo-600 dark:text-indigo-400 shadow-2xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Tất cả ({sources.length})
                </button>
                <button
                  type='button'
                  onClick={() => setSourceCategory('social')}
                  className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    sourceCategory === 'social'
                      ? 'bg-white dark:bg-[#25242a] text-pink-600 dark:text-pink-400 shadow-2xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span>Mạng XH</span>
                  {socialStats.socialSessions > 0 && (
                    <span className='w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse' />
                  )}
                </button>
                <button
                  type='button'
                  onClick={() => setSourceCategory('search')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    sourceCategory === 'search'
                      ? 'bg-white dark:bg-[#25242a] text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Google
                </button>
                <button
                  type='button'
                  onClick={() => setSourceCategory('direct')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    sourceCategory === 'direct'
                      ? 'bg-white dark:bg-[#25242a] text-indigo-600 dark:text-indigo-400 shadow-2xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Trực tiếp
                </button>
              </div>
            </div>

            {/* Quick Stat Badges */}
            <div className='grid grid-cols-3 gap-2 mb-4'>
              <div className='p-2.5 bg-pink-50/50 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/30 rounded-xl text-center'>
                <div className='text-xs text-pink-700 dark:text-pink-400 font-medium flex items-center justify-center gap-1'>
                  <FaFacebook className='w-3 h-3 text-[#1877F2]' />
                  <FaInstagram className='w-3 h-3 text-[#E4405F]' />
                  <span>Mạng xã hội</span>
                </div>
                <div className='text-base font-bold text-gray-900 dark:text-white mt-0.5'>
                  {socialStats.socialSessions.toLocaleString()}{' '}
                  <span className='text-[10px] font-normal text-gray-500'>phiên</span>
                </div>
              </div>

              <div className='p-2.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl text-center'>
                <div className='text-xs text-blue-700 dark:text-blue-400 font-medium flex items-center justify-center gap-1'>
                  <FaGoogle className='w-3 h-3 text-[#4285F4]' />
                  <span>Google</span>
                </div>
                <div className='text-base font-bold text-gray-900 dark:text-white mt-0.5'>
                  {socialStats.searchSessions.toLocaleString()}{' '}
                  <span className='text-[10px] font-normal text-gray-500'>phiên</span>
                </div>
              </div>

              <div className='p-2.5 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl text-center'>
                <div className='text-xs text-indigo-700 dark:text-indigo-400 font-medium flex items-center justify-center gap-1'>
                  <Compass className='w-3 h-3 text-indigo-500' />
                  <span>Trực tiếp</span>
                </div>
                <div className='text-base font-bold text-gray-900 dark:text-white mt-0.5'>
                  {socialStats.directSessions.toLocaleString()}{' '}
                  <span className='text-[10px] font-normal text-gray-500'>phiên</span>
                </div>
              </div>
            </div>

            {isSourcesLoading ? (
              <div className='space-y-3'>
                <Skeleton count={5} height={40} />
              </div>
            ) : filteredSources.length === 0 ? (
              <div className='text-center py-6 px-4 bg-gray-50 dark:bg-white/5 rounded-xl'>
                <p className='text-sm text-gray-500 dark:text-gray-400 font-medium'>
                  Chưa có dữ liệu nguồn truy cập {sourceCategory !== 'all' ? 'cho mục này' : ''}
                </p>
                <p className='text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed'>
                  Google Analytics 4 cập nhật báo cáo kênh truy cập định kỳ. Thử chuyển bộ lọc sang &quot;7 ngày
                  qua&quot; hoặc &quot;30 ngày qua&quot; để xem dữ liệu tích luỹ.
                </p>
              </div>
            ) : (
              <div className='space-y-3 max-h-80 overflow-y-auto pr-1'>
                {filteredSources.map((src, idx) => {
                  const meta = getSourceMeta(src.source, src.medium, src.channelGroup)
                  const SourceIcon = meta.Icon
                  const maxSessions = Math.max(...sources.map((s) => s.sessions), 1)
                  const percent = Math.round((src.sessions / maxSessions) * 100)

                  return (
                    <div
                      key={idx}
                      className='p-2.5 bg-gray-50/80 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl space-y-2 hover:bg-gray-100/60 dark:hover:bg-white/10 transition-colors'
                    >
                      <div className='flex items-center justify-between gap-2 text-xs'>
                        <div className='flex items-center gap-2.5 min-w-0'>
                          <div className={`p-1.5 rounded-lg ${meta.bg} ${meta.color} shrink-0`}>
                            <SourceIcon className='w-4 h-4' />
                          </div>
                          <div className='truncate'>
                            <div className='font-semibold text-gray-900 dark:text-white truncate flex items-center gap-1.5'>
                              <span>{meta.label}</span>
                              <span className='px-1.5 py-0.2 bg-gray-200/60 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded text-[10px] font-normal'>
                                {meta.badge}
                              </span>
                            </div>
                            <div className='text-[10px] text-gray-400 truncate mt-0.5'>{meta.sub}</div>
                          </div>
                        </div>

                        <div className='text-right shrink-0'>
                          <div className='font-bold text-gray-800 dark:text-gray-200'>
                            {src.sessions.toLocaleString()}{' '}
                            <span className='text-[10px] font-normal text-gray-500'>phiên</span>
                          </div>
                          <div className='text-[10px] text-gray-400'>{src.activeUsers} người dùng</div>
                        </div>
                      </div>

                      <div className='w-full bg-gray-200/60 dark:bg-white/10 rounded-full h-1.5 overflow-hidden'>
                        <div
                          className='bg-linear-to-r from-pink-500 via-indigo-500 to-teal-400 h-1.5 rounded-full transition-all duration-500'
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Campaign Tracking Tips */}
          <div className='mt-4 pt-3 border-t border-gray-100 dark:border-white/10 flex items-start gap-2 text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-2.5 rounded-xl'>
            <Info className='w-4 h-4 text-indigo-500 shrink-0 mt-0.5' />
            <p className='leading-relaxed'>
              <span className='font-semibold text-gray-700 dark:text-gray-300'>Mẹo theo dõi chiến dịch:</span> Khi đăng
              link trên Facebook/Instagram/TikTok, thêm đuôi{' '}
              <code className='px-1 py-0.5 bg-gray-200 dark:bg-white/10 rounded font-mono text-indigo-600 dark:text-indigo-400'>
                ?utm_source=facebook
              </code>{' '}
              hoặc{' '}
              <code className='px-1 py-0.5 bg-gray-200 dark:bg-white/10 rounded font-mono text-pink-600 dark:text-pink-400'>
                ?utm_source=instagram
              </code>{' '}
              để GA4 nhận diện chuẩn xác 100%.
            </p>
          </div>
        </div>
      </div>

      {/* TWO COLUMNS SECTION: DEVICES & CUSTOM EVENTS */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Devices Breakdown */}
        <div className='bg-white dark:bg-[#1a191d] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-2xs'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-base font-bold text-gray-900 dark:text-white flex items-center gap-2'>
              <Laptop className='w-4 h-4 text-blue-500' />
              <span>Phân bố thiết bị & Trình duyệt</span>
            </h2>
            <span className='text-xs text-gray-400 dark:text-gray-500'>Thiết bị</span>
          </div>

          {isDevicesLoading ? (
            <div className='space-y-3'>
              <Skeleton count={4} height={32} />
            </div>
          ) : devices.length === 0 ? (
            <p className='text-sm text-gray-400 dark:text-gray-500 text-center py-8'>Chưa có dữ liệu thiết bị</p>
          ) : (
            <div className='space-y-3'>
              {devices.slice(0, 5).map((dev, idx) => {
                const getIcon = () => {
                  const cat = dev.deviceCategory?.toLowerCase()
                  if (cat === 'mobile') return <Smartphone className='w-4 h-4 text-sky-500' />
                  if (cat === 'tablet') return <Tablet className='w-4 h-4 text-purple-500' />
                  return <Laptop className='w-4 h-4 text-blue-500' />
                }

                return (
                  <div
                    key={idx}
                    className='flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-xs'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='p-2 bg-white dark:bg-white/10 rounded-lg shadow-2xs'>{getIcon()}</div>
                      <div>
                        <div className='font-semibold text-gray-800 dark:text-gray-200 capitalize'>
                          {dev.deviceCategory} • {dev.operatingSystem}
                        </div>
                        <div className='text-[11px] text-gray-400 dark:text-gray-500'>Trình duyệt: {dev.browser}</div>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='font-bold text-gray-900 dark:text-white'>
                        {dev.sessions.toLocaleString()} phiên
                      </div>
                      <div className='text-[11px] text-gray-400'>{dev.activeUsers} users</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Custom Events Activity */}
        <div className='bg-white dark:bg-[#1a191d] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-2xs'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-base font-bold text-gray-900 dark:text-white flex items-center gap-2'>
              <Zap className='w-4 h-4 text-amber-500' />
              <span>Sự kiện tương tác EduMapAI</span>
            </h2>
            <span className='text-xs text-gray-400 dark:text-gray-500'>Custom Events</span>
          </div>

          {isEventsLoading ? (
            <div className='space-y-3'>
              <Skeleton count={4} height={32} />
            </div>
          ) : events.length === 0 ? (
            <p className='text-sm text-gray-400 dark:text-gray-500 text-center py-8'>
              Chưa có sự kiện nào được ghi nhận
            </p>
          ) : (
            <div className='space-y-2.5'>
              {events.map((evt, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/5 text-xs'
                >
                  <div className='flex items-center gap-2.5'>
                    <span className='p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[11px] font-semibold'>
                      #{idx + 1}
                    </span>
                    <span className='font-mono font-medium text-gray-800 dark:text-gray-200'>{evt.eventName}</span>
                  </div>
                  <div className='text-right'>
                    <span className='font-bold text-gray-900 dark:text-white'>
                      {evt.eventCount.toLocaleString()} lần
                    </span>
                    <span className='text-[11px] text-gray-400 dark:text-gray-500 ml-2'>({evt.totalUsers} users)</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
