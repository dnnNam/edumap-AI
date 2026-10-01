import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { portfolioRepo } from '../repository/portfolio.repo'
import type { UpdatePortfolioBody } from '../types/api/portfolio.type'

export const useMyPortfolioQuery = () =>
  useQuery({
    queryKey: ['my-portfolio'],
    queryFn: () => portfolioRepo.getMine(),
    retry: false,
  })

// API thứ 2: chỉ chạy khi đã có slug (lấy từ my-portfolio)
export const usePublicPortfolioQuery = (slug?: string, enabled = true) =>
  useQuery({
    queryKey: ['public-portfolio', slug],
    queryFn: () => portfolioRepo.getPublic(slug as string),
    enabled: !!slug && enabled,
    retry: false,
  })

// PATCH /portfolios/my-portfolio/update
export const useUpdatePortfolioMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdatePortfolioBody) => portfolioRepo.updateMine(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-portfolio'] })
      queryClient.invalidateQueries({ queryKey: ['public-portfolio'] })
    },
  })
}
