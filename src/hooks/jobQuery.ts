import { useMutation, useQuery } from '@tanstack/react-query'
import { jobRepo } from '../repository/job.repo'
import type { JobRecommendationPayload } from '../schemas/job.schema'

export const useTrendingJobsQuery = () => {
  return useQuery({
    queryKey: ['jobs', 'trending'],
    queryFn: () => jobRepo.getTrending(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000, // dữ liệu realtime nhưng không cần gọi lại quá dày
  })
}

export const useCheckJobProfileQuery = () => {
  return useQuery({
    queryKey: ['jobs', 'check-profile'],
    queryFn: () => jobRepo.checkProfile(),
    retry: false,
    refetchOnWindowFocus: false,
  })
}

// POST nhưng tốn token AI -> dùng mutation, chỉ chạy khi user bấm nút
export const useJobRecommendationsMutation = () => {
  return useMutation({
    mutationFn: (payload: JobRecommendationPayload) => jobRepo.getRecommendations(payload),
  })
}
