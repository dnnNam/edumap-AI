import { useState, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router'
import {
  ArrowRight,
  Play,
  Brain,
  GitBranch,
  Map,
  Target,
  Zap,
  Sparkles,
  Check,
  ChevronDown,
  Layers,
  LayoutGrid,
} from 'lucide-react'
import PublicHeader from '../../components/layouts/PublicHeader'
import PublicFooter from '../../components/layouts/PublicFooter'
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem } from '../../components/motion/MotionWrapper'
import Card3D from '../../components/motion/Card3D'
import Coverflow3D from '../../components/motion/Coverflow3D'
import Floating3D from '../../components/motion/Floating3D'
import ScrollPerspective3D from '../../components/motion/ScrollPerspective3D'
import LayeredStatDeck from '../../components/motion/LayeredStatDeck'
import GradientBorderCard from '../../components/motion/GradientBorderCard'

// 1 Vật thể 3D duy nhất trên toàn trang (lazy-load)
const HeroSingle3D = lazy(() => import('../../components/canvas3d/HeroSingle3D'))

// ---------- data (GIỮ NGUYÊN 100%) ----------

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
  const [featureViewMode, setFeatureViewMode] = useState<'coverflow' | 'grid'>('coverflow')

  return (
    <div className='min-h-screen flex flex-col bg-[#FAFAF9] overflow-x-hidden selection:bg-indigo-600 selection:text-white'>
      <PublicHeader onSignIn={() => navigate('/login')} onGetStarted={() => navigate('/register')} />

      <main className='flex-1 relative'>
        {/* Lớp nền Parallax nhẹ nhàng (chỉ dùng màu indigo-100/50 sẵn có) */}
        <div aria-hidden='true' className='pointer-events-none absolute inset-0 overflow-hidden'>
          <div className='absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-indigo-100/50 to-transparent rounded-full blur-3xl opacity-50' />
          <div className='absolute top-96 -left-32 w-80 h-80 bg-indigo-50 rounded-full blur-2xl opacity-60' />
        </div>

        {/* ================= HERO SECTION ================= */}
        <section className='relative bg-[#FAFAF9] z-10'>
          <div className='max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-8 sm:pb-12 text-center relative'>
            {/* Logo Badge với 3D Levitation + 1 Vật thể 3D nằm tách hẳn ra ngoài đuôi tag, không bị che */}
            <div className='relative inline-block mb-6 sm:mb-8'>
              {/* Vật thể 3D tách hẳn ra ngoài đuôi tag (không bị tag che) và phía trên chữ mentor */}
              <div
                aria-hidden='true'
                className='absolute -top-7 sm:-top-10 md:-top-12 left-[90%] sm:left-[98%] md:left-[102%] w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 pointer-events-none select-none z-10 opacity-90'
              >
                <Suspense fallback={null}>
                  <HeroSingle3D className='w-full h-full' />
                </Suspense>
              </div>

              <Floating3D duration={4.5} distance={6}>
                <div className='relative z-10 inline-flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-gray-300 transition-all select-none'>
                  <div className='w-8 h-8 rounded-xl bg-[#131428] flex items-center justify-center shrink-0 p-1 shadow-xs'>
                    <img src='/favicon.svg' alt='EduMap AI' className='w-full h-full object-contain' />
                  </div>
                  <div className='text-left'>
                    <div className='text-xs font-black tracking-tight text-gray-900 leading-none'>
                      EDUMAP<span className='text-indigo-600'>AI</span>
                    </div>
                    <div className='text-[8px] font-bold tracking-wider text-gray-400 uppercase mt-0.5'>
                      A Roadmap for Education
                    </div>
                  </div>
                  <span className='w-1 h-1 rounded-full bg-gray-300' />
                  <span className='text-xs font-semibold text-indigo-600 hidden sm:inline'>GPT-5 Powered</span>
                </div>
              </Floating3D>
            </div>

            {/* Tiêu đề chính Hero */}
            <ScrollPerspective3D rotateXAmount={4}>
              <h1 className='text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight leading-[1.12] sm:leading-[1.1] max-w-4xl mx-auto'>
                Your AI career mentor,
                <br />
                for every CS student.
              </h1>

              <p className='mt-5 sm:mt-6 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed'>
                Upload your transcript, GitHub and CV. EduMap AI maps your skills, spots the gaps, and builds the
                roadmap to your dream role.
              </p>
            </ScrollPerspective3D>

            {/* Nút bấm CTA với hiệu ứng Micro-interaction 3D */}
            <div className='mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto sm:max-w-none relative z-10'>
              <button
                type='button'
                onClick={() => navigate('/register')}
                className='w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-medium px-6 py-3 text-[15px] transition-all shadow-md hover:shadow-indigo-600/25 cursor-pointer'
              >
                <span>Get started</span>
                <ArrowRight className='w-4 h-4' />
              </button>
              <button
                type='button'
                onClick={() => {
                  const el = document.getElementById('preview-card')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
                className='w-full sm:w-auto flex items-center justify-center gap-2 text-gray-900 font-medium px-4 py-3 text-[15px] hover:text-gray-600 active:scale-[0.98] transition cursor-pointer'
              >
                <Play className='w-4 h-4 text-indigo-600' />
                <span>Watch demo</span>
              </button>
            </div>

            <p className='mt-4 text-xs sm:text-sm text-gray-400 relative z-10'>
              Free for students · No credit card required
            </p>

            {/* ================= DASHBOARD PREVIEW 3D TILT CARD ================= */}
            {/* Hạng mục 2: Tilt Card + Hạng mục 3: Layered Depth Panel */}
            <div id='preview-card' className='mt-12 sm:mt-16 relative z-10'>
              <Card3D
                maxTilt={6}
                scale={1.015}
                glare={true}
                className='rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden text-left'
              >
                <div className='p-5 sm:p-8'>
                  {/* Hạng mục 3: Layered Depth Panel (tách nhẹ trục Z khi hover trên desktop) */}
                  <LayeredStatDeck />

                  {/* Lưới ô vuông trực quan với thanh cuộn an toàn cho mobile */}
                  <div className='mt-6 overflow-x-auto [scrollbar-width:none] pb-1'>
                    <div
                      className='grid gap-2 min-w-[580px] sm:min-w-0'
                      style={{
                        gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
                      }}
                    >
                      {Array.from({ length: GRID_ROWS }).map((_, row) =>
                        Array.from({ length: GRID_COLS }).map((_, col) => (
                          <div
                            key={`${row}-${col}`}
                            className={`h-8 rounded-md transition-transform duration-200 hover:scale-105 ${cellShade(row, col)}`}
                          />
                        )),
                      )}
                    </div>
                  </div>
                </div>

                {/* 4 BOTTOM_STATS: hiển thị gọn gàng */}
                <MotionStaggerContainer className='grid grid-cols-2 sm:grid-cols-4 border-t border-gray-200 bg-white'>
                  {BOTTOM_STATS.map((stat, i) => (
                    <MotionStaggerItem
                      key={stat.label}
                      className={`px-4 sm:px-6 py-5 sm:py-6 text-center ${i > 0 ? 'border-l border-gray-200' : ''}`}
                    >
                      <div className='text-2xl sm:text-3xl font-bold text-gray-900'>{stat.value}</div>
                      <div className='text-xs sm:text-sm text-gray-500 mt-1'>{stat.label}</div>
                    </MotionStaggerItem>
                  ))}
                </MotionStaggerContainer>
              </Card3D>
            </div>
          </div>
        </section>

        {/* ================= LOGO STRIP ================= */}
        <MotionFadeIn>
          <section className='py-12 sm:py-14 border-t border-gray-100/60'>
            <div className='max-w-5xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-10 gap-y-4'>
              {TRUSTED_LOGOS.map((name) => (
                <span
                  key={name}
                  className='text-base sm:text-lg text-gray-400 font-medium select-none hover:text-gray-600 transition-colors'
                >
                  {name}
                </span>
              ))}
            </div>
          </section>
        </MotionFadeIn>

        {/* ================= FEATURES 3D SWIPE & GRID ================= */}
        <section id='features' className='py-16 sm:py-24 relative z-10'>
          <div className='max-w-5xl mx-auto px-4 sm:px-6'>
            <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12'>
              <div>
                <p className='text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-semibold'>Features</p>
                <h2 className='mt-2 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight'>
                  Everything you need to land the role.
                </h2>
                <p className='mt-2 text-gray-500 text-sm sm:text-[15px]'>
                  A complete AI career stack, designed for CS students who don't have time to waste.
                </p>
              </div>

              {/* Nút chuyển chế độ xem: Vuốt 3D Coverflow vs Lưới 3D Grid */}
              <div className='inline-flex items-center p-1 rounded-xl bg-gray-100 border border-gray-200 self-start sm:self-auto'>
                <button
                  type='button'
                  onClick={() => setFeatureViewMode('coverflow')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    featureViewMode === 'coverflow'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Layers className='w-3.5 h-3.5' />
                  <span>3D Swipe</span>
                </button>
                <button
                  type='button'
                  onClick={() => setFeatureViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    featureViewMode === 'grid'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid className='w-3.5 h-3.5' />
                  <span>Grid</span>
                </button>
              </div>
            </div>

            {/* Chế độ 1: 3D Swipe Coverflow Carousel */}
            {featureViewMode === 'coverflow' ? (
              <div>
                <p className='text-center text-xs text-gray-400 mb-2'>
                  ← Kéo hoặc vuốt ngang để xem tính năng với góc nhìn 3D →
                </p>
                <Coverflow3D
                  items={FEATURES.map((feature) => {
                    const Icon = feature.icon
                    return (
                      <div
                        key={feature.title}
                        className='bg-white p-7 sm:p-8 rounded-2xl border border-gray-200 h-[260px] flex flex-col justify-between'
                      >
                        <div>
                          <div className='w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4'>
                            <Icon className='w-5 h-5' />
                          </div>
                          <h3 className='font-bold text-gray-900 text-lg sm:text-xl'>{feature.title}</h3>
                          <p className='mt-2.5 text-sm text-gray-500 leading-relaxed'>{feature.description}</p>
                        </div>
                        <div className='text-xs font-semibold text-indigo-600 flex items-center gap-1'>
                          <span>Explore feature</span>
                          <ArrowRight className='w-3.5 h-3.5' />
                        </div>
                      </div>
                    )
                  })}
                />
              </div>
            ) : (
              /* Chế độ 2: Hạng mục 2: Tilt Card cho các card đang có */
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                {FEATURES.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <Card3D
                      key={feature.title}
                      maxTilt={6}
                      scale={1.015}
                      className='bg-white p-7 rounded-2xl border border-gray-200 shadow-xs hover:border-gray-300 transition-colors'
                    >
                      <div className='w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4'>
                        <Icon className='w-5 h-5' />
                      </div>
                      <h3 className='font-semibold text-gray-900 text-base sm:text-lg'>{feature.title}</h3>
                      <p className='mt-2 text-xs sm:text-[15px] text-gray-500 leading-relaxed'>{feature.description}</p>
                    </Card3D>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* ================= TESTIMONIALS 3D SWIPE ================= */}
        <section className='py-16 sm:py-24 bg-white border-y border-gray-200 relative z-10'>
          <div className='max-w-5xl mx-auto px-4 sm:px-6'>
            <ScrollPerspective3D>
              <div className='text-center max-w-xl mx-auto mb-8'>
                <p className='text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-semibold'>Customers</p>
                <h2 className='mt-2 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight'>
                  From classroom to FAANG.
                </h2>
                <p className='mt-2 text-xs text-gray-400'>Vuốt ngang để xem phản hồi thực tế từ các học viên</p>
              </div>
            </ScrollPerspective3D>

            {/* 3D Coverflow cho Testimonials */}
            <Coverflow3D
              items={TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className='bg-[#FAFAF9] border border-gray-200 rounded-2xl p-7 sm:p-8 flex flex-col justify-between h-[250px]'
                >
                  <p className='text-sm sm:text-[15px] text-gray-700 leading-relaxed italic'>"{t.quote}"</p>
                  <div className='mt-4 pt-4 border-t border-gray-200/80 flex items-center gap-3'>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold ${t.avatarColor}`}
                    >
                      {t.name
                        .split(' ')
                        .map((p) => p[0])
                        .join('')}
                    </div>
                    <div>
                      <div className='text-sm font-bold text-gray-900'>{t.name}</div>
                      <div className='text-xs sm:text-sm text-gray-500'>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            />
          </div>
        </section>

        {/* ================= PRICING 3D CARDS + HẠNG MỤC 4: GRADIENT BORDER ================= */}
        <section id='pricing' className='py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10'>
          <ScrollPerspective3D>
            <div className='text-center max-w-xl mx-auto mb-10 sm:mb-14'>
              <p className='text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-semibold'>Pricing</p>
              <h2 className='mt-2 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight'>
                Plans that grow with you.
              </h2>
            </div>
          </ScrollPerspective3D>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 items-stretch'>
            {PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.name
              const isPro = plan.highlighted

              const cardElement = (
                <Card3D
                  maxTilt={6}
                  scale={1.015}
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`relative bg-white rounded-2xl p-6 sm:p-7 border-2 cursor-pointer transition-all h-full flex flex-col justify-between ${
                    isSelected ? 'border-indigo-600 shadow-xl' : 'border-gray-200 hover:border-gray-300 shadow-xs'
                  }`}
                >
                  <div>
                    {plan.badge && (
                      <span
                        className={`absolute -top-3 ${
                          plan.highlighted ? 'left-6 bg-indigo-600 text-white' : 'right-6 bg-gray-100 text-gray-700'
                        } text-xs font-medium px-3 py-1 rounded-full shadow-xs`}
                      >
                        {plan.badge}
                      </span>
                    )}

                    <h3 className='font-semibold text-gray-900 text-base sm:text-lg'>{plan.name}</h3>
                    <p className='mt-1 text-xs sm:text-sm text-gray-500 min-h-[36px]'>{plan.tagline}</p>

                    <div className='mt-5 flex items-baseline gap-1.5'>
                      <span className='text-3xl sm:text-4xl font-bold text-gray-900'>{plan.price}</span>
                      <span className='text-gray-500 text-xs sm:text-sm'>{plan.period}</span>
                      {plan.originalPrice && (
                        <span className='text-gray-400 text-xs sm:text-sm line-through ml-1'>{plan.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('/register')
                      }}
                      className={`mt-6 w-full rounded-xl py-2.5 text-xs sm:text-[15px] font-medium transition cursor-pointer ${
                        plan.highlighted
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                          : 'border border-gray-200 text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {plan.cta}
                    </button>

                    <ul className='mt-6 space-y-3'>
                      {plan.features.map((feature) => (
                        <li key={feature} className='flex items-start gap-2 text-xs sm:text-[15px] text-gray-600'>
                          <Check className='w-4 h-4 text-gray-900 mt-0.5 shrink-0' />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card3D>
              )

              if (isPro) {
                return (
                  <GradientBorderCard key={plan.name} rounded='rounded-2xl'>
                    {cardElement}
                  </GradientBorderCard>
                )
              }

              return <div key={plan.name}>{cardElement}</div>
            })}
          </div>
        </section>

        {/* ================= FAQ + CLOSING CTA ================= */}
        <section id='faq' className='py-16 sm:py-24 px-4 sm:px-6 max-w-3xl mx-auto relative z-10'>
          <ScrollPerspective3D>
            <div className='text-center mb-10'>
              <p className='text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-semibold'>FAQ</p>
              <h2 className='mt-2 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight'>Questions, answered.</h2>
            </div>
          </ScrollPerspective3D>

          <div className='border-t border-gray-200'>
            {FAQS.map((item, i) => {
              const isOpen = openFaq === i
              return (
                <div key={item.question} className='border-b border-gray-200'>
                  <button
                    type='button'
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className='w-full flex items-center justify-between py-5 text-left cursor-pointer'
                    aria-expanded={isOpen}
                  >
                    <span className='text-sm sm:text-[15px] font-medium text-gray-900'>{item.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-indigo-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className='pb-5 text-xs sm:text-[15px] text-gray-500 leading-relaxed pr-8'>{item.answer}</p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Hạng mục 4: Gradient Border cho Closing CTA Banner */}
          <div className='mt-16'>
            <GradientBorderCard rounded='rounded-3xl'>
              <Card3D
                maxTilt={4}
                scale={1.01}
                glare={true}
                className='bg-white border border-gray-200 rounded-3xl px-6 sm:px-8 py-12 sm:py-16 text-center shadow-lg'
              >
                <Floating3D duration={5} distance={8}>
                  <div className='w-12 h-12 rounded-2xl bg-[#131428] flex items-center justify-center mx-auto mb-4 p-1.5 shadow-md'>
                    <img src='/favicon.svg' alt='EduMap AI' className='w-full h-full object-contain' />
                  </div>
                </Floating3D>

                <h3 className='text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight'>
                  Ready to map your career?
                </h3>
                <p className='mt-3 text-gray-500 text-sm sm:text-[15px] max-w-md mx-auto'>
                  Join 120,000+ students building the career they actually want — in half the time.
                </p>
                <button
                  type='button'
                  onClick={() => navigate('/register')}
                  className='mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-medium px-6 py-3 text-[15px] transition shadow-md hover:shadow-indigo-600/25 cursor-pointer'
                >
                  <span>Get started</span>
                  <ArrowRight className='w-4 h-4' />
                </button>
              </Card3D>
            </GradientBorderCard>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
