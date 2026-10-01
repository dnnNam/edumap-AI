import http from '../config/http'
import type { PortfolioResponse, PublicPortfolioResponse } from '../types/api/portfolio.type'

class PortfolioRepository {
  private readonly PREFIX = '/portfolios'

  // GET /api/v1/portfolios/my-portfolio
  getMine() {
    return http.get<PortfolioResponse>(`${this.PREFIX}/my-portfolio`)
  }

  // GET /api/v1/portfolios/public/:slug
  getPublic(slug: string) {
    return http.get<PublicPortfolioResponse>(`${this.PREFIX}/public/${encodeURIComponent(slug)}`)
  }
}

export const portfolioRepo = new PortfolioRepository()
