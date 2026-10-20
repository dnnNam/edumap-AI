import { useMemo, useState } from 'react'
import {
  Activity,
  BarChart3,
  Clock,
  Eye,
  Globe,
  Laptop,
  Radio,
  RefreshCw,
  Smartphone,
  Tablet,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import Skeleton from 'react-loading-skeleton'
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

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRangeOption>('7daysAgo')

  const queryParams = useMemo(() => {
    return {
      startDate: dateRange,
      endDate: 'today',
    }
  }, [dateRange])

  // Queries
  const { data: statusRes, isLoading: isStatusLoading } = useAnalyticsStatusQuery()
  const {
    data: overviewRes,
    isLoading: isOverviewLoading,
    refetch: refetchOverview,
    isFetching: isOverviewFetching,
  } = useAnalyticsOverviewQuery(queryParams)
  const { data: realtimeRes } = useAnalyticsRealtimeQuery()
  const { data: timeseriesRes, isLoading: isTimeseriesLoading } = useAnalyticsTimeseriesQuery(queryParams)
  const { data: topPagesRes, isLoading: isTopPagesLoading } = useAnalyticsTopPagesQuery({ ...queryParams, limit: 7 })
  const { data: sourcesRes, isLoading: isSourcesLoading } = useAnalyticsTrafficSourcesQuery({
    ...queryParams,
    limit: 6,
  })
  const { data: devicesRes, isLoading: isDevicesLoading } = useAnalyticsDevicesQuery(queryParams)
  const { data: eventsRes, isLoading: isEventsLoading } = useAnalyticsEventsQuery({ ...queryParams, limit: 6 })

  const status = statusRes?.data?.data
  const overview = overviewRes?.data?.data
  const realtime = realtimeRes?.data?.data
  const timeseries = timeseriesRes?.data?.data ?? []
  const topPages = topPagesRes?.data?.data ?? []
  const sources = sourcesRes?.data?.data ?? []
  const devices = devicesRes?.data?.data ?? []
  const events = eventsRes?.data?.data ?? []

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
    <div className='p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto'>
      {/* HEADER SECTION */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
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

        {/* CONTROLS (Date Filter & Refresh) */}
        <div className='flex items-center gap-2.5 flex-wrap'>
          {/* Status Badge */}
          {!isStatusLoading && status && (
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                status.mode === 'real'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${status.mode === 'real' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {status.mode === 'real' ? `Live GA4 (${status.propertyId})` : 'Mock Demo Mode'}
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
        </div>
      </div>

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
            <div className='text-xs text-indigo-100 mt-1'>Người dùng đang online ngay lúc này</div>
          </div>

          <div className='pt-2 border-t border-white/15 text-xs text-indigo-200 truncate'>
            {realtime?.topActivePages && realtime.topActivePages.length > 0 ? (
              <span>Đang xem: {realtime.topActivePages[0].pagePath}</span>
            ) : (
              <span>Chưa có phiên truy cập đang hoạt động</span>
            )}
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
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-base font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                <Globe className='w-4 h-4 text-emerald-500' />
                <span>Nguồn lưu lượng truy cập (Traffic Sources)</span>
              </h2>
              <span className='text-xs text-gray-400 dark:text-gray-500'>Kênh người dùng</span>
            </div>

            {isSourcesLoading ? (
              <div className='space-y-3'>
                <Skeleton count={5} height={32} />
              </div>
            ) : sources.length === 0 ? (
              <p className='text-sm text-gray-400 dark:text-gray-500 text-center py-8'>
                Chưa có dữ liệu nguồn truy cập
              </p>
            ) : (
              <div className='space-y-3.5'>
                {sources.map((src, idx) => {
                  const maxSessions = Math.max(...sources.map((s) => s.sessions), 1)
                  const percent = Math.round((src.sessions / maxSessions) * 100)

                  return (
                    <div key={idx} className='space-y-1.5'>
                      <div className='flex items-center justify-between text-xs'>
                        <span className='font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5'>
                          <span className='w-2 h-2 rounded-full bg-emerald-500' />
                          {src.channelGroup} ({src.source} / {src.medium})
                        </span>
                        <span className='font-medium text-gray-500 dark:text-gray-400'>
                          {src.sessions.toLocaleString()} phiên ({src.activeUsers} users)
                        </span>
                      </div>
                      <div className='w-full bg-gray-100 dark:bg-white/5 rounded-full h-2 overflow-hidden'>
                        <div
                          className='bg-linear-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500'
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
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
