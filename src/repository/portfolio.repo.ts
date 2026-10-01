import http from '../config/http'
import type { PortfolioResponse } from '../types/api/portfolio.type'

class PortfolioRepository {
  private readonly PREFIX = '/portfolios'

  // GET /api/v1/portfolios/my-portfolio
  getMine() {
    return http.get<PortfolioResponse>(`${this.PREFIX}/my-portfolio`)
  }
}

export const portfolioRepo = new PortfolioRepository()
