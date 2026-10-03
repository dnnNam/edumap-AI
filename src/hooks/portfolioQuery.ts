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
    refetchOnMount: 'always',
  })

// PATCH /portfolios/my-portfolio/update
export const useUpdatePortfolioMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdatePortfolioBody) => portfolioRepo.updateMine(body),
    onSuccess: (_res, body) => {
      queryClient.invalidateQueries({ queryKey: ['my-portfolio'] })
      if (body.isPublic) {
        queryClient.invalidateQueries({ queryKey: ['public-portfolio'] })
      } else {
        // private thì xoá cache để không còn hiện repo cũ
        queryClient.removeQueries({ queryKey: ['public-portfolio'] })
      }
    },
  })
}
