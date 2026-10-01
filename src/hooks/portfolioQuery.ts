import { useQuery } from '@tanstack/react-query'
import { portfolioRepo } from '../repository/portfolio.repo'

export const useMyPortfolioQuery = () =>
  useQuery({
    queryKey: ['my-portfolio'],
    queryFn: () => portfolioRepo.getMine(),
    retry: false,
  })
