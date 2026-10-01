import { Download, ExternalLink, Mail } from 'lucide-react'
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa'
import Skeleton from 'react-loading-skeleton'
import { useParams } from 'react-router'
import Avatar from '../../components/ui/Avatar'
import { usePublicPortfolioQuery } from '../../hooks/portfolioQuery'
import type { PortfolioRepository } from '../../types/api/portfolio.type'

// Class Tailwind phải viết đầy đủ (không ghép chuỗi) để không bị purge
const THEME = {
  banner: 'from-indigo-100 to-white',
  chip: 'border-indigo-100 bg-indigo-50 text-indigo-700',
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572a5',
  Java: '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  Go: '#00add8',
  Rust: '#dea584',
  PHP: '#4f5d95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Dart: '#00b4ab',
  Kotlin: '#a97bff',
  Swift: '#f05138',
}

const MAX_TECH_CHIPS = 5

function formatMonthYear(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })
}

function RepoCard({ repo, chipCls }: { repo: PortfolioRepository; chipCls: string }) {
  const tech = repo.techStack ?? []
  const shown = tech.slice(0, MAX_TECH_CHIPS)
  const extra = tech.length - shown.length
  const langColor = repo.mainLanguage ? (LANGUAGE_COLORS[repo.mainLanguage] ?? '#9ca3af') : null

  return (
    <a
      href={repo.repoUrl}
      target='_blank'
      rel='noreferrer'
      className='group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm print:break-inside-avoid'
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='flex min-w-0 items-center gap-3'>
          <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white'>
            <FaGithub className='h-4 w-4' />
          </span>
          <h4 className='truncate text-[15px] font-semibold text-gray-900' title={repo.repoName}>
            {repo.repoName}
          </h4>
        </div>
        <ExternalLink className='mt-1 h-4 w-4 shrink-0 text-gray-300 transition group-hover:text-gray-700 print:hidden' />
      </div>

      <div className='mt-4 flex items-center gap-4 text-xs text-gray-500'>
        {repo.mainLanguage && (
          <span className='inline-flex items-center gap-1.5'>
            <span className='h-2.5 w-2.5 rounded-full' style={{ backgroundColor: langColor ?? undefined }} />
            {repo.mainLanguage}
          </span>
        )}
        {formatMonthYear(repo.createdAt) && <span>Cập nhật {formatMonthYear(repo.createdAt)}</span>}
      </div>

      <div className='mt-4 flex flex-1 flex-wrap content-start gap-1.5'>
        {shown.length === 0 ? (
          <span className='text-xs text-gray-400'>Chưa phát hiện tech stack</span>
        ) : (
          <>
            {shown.map((t) => (
              <span key={t} className={`rounded-md border px-2 py-0.5 text-xs ${chipCls}`}>
                {t}
              </span>
            ))}
            {extra > 0 && (
              <span className='rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-500'>
                +{extra}
              </span>
            )}
          </>
        )}
      </div>
    </a>
  )
}

function ProjectsSection({
  repos,
  hasGithubSync,
  chipCls,
}: {
  repos: PortfolioRepository[]
  hasGithubSync: boolean
  chipCls: string
}) {
  return (
    <section className='mt-10'>
      <div className='flex items-baseline justify-between gap-3'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Projects
          {repos.length > 0 && <span className='ml-2 text-sm font-normal text-gray-400'>{repos.length}</span>}
        </h3>
        {hasGithubSync && (
          <span className='inline-flex items-center gap-1.5 text-xs text-gray-500 print:hidden'>
            <FaGithub className='h-3.5 w-3.5' /> Đã đồng bộ từ GitHub
          </span>
        )}
      </div>

      {repos.length > 0 ? (
        <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} chipCls={chipCls} />
          ))}
        </div>
      ) : (
        <p className='mt-3 rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500'>
          Chưa có dự án nào.
        </p>
      )}
    </section>
  )
}

export default function PortfolioPublicPage() {
  // Route cần có param :slug, ví dụ <Route path='/p/:slug' element={<PublicPortfolioPage />} />
  const { username } = useParams<{ username: string }>()
  const { data: res, isLoading, isError } = usePublicPortfolioQuery(username, true)
  const portfolio = res?.data?.data?.data

  if (isLoading) {
    return (
      <div className='max-w-4xl mx-auto w-full px-6 py-10'>
        <Skeleton height={520} borderRadius={24} />
      </div>
    )
  }

  if (isError || !portfolio || !portfolio.isPublic) {
    return (
      <div className='max-w-4xl mx-auto w-full px-6 py-24 text-center'>
        <h1 className='text-2xl font-semibold text-gray-900'>Không tìm thấy portfolio</h1>
        <p className='mt-2 text-gray-500'>Portfolio này không tồn tại hoặc chưa được công khai.</p>
      </div>
    )
  }

  // TODO: đổi theo field tên thật mà API public trả về (ví dụ portfolio.fullName hoặc portfolio.user.fullName)
  const fullName = (portfolio as { fullName?: string }).fullName || username || 'Portfolio'

  const skills = portfolio.skills ?? []
  const repositories = portfolio.repositories ?? []

  const socials = [
    { icon: FaGithub, href: portfolio.github, label: 'GitHub' },
    { icon: FaLinkedin, href: portfolio.linkedin, label: 'LinkedIn' },
    { icon: FaFacebook, href: portfolio.facebook, label: 'Facebook' },
    { icon: Mail, href: portfolio.email ? `mailto:${portfolio.email}` : '', label: 'Email' },
  ].filter((s) => s.href)

  return (
    <div className='h-full overflow-y-auto scrollbar-thin'>
      <div className='max-w-4xl mx-auto px-6 py-10 pb-16'>
        <div className='flex justify-end print:hidden'>
          <button
            type='button'
            onClick={() => window.print()}
            className='flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition'
          >
            <Download className='w-4 h-4' /> Export PDF
          </button>
        </div>

        <div className='mt-6 rounded-3xl border border-gray-200 bg-white overflow-hidden print:border-0'>
          <div className={`h-40 border-b border-gray-200 bg-gradient-to-br ${THEME.banner}`} />
          <div className='px-6 sm:px-8 pb-10'>
            <div className='-mt-14 w-28 h-28 rounded-full border-4 border-white bg-white overflow-hidden'>
              {portfolio.avatarUrl ? (
                <img src={portfolio.avatarUrl} alt={fullName} className='w-full h-full object-cover' />
              ) : (
                <Avatar className='w-full h-full' />
              )}
            </div>

            <h1 className='mt-4 text-3xl font-semibold text-gray-900'>{fullName}</h1>
            {portfolio.title && <p className='mt-1 text-lg text-gray-500'>{portfolio.title}</p>}
            {portfolio.bio && (
              <p className='mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600'>{portfolio.bio}</p>
            )}

            {socials.length > 0 && (
              <div className='mt-5 flex gap-2'>
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target='_blank'
                    rel='noreferrer'
                    className='w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition'
                  >
                    <Icon className='w-4 h-4' />
                  </a>
                ))}
              </div>
            )}

            {skills.length > 0 && (
              <section className='mt-10'>
                <h2 className='text-lg font-semibold text-gray-900'>Skills</h2>
                <div className='mt-3 flex flex-wrap gap-2'>
                  {skills.map((s) => (
                    <span key={s} className={`rounded-full border px-3 py-1 text-sm ${THEME.chip}`}>
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <ProjectsSection
              repos={repositories}
              hasGithubSync={portfolio.hasGithubSync ?? false}
              chipCls={THEME.chip}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
