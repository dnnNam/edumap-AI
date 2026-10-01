import { Check, Download, Link2, Mail, Share2, X } from 'lucide-react'
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa'
import { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { toast } from 'sonner'
import Avatar from '../../components/ui/Avatar'
import { useMyPortfolioQuery } from '../../hooks/portfolioQuery'

import { getFullNameFromLS } from '../../utils/auth'
import type { Portfolio } from '../../types/api/portfolio.type'

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

const THEMES = [
  { name: 'Indigo', banner: 'from-indigo-100 to-white' },
  { name: 'Emerald', banner: 'from-emerald-100 to-white' },
  { name: 'Rose', banner: 'from-rose-100 to-white' },
  { name: 'Slate', banner: 'from-gray-200 to-white' },
]

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition'

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className='block'>
      <span className='text-sm font-medium text-gray-900'>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputCls} mt-1.5`}
      />
    </label>
  )
}

function Builder({ initial }: { initial: Portfolio }) {
  const fullName = getFullNameFromLS() || 'Your name'
  const [form, setForm] = useState<Portfolio>(initial)
  const [tab, setTab] = useState<Tab>('Info')
  const [theme, setTheme] = useState(0)
  const [skillInput, setSkillInput] = useState('')

  const set = <K extends keyof Portfolio>(key: K, value: Portfolio[K]) => setForm((f) => ({ ...f, [key]: value }))

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !form.skills.some((x) => x.toLowerCase() === s.toLowerCase())) set('skills', [...form.skills, s])
    setSkillInput('')
  }

  // Backend trả sẵn portfolioUrl; chuẩn hoá lỗi "//" thừa trong path
  const shareUrl = (form.portfolioUrl ?? '').replace(/([^:])\/{2,}/g, '$1/')
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
              onClick={() => setTab('Share')}
              className='flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition'
            >
              <Share2 className='w-4 h-4' /> Share URL
            </button>
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
          <div className='rounded-3xl border border-gray-200 bg-white p-6 print:hidden'>
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
                    value={form.title}
                    onChange={(v) => set('title', v)}
                    placeholder='Junior Full-stack Developer'
                  />
                  <label className='block'>
                    <span className='text-sm font-medium text-gray-900'>Bio</span>
                    <textarea
                      value={form.bio}
                      onChange={(e) => set('bio', e.target.value)}
                      rows={3}
                      className={`${inputCls} mt-1.5 resize-none`}
                    />
                  </label>
                  <Field
                    label='Avatar URL'
                    value={form.avatarUrl}
                    onChange={(v) => set('avatarUrl', v)}
                    placeholder='https://...'
                  />
                  <Field label='Email' value={form.email} onChange={(v) => set('email', v)} />
                  <Field
                    label='GitHub'
                    value={form.github}
                    onChange={(v) => set('github', v)}
                    placeholder='https://github.com/username'
                  />
                  <Field
                    label='LinkedIn'
                    value={form.linkedin}
                    onChange={(v) => set('linkedin', v)}
                    placeholder='https://linkedin.com/in/username'
                  />
                  <Field
                    label='Facebook'
                    value={form.facebook}
                    onChange={(v) => set('facebook', v)}
                    placeholder='https://facebook.com/username'
                  />

                  <div>
                    <span className='text-sm font-medium text-gray-900'>Skills</span>
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addSkill()
                        }
                      }}
                      placeholder='Nhập kỹ năng rồi nhấn Enter'
                      className={`${inputCls} mt-1.5`}
                    />
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
                            onClick={() =>
                              set(
                                'skills',
                                form.skills.filter((x) => x !== s),
                              )
                            }
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
                      <span className='block text-xs text-gray-500 mt-0.5'>Bất kỳ ai có link đều xem được.</span>
                    </span>
                    <input
                      type='checkbox'
                      checked={form.isPublic}
                      onChange={(e) => set('isPublic', e.target.checked)}
                      className='w-5 h-5 accent-indigo-600'
                    />
                  </label>
                  <div className='flex gap-2'>
                    <input readOnly value={shareUrl} className={`${inputCls} text-gray-500`} />
                    <button
                      type='button'
                      onClick={copyUrl}
                      disabled={!form.isPublic || !shareUrl}
                      aria-label='Sao chép link'
                      className='shrink-0 rounded-xl border border-gray-200 px-3 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition'
                    >
                      <Link2 className='w-4 h-4' />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Live preview */}
          <div className='rounded-3xl border border-gray-200 bg-white overflow-hidden print:border-0'>
            <div className={`h-40 border-b border-gray-200 bg-gradient-to-br ${THEMES[theme].banner}`} />
            <div className='px-8 pb-10'>
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

              <h3 className='mt-10 text-lg font-semibold text-gray-900'>Skills</h3>
              {form.skills.length === 0 ? (
                <p className='mt-3 text-sm text-gray-500'>Thêm kỹ năng ở tab Info để hiển thị tại đây.</p>
              ) : (
                <div className='mt-3 flex flex-wrap gap-2'>
                  {form.skills.map((s) => (
                    <span key={s} className='rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700'>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PortfolioPage() {
  const { data, isLoading } = useMyPortfolioQuery()

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
  // axios: data.data = body ngoài; .data = PortfolioBody; .data = Portfolio
  const portfolio = data?.data?.data?.data
  const initial: Portfolio = { ...EMPTY, ...portfolio, socialLinks: portfolio?.socialLinks ?? {} }
  return <Builder initial={initial} />
}
