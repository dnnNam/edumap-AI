import { useQuery } from '@tanstack/react-query'
import { jobRepo } from '../repository/job.repo'

export const useTrendingJobsQuery = () => {
  return useQuery({
    queryKey: ['jobs', 'trending'],
    queryFn: () => jobRepo.getTrending(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000, // dữ liệu realtime nhưng không cần gọi lại quá dày
  })
}
