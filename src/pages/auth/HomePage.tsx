import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Sparkles, ArrowRight, Play, Brain, GitBranch, Map, Target, Zap, Check, ChevronDown } from 'lucide-react'
import PublicHeader from '../../components/layouts/PublicHeader'
import StatCard from '../../components/ui/StatCard'
import PublicFooter from '../../components/layouts/PublicFooter'
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem } from '../../components/motion/MotionWrapper'

// ---------- data ----------

const TRUSTED_LOGOS = ['Google', 'Stripe', 'Vercel', 'Linear', 'Notion', 'Figma', 'OpenAI', 'GitHub']

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Career Mentor',
    description:
      'Chat with an AI that knows your transcript, GitHub and goals. Like having a senior engineer on speed dial.',
  },
  {
    icon: GitBranch,
    title: 'Dynamic Skill Tree',
    description: 'Beautiful interactive visualization of every skill you have, are learning, and should learn next.',
  },
  {
    icon: Map,
    title: 'Personalized Roadmap',
    description: 'Auto-generated week-by-week plan that adapts as you complete tasks and unlock new skills.',
  },
  {
    icon: Target,
    title: 'Job Matching',
    description: 'Real-time matching against thousands of internships and roles, with the exact gaps to close.',
  },
  {
    icon: Zap,
    title: 'Portfolio Builder',
    description: 'Turn your projects into a stunning portfolio site that recruiters actually remember.',
  },
  {
    icon: Sparkles,
    title: 'Smart Resources',
    description:
      'Curated courses, articles and docs hand-picked for your exact next step. No more YouTube rabbit holes.',
  },
]

const TESTIMONIALS = [
  {
    quote: 'EduMap AI turned my chaotic learning into a clear weekly plan. Landed my Stripe internship in 4 months.',
    name: 'Sarah Kim',
    role: 'CS @ Stanford',
    avatarColor: 'bg-sky-100 text-sky-700',
  },
  {
    quote: 'The skill tree visualization is genius. I finally saw the gaps holding me back from FAANG offers.',
    name: 'David Chen',
    role: 'SE Intern @ Google',
    avatarColor: 'bg-amber-100 text-amber-700',
  },
  {
    quote:
      "The AI mentor reads my GitHub and tells me exactly what to build next. It's like a senior engineer in my pocket.",
    name: 'Priya Patel',
    role: 'ML @ CMU',
    avatarColor: 'bg-rose-100 text-rose-700',
  },
]

const PLANS = [
  {
    name: 'Free',
    tagline: 'Get started for free',
    price: '$0',
    period: '/month',
    cta: 'Start free',
    features: ['Skill tree (basic)', '5 AI chats/day', 'Public courses', 'Community support'],
  },
  {
    name: 'Pro Student',
    tagline: 'Most popular',
    price: '$2',
    period: '/month',
    cta: 'Go Pro',
    badge: 'Most popular',
    highlighted: true,
    features: ['Unlimited AI mentor', 'Full skill tree', 'Job matching', 'Resume review', 'Priority support'],
  },
  {
    name: 'Premium',
    tagline: 'Best value · billed annually',
    price: '$20',
    period: '/year',
    originalPrice: '$24',
    cta: 'Get Premium',
    badge: 'Save $4 · 17% OFF',
    features: ['Everything in Pro Student', 'Priority AI Analysis — faster processing & higher priority'],
  },
]

const FAQS = [
  {
    question: 'How does EduMap AI analyze my profile?',
    answer:
      "You connect your transcript, GitHub and CV. Our AI reads them, maps every skill you already have, and compares it against the role you're targeting to find the gaps.",
  },
  {
    question: 'Is my data private?',
    answer:
      'Yes. Your transcript, code and personal data are encrypted and never sold or shared with third parties. You can delete your data at any time from settings.',
  },
  {
    question: 'Do schools get access?',
    answer:
      'Only if you explicitly opt in to a school partnership program. By default your account and roadmap are visible to you alone.',
  },
  {
    question: 'Can I use the free plan forever?',
    answer:
      'Yes — the Free plan has no time limit. You can upgrade to Pro Student or Premium any time you want more AI chats, job matching or priority support.',
  },
]

// ---------- dashboard preview grid (deterministic pseudo-random fill) ----------

const GRID_ROWS = 4
const GRID_COLS = 14

function cellShade(row: number, col: number): string {
  const seed = (row * 7 + col * 13) % 5
  if (seed === 0) return 'bg-gray-100'
  if (seed === 1) return 'bg-indigo-100'
  if (seed === 2) return 'bg-indigo-300'
  if (seed === 3) return 'bg-indigo-200'
  return 'bg-indigo-500'
}

const BOTTOM_STATS = [
  { value: '120K+', label: 'Students mentored' },
  { value: '412', label: 'Universities' },
  { value: '94%', label: 'Internship rate' },
  { value: '4.9★', label: 'Avg rating' },
]

// ---------- page ----------

export default function HomePage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  return (
    <div className='min-h-screen flex flex-col bg-[#FAFAF9]'>
      <PublicHeader onSignIn={() => navigate('/login')} onGetStarted={() => navigate('/register')} />

      <main className='flex-1'>
        {/* Hero — phần đầu tiên user thấy ngay khi vào trang, animation chuyển
            trang (AnimatedOutlet) đã lo phần "xuất hiện" cho tiêu đề/nút bấm rồi.
            Nhưng "Dashboard preview visual" nằm khá thấp, user phải cuộn xuống
            mới thấy trọn vẹn -> tách riêng để nó tự fade khi cuộn tới */}
        <section className='bg-[#FAFAF9]'>
          <div className='max-w-5xl mx-auto px-6 pt-24 pb-6 text-center'>
            <div className='inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm px-3.5 py-1.5'>
              <Sparkles className='w-3.5 h-3.5' />
              New · GPT-5 powered roadmaps
            </div>

            <h1 className='mt-6 text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1]'>
              Your AI career mentor,
              <br />
              for every CS student.
            </h1>

            <p className='mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed'>
              Upload your transcript, GitHub and CV. EduMap AI maps your skills, spots the gaps, and builds the roadmap
              to your dream role.
            </p>

            <div className='mt-8 flex items-center justify-center gap-4'>
              <button
                type='button'
                onClick={() => navigate('/register')}
                className='flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 text-[15px] transition'
              >
                Get started
                <ArrowRight className='w-4 h-4' />
              </button>
              <button
                type='button'
                className='flex items-center gap-2 text-gray-900 font-medium px-2 py-3 text-[15px] hover:text-gray-600 transition'
              >
                <Play className='w-4 h-4' />
                Watch demo
              </button>
            </div>

            <p className='mt-4 text-sm text-gray-400'>Free for students · No credit card required</p>

            {/* Dashboard preview visual: tự fade lên đúng lúc cuộn tới nó,
                vì thường nằm ngay dưới màn hình đầu tiên (below the fold trên mobile/laptop nhỏ) */}
            <MotionFadeIn className='mt-16 rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden'>
              <div className='p-8'>
                {/* 3 StatCard đầu: hiện lần lượt so le, không cùng lúc */}
                <MotionStaggerContainer className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                  <MotionStaggerItem>
                    <StatCard value='47/120' label='Skill Map' />
                  </MotionStaggerItem>
                  <MotionStaggerItem>
                    <StatCard value='87' label='Career Score' />
                  </MotionStaggerItem>
                  <MotionStaggerItem>
                    <StatCard value='94%' label='Job Match' />
                  </MotionStaggerItem>
                </MotionStaggerContainer>

                <div
                  className='mt-6 grid gap-2'
                  style={{
                    gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from({ length: GRID_ROWS }).map((_, row) =>
                    Array.from({ length: GRID_COLS }).map((_, col) => (
                      <div key={`${row}-${col}`} className={`h-8 rounded-md ${cellShade(row, col)}`} />
                    )),
                  )}
                </div>
              </div>

              {/* 4 BOTTOM_STATS: hiện lần lượt so le khi cuộn tới */}
              <MotionStaggerContainer className='grid grid-cols-2 sm:grid-cols-4 border-t border-gray-200'>
                {BOTTOM_STATS.map((stat, i) => (
                  <MotionStaggerItem
                    key={stat.label}
                    className={`px-6 py-6 text-center ${i > 0 ? 'border-l border-gray-200' : ''}`}
                  >
                    <div className='text-2xl font-bold text-gray-900'>{stat.value}</div>
                    <div className='text-sm text-gray-500 mt-1'>{stat.label}</div>
                  </MotionStaggerItem>
                ))}
              </MotionStaggerContainer>
            </MotionFadeIn>
          </div>
        </section>

        {/* Logo strip */}
        <MotionFadeIn>
          <section className='py-14'>
            <div className='max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4'>
              {TRUSTED_LOGOS.map((name) => (
                <span key={name} className='text-lg text-gray-400 font-medium select-none'>
                  {name}
                </span>
              ))}
            </div>
          </section>
        </MotionFadeIn>

        {/* Features */}
        <section id='features' className='py-20'>
          <div className='max-w-5xl mx-auto px-6'>
            <MotionFadeIn>
              <p className='text-sm text-gray-500'>Features</p>
              <h2 className='mt-2 text-4xl font-bold text-gray-900 tracking-tight'>
                Everything you need to land the role.
              </h2>
              <p className='mt-3 text-gray-500 text-[15px]'>
                A complete AI career stack, designed for CS students who don't have time to waste.
              </p>
            </MotionFadeIn>

            {/* 6 feature card: hiện lần lượt so le, mỗi card cách nhau 0.08s */}
            <MotionStaggerContainer className='mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 rounded-2xl border border-gray-200 bg-white overflow-hidden'>
              {FEATURES.map((feature, i) => {
                const Icon = feature.icon
                const isLastCol = (i + 1) % 3 === 0
                const isLastRow = i >= FEATURES.length - 3
                return (
                  <MotionStaggerItem
                    key={feature.title}
                    className={`p-8 ${
                      !isLastCol ? 'sm:border-r border-gray-200' : ''
                    } ${!isLastRow ? 'border-b border-gray-200' : ''}`}
                  >
                    <Icon className='w-5 h-5 text-gray-900' />
                    <h3 className='mt-4 font-semibold text-gray-900'>{feature.title}</h3>
                    <p className='mt-2 text-[15px] text-gray-500 leading-relaxed'>{feature.description}</p>
                  </MotionStaggerItem>
                )
              })}
            </MotionStaggerContainer>
          </div>
        </section>

        {/* Testimonials */}
        <section className='py-20'>
          <div className='max-w-5xl mx-auto px-6'>
            <MotionFadeIn>
              <p className='text-sm text-gray-500'>Customers</p>
              <h2 className='mt-2 text-4xl font-bold text-gray-900 tracking-tight'>From classroom to FAANG.</h2>
            </MotionFadeIn>

            {/* 3 testimonial card: hiện lần lượt so le */}
            <MotionStaggerContainer className='mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5'>
              {TESTIMONIALS.map((t) => (
                <MotionStaggerItem
                  key={t.name}
                  className='bg-white border border-gray-200 rounded-2xl p-6 flex flex-col'
                >
                  <p className='text-[15px] text-gray-700 leading-relaxed'>"{t.quote}"</p>
                  <div className='mt-5 pt-5 border-t border-gray-100 flex items-center gap-3'>
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${t.avatarColor}`}
                    >
                      {t.name
                        .split(' ')
                        .map((p) => p[0])
                        .join('')}
                    </div>
                    <div>
                      <div className='text-sm font-medium text-gray-900'>{t.name}</div>
                      <div className='text-sm text-gray-500'>{t.role}</div>
                    </div>
                  </div>
                </MotionStaggerItem>
              ))}
            </MotionStaggerContainer>
          </div>
        </section>

        {/* Pricing — mỗi card giờ tự fade riêng theo stagger, KHÔNG bọc chung
            1 khối to nữa. onClick vẫn hoạt động bình thường vì MotionStaggerItem
            đã được nâng cấp để nhận onClick giống 1 div thật */}
        <section id='pricing' className='py-20'>
          <div className='max-w-5xl mx-auto px-6'>
            <MotionFadeIn>
              <p className='text-sm text-gray-500'>Pricing</p>
              <h2 className='mt-2 text-4xl font-bold text-gray-900 tracking-tight'>Plans that grow with you.</h2>
            </MotionFadeIn>

            <MotionStaggerContainer className='mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5 items-stretch'>
              {PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.name
                return (
                  <MotionStaggerItem
                    key={plan.name}
                    onClick={() => setSelectedPlan(plan.name)}
                    className={`relative bg-white rounded-2xl p-7 border-2 cursor-pointer transition ${
                      isSelected ? 'border-indigo-600 shadow-sm' : 'border-gray-200'
                    }`}
                  >
                    {plan.badge && (
                      <span
                        className={`absolute -top-3 ${
                          plan.highlighted ? 'left-6 bg-indigo-600 text-white' : 'right-6 bg-gray-100 text-gray-700'
                        } text-xs font-medium px-3 py-1 rounded-full`}
                      >
                        {plan.badge}
                      </span>
                    )}

                    <h3 className='font-semibold text-gray-900'>{plan.name}</h3>
                    <p className='mt-1 text-sm text-gray-500'>{plan.tagline}</p>

                    <div className='mt-5 flex items-baseline gap-1.5'>
                      <span className='text-4xl font-bold text-gray-900'>{plan.price}</span>
                      <span className='text-gray-500 text-sm'>{plan.period}</span>
                      {plan.originalPrice && (
                        <span className='text-gray-400 text-sm line-through ml-1'>{plan.originalPrice}</span>
                      )}
                    </div>

                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('/register')
                      }}
                      className={`mt-6 w-full rounded-xl py-2.5 text-[15px] font-medium transition ${
                        plan.highlighted
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'border border-gray-200 text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {plan.cta}
                    </button>

                    <ul className='mt-6 space-y-3'>
                      {plan.features.map((feature) => (
                        <li key={feature} className='flex items-start gap-2 text-[15px] text-gray-600'>
                          <Check className='w-4 h-4 text-gray-900 mt-0.5 shrink-0' />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </MotionStaggerItem>
                )
              })}
            </MotionStaggerContainer>
          </div>
        </section>

        {/* FAQ + closing CTA — mỗi câu hỏi tự fade riêng khi cuộn tới,
            CTA cuối trang tách riêng để kích hoạt đúng lúc nó lọt vào khung nhìn */}
        <section id='faq' className='py-20'>
          <div className='max-w-3xl mx-auto px-6'>
            <MotionFadeIn>
              <p className='text-sm text-gray-500'>FAQ</p>
              <h2 className='mt-2 text-4xl font-bold text-gray-900 tracking-tight'>Questions, answered.</h2>
            </MotionFadeIn>

            <MotionStaggerContainer className='mt-8 border-t border-gray-200'>
              {FAQS.map((item, i) => {
                const isOpen = openFaq === i
                return (
                  <MotionStaggerItem key={item.question} className='border-b border-gray-200'>
                    <button
                      type='button'
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className='w-full flex items-center justify-between py-5 text-left'
                      aria-expanded={isOpen}
                    >
                      <span className='text-[15px] font-medium text-gray-900'>{item.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isOpen && <p className='pb-5 text-[15px] text-gray-500 leading-relaxed pr-8'>{item.answer}</p>}
                  </MotionStaggerItem>
                )
              })}
            </MotionStaggerContainer>

            <MotionFadeIn className='mt-16 bg-white border border-gray-200 rounded-3xl px-8 py-16 text-center'>
              <h3 className='text-3xl font-bold text-gray-900 tracking-tight'>Ready to map your career?</h3>
              <p className='mt-3 text-gray-500 text-[15px] max-w-md mx-auto'>
                Join 120,000+ students building the career they actually want — in half the time.
              </p>
              <button
                type='button'
                onClick={() => navigate('/register')}
                className='mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 text-[15px] transition'
              >
                Get started
                <ArrowRight className='w-4 h-4' />
              </button>
            </MotionFadeIn>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
