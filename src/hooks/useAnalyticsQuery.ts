import { useQuery } from '@tanstack/react-query'
import { analyticsRepo } from '../repository/analytics.repo'
import { getAccessTokenFromLS } from '../utils/auth'
import type { AnalyticsQueryParams } from '../types/api/analytics.type'

export const ANALYTICS_KEYS = {
  status: ['analytics-status'] as const,
  overview: (params?: AnalyticsQueryParams) => ['analytics-overview', params] as const,
  timeseries: (params?: AnalyticsQueryParams) => ['analytics-timeseries', params] as const,
  realtime: ['analytics-realtime'] as const,
  topPages: (params?: AnalyticsQueryParams) => ['analytics-top-pages', params] as const,
  trafficSources: (params?: AnalyticsQueryParams) => ['analytics-traffic-sources', params] as const,
  devices: (params?: AnalyticsQueryParams) => ['analytics-devices', params] as const,
  events: (params?: AnalyticsQueryParams) => ['analytics-events', params] as const,
}

export const useAnalyticsStatusQuery = () => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.status,
    queryFn: () => analyticsRepo.getStatus(),
    enabled: !!getAccessTokenFromLS(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useAnalyticsOverviewQuery = (params?: AnalyticsQueryParams) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.overview(params),
    queryFn: () => analyticsRepo.getOverview(params),
    enabled: !!getAccessTokenFromLS(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useAnalyticsTimeseriesQuery = (params?: AnalyticsQueryParams) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.timeseries(params),
    queryFn: () => analyticsRepo.getTimeseries(params),
    enabled: !!getAccessTokenFromLS(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useAnalyticsRealtimeQuery = () => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.realtime,
    queryFn: () => analyticsRepo.getRealtime(),
    enabled: !!getAccessTokenFromLS(),
    refetchInterval: 20 * 1000, // Tự động làm mới mỗi 20 giây để xem realtime
    refetchOnWindowFocus: true,
  })
}

export const useAnalyticsTopPagesQuery = (params?: AnalyticsQueryParams) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.topPages(params),
    queryFn: () => analyticsRepo.getTopPages(params),
    enabled: !!getAccessTokenFromLS(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useAnalyticsTrafficSourcesQuery = (params?: AnalyticsQueryParams) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.trafficSources(params),
    queryFn: () => analyticsRepo.getTrafficSources(params),
    enabled: !!getAccessTokenFromLS(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useAnalyticsDevicesQuery = (params?: AnalyticsQueryParams) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.devices(params),
    queryFn: () => analyticsRepo.getDevices(params),
    enabled: !!getAccessTokenFromLS(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useAnalyticsEventsQuery = (params?: AnalyticsQueryParams) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.events(params),
    queryFn: () => analyticsRepo.getEvents(params),
    enabled: !!getAccessTokenFromLS(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
