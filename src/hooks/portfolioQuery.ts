import { useQuery } from '@tanstack/react-query'
import { portfolioRepo } from '../repository/portfolio.repo'

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
