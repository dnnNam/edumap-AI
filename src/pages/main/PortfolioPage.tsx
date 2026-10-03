import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { Check, Download, ExternalLink, Link2, Loader2, Mail, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, type UseFormRegisterReturn } from 'react-hook-form'
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa'
import Skeleton from 'react-loading-skeleton'
import { toast } from 'sonner'
import Avatar from '../../components/ui/Avatar'
import { useMyPortfolioQuery, usePublicPortfolioQuery, useUpdatePortfolioMutation } from '../../hooks/portfolioQuery'
import { MAX_SKILL_LENGTH, MAX_SKILLS, portfolioSchema, type PortfolioFormValues } from '../../schemas/portfolio.schema'
import type { Portfolio, PortfolioRepository, UpdatePortfolioBody } from '../../types/api/portfolio.type'
import { getFullNameFromLS } from '../../utils/auth'

const EMPTY: Portfolio = {
  title: '',
  bio: '',
  avatarUrl: '',
  email: '',
  facebook: '',
  linkedin: '',
  github: '',
  skills: [],
  socialLinks: {},
  isPublic: false,
}

const TABS = ['Info', 'Theme', 'Share'] as const
type Tab = (typeof TABS)[number]

// Class Tailwind phải viết đầy đủ (không ghép chuỗi) để không bị purge
const THEMES = [
  { name: 'Indigo', banner: 'from-indigo-100 to-white', chip: 'border-indigo-100 bg-indigo-50 text-indigo-700' },
  { name: 'Emerald', banner: 'from-emerald-100 to-white', chip: 'border-emerald-100 bg-emerald-50 text-emerald-700' },
  { name: 'Rose', banner: 'from-rose-100 to-white', chip: 'border-rose-100 bg-rose-50 text-rose-700' },
  { name: 'Slate', banner: 'from-gray-200 to-white', chip: 'border-gray-200 bg-gray-100 text-gray-700' },
]

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

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition'

const inputErrCls =
  'w-full rounded-xl border border-red-400 bg-white px-4 py-2.5 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role='alert' className='mt-1 text-xs text-red-600'>
      {message}
    </p>
  )
}

function Field({
  label,
  registration,
  error,
  placeholder,
}: {
  label: string
  registration: UseFormRegisterReturn
  error?: string
  placeholder?: string
}) {
  return (
    <label className='block'>
      <span className='text-sm font-medium text-gray-900'>{label}</span>
      <input
        {...registration}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={`${error ? inputErrCls : inputCls} mt-1.5`}
      />
      <FieldError message={error} />
    </label>
  )
}

// Dữ liệu API -> giá trị mặc định của form
const toFormValues = (p: Portfolio): PortfolioFormValues => ({
  title: p.title ?? '',
  bio: p.bio ?? '',
  avatarUrl: p.avatarUrl ?? '',
  email: p.email ?? '',
  facebook: p.facebook ?? '',
  linkedin: p.linkedin ?? '',
  github: p.github ?? '',
  skills: p.skills ?? [],
  isPublic: p.isPublic ?? false,
})

// Giá trị form -> body gửi lên PATCH /portfolios/my-portfolio/update
const toRequestBody = (v: PortfolioFormValues): UpdatePortfolioBody => ({
  ...v,
  socialLinks: { github: v.github, linkedin: v.linkedin },
})

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
  loading,
  hasGithubSync,
  isPublic,
  chipCls,
}: {
  repos: PortfolioRepository[]
  loading: boolean
  hasGithubSync: boolean
  isPublic: boolean
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

      {loading ? (
        <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Skeleton height={140} borderRadius={16} />
          <Skeleton height={140} borderRadius={16} />
        </div>
      ) : repos.length > 0 ? (
        <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} chipCls={chipCls} />
          ))}
        </div>
      ) : (
        <p className='mt-3 rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500'>
          {!isPublic
            ? 'Bật “Công khai portfolio” ở tab Share để hiển thị dự án GitHub tại đây.'
            : 'Chưa có dự án nào. Đồng bộ GitHub để tự động thêm dự án của bạn.'}
        </p>
      )}
    </section>
  )
}

function Builder({
  initial,
  repositories,
  reposLoading,
  hasGithubSync,
}: {
  initial: Portfolio
  repositories: PortfolioRepository[]
  reposLoading: boolean
  hasGithubSync: boolean
}) {
  const fullName = getFullNameFromLS() || 'Your name'
  const [tab, setTab] = useState<Tab>('Info')
  const [theme, setTheme] = useState(0)
  const [skillInput, setSkillInput] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors, isDirty },
  } = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: toFormValues(initial),
    mode: 'onTouched',
  })

  // Đăng ký field skills (mảng, không có input thật) để RHF theo dõi dirty/validate đúng
  useEffect(() => {
    register('skills')
  }, [register])

  const { mutate: updatePortfolio, isPending } = useUpdatePortfolioMutation()

  // Live preview đọc trực tiếp từ giá trị form
  const form = watch()

  // Đang gõ dở một skill chưa thêm
  const pendingSkill = skillInput.trim() !== ''

  // Trả về true nếu không có gì cần thêm hoặc thêm thành công
  const commitSkill = (): boolean => {
    const s = skillInput.trim()
    if (!s) return true
    const current = getValues('skills') ?? []

    if (s.length > MAX_SKILL_LENGTH) {
      toast.error(`Mỗi kỹ năng tối đa ${MAX_SKILL_LENGTH} ký tự`)
      return false
    }
    if (current.some((x) => x.toLowerCase() === s.toLowerCase())) {
      toast.error(`Kỹ năng "${s}" đã có`)
      return false
    }
    if (current.length >= MAX_SKILLS) {
      toast.error(`Tối đa ${MAX_SKILLS} kỹ năng`)
      return false
    }

    setValue('skills', [...current, s], { shouldDirty: true, shouldValidate: true })
    setSkillInput('')
    return true
  }

  const removeSkill = (s: string) =>
    setValue(
      'skills',
      (getValues('skills') ?? []).filter((x) => x !== s),
      { shouldDirty: true, shouldValidate: true },
    )

  const onSubmit = (values: PortfolioFormValues) => {
    updatePortfolio(toRequestBody(values), {
      onSuccess: () => {
        toast.success('Đã lưu portfolio')
        reset(values) // đặt lại trạng thái "chưa chỉnh sửa"
      },
      onError: (err) => {
        // http.ts không toast lỗi 422 nên xử lý ở đây
        if (isAxiosError<{ message?: string | string[] }>(err) && err.response?.status === 422) {
          const msg = err.response.data?.message
          toast.error((Array.isArray(msg) ? msg.join(', ') : msg) || 'Dữ liệu không hợp lệ')
        }
      },
    })
  }

  const onInvalid = () => {
    toast.error('Vui lòng kiểm tra lại các trường bị lỗi')
    setTab('Info')
  }

  // Tự thêm skill đang gõ dở trước khi validate + lưu
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!commitSkill()) return
    void handleSubmit(onSubmit, onInvalid)(e)
  }

  // Backend trả sẵn portfolioUrl; chuẩn hoá lỗi "//" thừa trong path
  const shareUrl = (initial.portfolioUrl ?? '').replace(/([^:])\/{2,}/g, '$1/')
  const copyUrl = async () => {
    await navigator.clipboard.writeText(shareUrl)
    toast.success('Đã sao chép link')
  }

  const socials = [
    { icon: FaGithub, href: form.github, label: 'GitHub' },
    { icon: FaLinkedin, href: form.linkedin, label: 'LinkedIn' },
    { icon: FaFacebook, href: form.facebook, label: 'Facebook' },
    { icon: Mail, href: form.email ? `mailto:${form.email}` : '', label: 'Email' },
  ].filter((s) => s.href)

  const currentTheme = THEMES[theme]
  const skillsError =
    errors.skills?.message ??
    errors.skills?.root?.message ??
    (Array.isArray(errors.skills) ? errors.skills.find(Boolean)?.message : undefined)

  return (
    <div className='h-full overflow-y-auto scrollbar-thin'>
      <div className='max-w-6xl mx-auto px-6 py-10 pb-16'>
        {/* Header */}
        <div className='flex flex-wrap items-start justify-between gap-4 print:hidden'>
          <div>
            <h1 className='text-3xl font-semibold text-gray-900'>Portfolio Builder</h1>
            <p className='mt-2 text-gray-500'>Chỉnh sửa, chọn giao diện và chia sẻ portfolio của bạn.</p>
          </div>
          <div className='flex items-center gap-3'>
            <button
              type='button'
              onClick={() => window.print()}
              className='flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition'
            >
              <Download className='w-4 h-4' /> Export PDF
            </button>
          </div>
        </div>

        <div className='mt-8 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start'>
          {/* Editor */}
          <form
            onSubmit={onFormSubmit}
            noValidate
            className='rounded-3xl border border-gray-200 bg-white p-6 print:hidden'
          >
            <div className='grid grid-cols-3 rounded-xl bg-gray-100 p-1'>
              {TABS.map((t) => (
                <button
                  key={t}
                  type='button'
                  onClick={() => setTab(t)}
                  className={`rounded-lg py-2 text-sm transition ${
                    tab === t ? 'bg-white text-gray-900 font-medium shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className='mt-5 space-y-4'>
              {tab === 'Info' && (
                <>
                  <Field
                    label='Headline'
                    registration={register('title')}
                    error={errors.title?.message}
                    placeholder='Junior Full-stack Developer'
                  />
                  <label className='block'>
                    <span className='text-sm font-medium text-gray-900'>Bio</span>
                    <textarea
                      {...register('bio')}
                      rows={3}
                      aria-invalid={!!errors.bio}
                      className={`${errors.bio ? inputErrCls : inputCls} mt-1.5 resize-none`}
                    />
                    <FieldError message={errors.bio?.message} />
                  </label>
                  <Field
                    label='Avatar URL'
                    registration={register('avatarUrl')}
                    error={errors.avatarUrl?.message}
                    placeholder='https://...'
                  />
                  <Field label='Email' registration={register('email')} error={errors.email?.message} />
                  <Field
                    label='GitHub'
                    registration={register('github')}
                    error={errors.github?.message}
                    placeholder='https://github.com/username'
                  />
                  <Field
                    label='LinkedIn'
                    registration={register('linkedin')}
                    error={errors.linkedin?.message}
                    placeholder='https://linkedin.com/in/username'
                  />
                  <Field
                    label='Facebook'
                    registration={register('facebook')}
                    error={errors.facebook?.message}
                    placeholder='https://facebook.com/username'
                  />

                  <div>
                    <span className='text-sm font-medium text-gray-900'>Skills</span>
                    <div className='mt-1.5 flex gap-2'>
                      <input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                            e.preventDefault() // không submit form khi nhấn Enter
                            commitSkill()
                          }
                        }}
                        placeholder={`Nhập kỹ năng rồi nhấn Enter (tối đa ${MAX_SKILLS})`}
                        className={skillsError ? inputErrCls : inputCls}
                      />
                      <button
                        type='button'
                        onClick={commitSkill}
                        disabled={!pendingSkill}
                        className='shrink-0 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition'
                      >
                        Thêm
                      </button>
                    </div>
                    <FieldError message={skillsError} />
                    <div className='mt-3 flex flex-wrap gap-2'>
                      {form.skills.map((s) => (
                        <span
                          key={s}
                          className='inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 pl-3 pr-1.5 py-1 text-sm text-gray-700'
                        >
                          {s}
                          <button
                            type='button'
                            aria-label={`Xóa ${s}`}
                            onClick={() => removeSkill(s)}
                            className='rounded-full p-0.5 text-gray-400 hover:text-gray-900'
                          >
                            <X className='w-3.5 h-3.5' />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {tab === 'Theme' && (
                <div className='grid grid-cols-2 gap-3'>
                  {THEMES.map((t, i) => (
                    <button
                      key={t.name}
                      type='button'
                      onClick={() => setTheme(i)}
                      className={`rounded-xl border p-3 text-left text-sm transition ${
                        theme === i ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`h-10 rounded-lg bg-gradient-to-br ${t.banner} border border-gray-100`} />
                      <span className='mt-2 block text-gray-900'>{t.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {tab === 'Share' && (
                <>
                  <label className='flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 cursor-pointer'>
                    <span>
                      <span className='block text-sm font-medium text-gray-900'>Công khai portfolio</span>
                      <span className='block text-xs text-gray-500 mt-0.5'>
                        Bất kỳ ai có link đều xem được. Nhấn “Lưu thay đổi” để áp dụng.
                      </span>
                    </span>
                    <input type='checkbox' {...register('isPublic')} className='w-5 h-5 accent-indigo-600' />
                  </label>
                  <div className='flex gap-2'>
                    <input readOnly value={shareUrl} className={`${inputCls} text-gray-500`} />
                    <button
                      type='button'
                      onClick={copyUrl}
                      disabled={!initial.isPublic || !shareUrl}
                      aria-label='Sao chép link'
                      className='shrink-0 rounded-xl border border-gray-200 px-3 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition'
                    >
                      <Link2 className='w-4 h-4' />
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              type='submit'
              disabled={(!isDirty && !pendingSkill) || isPending}
              className='mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50'
            >
              {isPending && <Loader2 className='h-4 w-4 animate-spin' />}
              {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>

          {/* Live preview */}
          <div className='rounded-3xl border border-gray-200 bg-white overflow-hidden print:border-0'>
            <div className={`h-40 border-b border-gray-200 bg-gradient-to-br ${currentTheme.banner}`} />
            <div className='px-6 sm:px-8 pb-10'>
              <div className='-mt-14 w-28 h-28 rounded-full border-4 border-white bg-white overflow-hidden'>
                {form.avatarUrl ? (
                  <img src={form.avatarUrl} alt={fullName} className='w-full h-full object-cover' />
                ) : (
                  <Avatar className='w-full h-full' />
                )}
              </div>

              <h2 className='mt-4 text-3xl font-semibold text-gray-900'>{fullName}</h2>
              {form.title && <p className='mt-1 text-lg text-gray-500'>{form.title}</p>}
              {form.bio && <p className='mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600'>{form.bio}</p>}

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

              <p className='mt-5 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 print:hidden'>
                <Check className='w-3.5 h-3.5' /> Live preview
              </p>

              {/* Skills */}
              <section className='mt-10'>
                <h3 className='text-lg font-semibold text-gray-900'>Skills</h3>
                {form.skills.length === 0 ? (
                  <p className='mt-3 text-sm text-gray-500'>Thêm kỹ năng ở tab Info để hiển thị tại đây.</p>
                ) : (
                  <div className='mt-3 flex flex-wrap gap-2'>
                    {form.skills.map((s) => (
                      <span key={s} className={`rounded-full border px-3 py-1 text-sm ${currentTheme.chip}`}>
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              {/* Projects (từ API public) */}
              <ProjectsSection
                repos={repositories}
                loading={reposLoading}
                hasGithubSync={hasGithubSync}
                isPublic={initial.isPublic}
                chipCls={currentTheme.chip}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PortfolioPage() {
  // API 1: lấy portfolio của mình -> có portfolioSlug
  const { data, isLoading } = useMyPortfolioQuery()

  // axios: data.data = body ngoài; .data = PortfolioBody; .data = Portfolio
  const portfolio = data?.data?.data?.data
  const slug = portfolio?.portfolioSlug

  // API 2: truyền slug lấy bản public (kèm repositories). Portfolio private -> API public sẽ lỗi nên bỏ qua
  const { data: publicRes, isLoading: publicLoading } = usePublicPortfolioQuery(slug, portfolio?.isPublic)
  const publicData = portfolio?.isPublic ? publicRes?.data?.data?.data : undefined

  if (isLoading) {
    return (
      <div className='max-w-6xl mx-auto w-full px-6 py-10'>
        <Skeleton width={260} height={36} />
        <div className='mt-8 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6'>
          <Skeleton height={520} borderRadius={24} />
          <Skeleton height={520} borderRadius={24} />
        </div>
      </div>
    )
  }

  // Chưa có portfolio (404) -> data undefined -> dùng form trống
  const initial: Portfolio = { ...EMPTY, ...portfolio, socialLinks: portfolio?.socialLinks ?? {} }

  return (
    <Builder
      // key đổi khi portfolio vừa được tạo lần đầu để form nạp lại dữ liệu server
      key={portfolio?.id ?? 'new'}
      initial={initial}
      repositories={publicData?.repositories ?? []}
      reposLoading={!!slug && !!portfolio?.isPublic && publicLoading}
      hasGithubSync={publicData?.hasGithubSync ?? false}
    />
  )
}
