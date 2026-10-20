import type {
  AnalyticsDeviceItem,
  AnalyticsOverview,
  AnalyticsTimeseriesPoint,
  AnalyticsTopPage,
  AnalyticsTrafficSource,
} from '../types/api/analytics.type'

export interface AnalyticsExportData {
  dateRangeLabel: string
  propertyId?: string | null
  overview?: AnalyticsOverview
  timeseries?: AnalyticsTimeseriesPoint[]
  topPages?: AnalyticsTopPage[]
  sources?: AnalyticsTrafficSource[]
  devices?: AnalyticsDeviceItem[]
}

/**
 * Xuất dữ liệu thống kê ra file Excel (CSV chuẩn UTF-8 có BOM)
 */
export function exportAnalyticsToExcel(data: AnalyticsExportData): void {
  const { dateRangeLabel, propertyId, overview, timeseries, topPages, sources, devices } = data

  const rows: string[] = []

  // Helper escape CSV cell
  const escapeCell = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""'
    const str = String(val).replace(/"/g, '""')
    return `"${str}"`
  }

  const addRow = (...cells: (string | number | undefined | null)[]) => {
    rows.push(cells.map(escapeCell).join(','))
  }

  const addEmptyRow = () => rows.push('')

  // 1. HEADER
  addRow('BÁO CÁO PHÂN TÍCH GOOGLE ANALYTICS 4 - EDUMAP AI')
  addRow('Ngày xuất báo cáo', new Date().toLocaleString('vi-VN'))
  addRow('Khoảng thời gian', dateRangeLabel)
  addRow('Mã GA4 Property ID', propertyId || '559513268')
  addEmptyRow()

  // 2. OVERVIEW KPI
  addRow('=== 1. CHỈ SỐ TỔNG QUAN (OVERVIEW) ===')
  addRow('Chỉ số', 'Giá trị', 'Đơn vị')
  addRow('Người dùng hoạt động (Active Users)', overview?.activeUsers ?? 0, 'Người')
  addRow('Người dùng mới (New Users)', overview?.newUsers ?? 0, 'Người')
  addRow('Tổng số phiên truy cập (Sessions)', overview?.sessions ?? 0, 'Phiên')
  addRow('Lượt xem màn hình (Page Views)', overview?.screenPageViews ?? 0, 'Lượt')
  addRow('Thời lượng phiên trung bình', Math.round(overview?.averageSessionDuration ?? 0), 'Giây')
  addRow('Tỷ lệ thoát (Bounce Rate)', `${((overview?.bounceRate ?? 0) * 100).toFixed(1)}%`, '%')
  addEmptyRow()

  // 3. TRAFFIC SOURCES & SOCIAL
  addRow('=== 2. NGUỒN TRUY CẬP & MẠNG XÃ HỘI (TRAFFIC SOURCES) ===')
  addRow(
    'Nhóm kênh (Channel)',
    'Nguồn (Source)',
    'Phương tiện (Medium)',
    'Số phiên (Sessions)',
    'Số người dùng (Users)',
  )
  if (sources && sources.length > 0) {
    for (const src of sources) {
      addRow(src.channelGroup, src.source, src.medium, src.sessions, src.activeUsers)
    }
  } else {
    addRow('Chưa có dữ liệu nguồn truy cập trong khoảng thời gian này')
  }
  addEmptyRow()

  // 4. TOP PAGES
  addRow('=== 3. TOP TRANG ĐƯỢC XEM NHIỀU NHẤT (TOP PAGES) ===')
  addRow('Đường dẫn (Path)', 'Tiêu đề trang', 'Lượt xem (Views)', 'Người dùng (Users)', 'Thời gian tương tác TB (giây)')
  if (topPages && topPages.length > 0) {
    for (const page of topPages) {
      addRow(
        page.pagePath,
        page.pageTitle,
        page.screenPageViews,
        page.activeUsers,
        Math.round(page.averageEngagementDuration),
      )
    }
  } else {
    addRow('Chưa có dữ liệu trang xem trong khoảng thời gian này')
  }
  addEmptyRow()

  // 5. DEVICES & BROWSERS
  addRow('=== 4. PHÂN BỐ THIẾT BỊ & TRÌNH DUYỆT (DEVICES) ===')
  addRow('Loại thiết bị', 'Hệ điều hành', 'Trình duyệt', 'Số phiên (Sessions)', 'Số người dùng (Users)')
  if (devices && devices.length > 0) {
    for (const dev of devices) {
      addRow(dev.deviceCategory, dev.operatingSystem, dev.browser, dev.sessions, dev.activeUsers)
    }
  } else {
    addRow('Chưa có dữ liệu thiết bị trong khoảng thời gian này')
  }
  addEmptyRow()

  // 6. TIMESERIES TREND
  addRow('=== 5. BIẾN THIÊN THEO NGÀY (DAILY TREND) ===')
  addRow('Ngày (YYYY-MM-DD)', 'Người dùng hoạt động', 'Số phiên', 'Lượt xem trang')
  if (timeseries && timeseries.length > 0) {
    for (const item of timeseries) {
      addRow(item.date, item.activeUsers, item.sessions, item.screenPageViews)
    }
  } else {
    addRow('Chưa có dữ liệu chuỗi thời gian')
  }

  // Chèn BOM UTF-8 (\uFEFF) để Microsoft Excel hiển thị đúng font Tiếng Việt có dấu
  const csvContent = '\uFEFF' + rows.join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const nowStr = new Date().toISOString().split('T')[0]
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `EduMapAI_BaoCao_GA4_${nowStr}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Xuất dữ liệu báo cáo sang định dạng PDF (sử dụng chức năng In / Lưu PDF chuyên nghiệp của trình duyệt)
 */
export function exportAnalyticsToPDF(): void {
  window.print()
}
