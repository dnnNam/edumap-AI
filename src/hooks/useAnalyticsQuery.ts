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
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useAnalyticsOverviewQuery = (params?: AnalyticsQueryParams, enabled = true) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.overview(params),
    queryFn: () => analyticsRepo.getOverview(params),
    enabled: !!getAccessTokenFromLS() && enabled,
    retry: false,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useAnalyticsTimeseriesQuery = (params?: AnalyticsQueryParams, enabled = true) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.timeseries(params),
    queryFn: () => analyticsRepo.getTimeseries(params),
    enabled: !!getAccessTokenFromLS() && enabled,
    retry: false,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useAnalyticsRealtimeQuery = (enabled = true) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.realtime,
    queryFn: () => analyticsRepo.getRealtime(),
    enabled: !!getAccessTokenFromLS() && enabled,
    retry: false,
    refetchInterval: enabled ? 20 * 1000 : false, // Tự động làm mới mỗi 20 giây khi đã kết nối
    refetchOnWindowFocus: true,
  })
}

export const useAnalyticsTopPagesQuery = (params?: AnalyticsQueryParams, enabled = true) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.topPages(params),
    queryFn: () => analyticsRepo.getTopPages(params),
    enabled: !!getAccessTokenFromLS() && enabled,
    retry: false,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useAnalyticsTrafficSourcesQuery = (params?: AnalyticsQueryParams, enabled = true) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.trafficSources(params),
    queryFn: () => analyticsRepo.getTrafficSources(params),
    enabled: !!getAccessTokenFromLS() && enabled,
    retry: false,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useAnalyticsDevicesQuery = (params?: AnalyticsQueryParams, enabled = true) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.devices(params),
    queryFn: () => analyticsRepo.getDevices(params),
    enabled: !!getAccessTokenFromLS() && enabled,
    retry: false,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useAnalyticsEventsQuery = (params?: AnalyticsQueryParams, enabled = true) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.events(params),
    queryFn: () => analyticsRepo.getEvents(params),
    enabled: !!getAccessTokenFromLS() && enabled,
    retry: false,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
