import http from '../config/http'
import type {
  AnalyticsDevicesResponse,
  AnalyticsEventsResponse,
  AnalyticsOverviewResponse,
  AnalyticsQueryParams,
  AnalyticsRealtimeResponse,
  AnalyticsStatusResponse,
  AnalyticsTimeseriesResponse,
  AnalyticsTopPagesResponse,
  AnalyticsTrafficSourcesResponse,
} from '../types/api/analytics.type'

class AnalyticsRepository {
  private readonly PREFIX = '/analytics'

  getStatus() {
    return http.get<AnalyticsStatusResponse>(`${this.PREFIX}/status`)
  }

  getOverview(params?: AnalyticsQueryParams) {
    return http.get<AnalyticsOverviewResponse>(`${this.PREFIX}/overview`, { params })
  }

  getTimeseries(params?: AnalyticsQueryParams) {
    return http.get<AnalyticsTimeseriesResponse>(`${this.PREFIX}/timeseries`, { params })
  }

  getRealtime() {
    return http.get<AnalyticsRealtimeResponse>(`${this.PREFIX}/realtime`)
  }

  getTopPages(params?: AnalyticsQueryParams) {
    return http.get<AnalyticsTopPagesResponse>(`${this.PREFIX}/top-pages`, { params })
  }

  getTrafficSources(params?: AnalyticsQueryParams) {
    return http.get<AnalyticsTrafficSourcesResponse>(`${this.PREFIX}/traffic-sources`, { params })
  }

  getDevices(params?: AnalyticsQueryParams) {
    return http.get<AnalyticsDevicesResponse>(`${this.PREFIX}/devices`, { params })
  }

  getEvents(params?: AnalyticsQueryParams) {
    return http.get<AnalyticsEventsResponse>(`${this.PREFIX}/events`, { params })
  }
}

export const analyticsRepo = new AnalyticsRepository()
