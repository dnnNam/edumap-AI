import type { ApiResponse } from './auth.types'

export interface AnalyticsStatus {
  isConfigured: boolean
  propertyId: string | null
  message: string
}

export interface AnalyticsOverview {
  activeUsers: number
  newUsers: number
  sessions: number
  screenPageViews: number
  averageSessionDuration: number // seconds
  bounceRate: number // 0 to 1
  userEngagementDuration: number // seconds
}

export interface AnalyticsTimeseriesPoint {
  date: string // YYYY-MM-DD
  activeUsers: number
  sessions: number
  screenPageViews: number
}

export interface AnalyticsRealtime {
  activeUsers: number
  topActivePages: Array<{
    pagePath: string
    activeUsers: number
  }>
  topCountries: Array<{
    country: string
    activeUsers: number
  }>
  topDeviceCategories: Array<{
    deviceCategory: string
    activeUsers: number
  }>
}

export interface AnalyticsTopPage {
  pagePath: string
  pageTitle: string
  screenPageViews: number
  activeUsers: number
  averageEngagementDuration: number
}

export interface AnalyticsTrafficSource {
  channelGroup: string
  source: string
  medium: string
  sessions: number
  activeUsers: number
}

export interface AnalyticsDeviceItem {
  deviceCategory: string
  operatingSystem: string
  browser: string
  sessions: number
  activeUsers: number
}

export interface AnalyticsCustomEvent {
  eventName: string
  eventCount: number
  totalUsers: number
}

export interface AnalyticsQueryParams {
  startDate?: string
  endDate?: string
  limit?: number
  interval?: 'daily' | 'weekly'
}

export type AnalyticsStatusResponse = ApiResponse<AnalyticsStatus>
export type AnalyticsOverviewResponse = ApiResponse<AnalyticsOverview>
export type AnalyticsTimeseriesResponse = ApiResponse<AnalyticsTimeseriesPoint[]>
export type AnalyticsRealtimeResponse = ApiResponse<AnalyticsRealtime>
export type AnalyticsTopPagesResponse = ApiResponse<AnalyticsTopPage[]>
export type AnalyticsTrafficSourcesResponse = ApiResponse<AnalyticsTrafficSource[]>
export type AnalyticsDevicesResponse = ApiResponse<AnalyticsDeviceItem[]>
export type AnalyticsEventsResponse = ApiResponse<AnalyticsCustomEvent[]>
