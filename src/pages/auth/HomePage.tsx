import { useTranslation } from 'react-i18next'
import { useBillingPlansQuery } from '../../hooks/billingQuery'
import {
  formatPrice,
  getCardHighlights,
  getPlanDescription,
  getPlanName,
  getYearlySavingBadge,
} from '../../utils/billing'
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

const FEATURE_ICONS = [Brain, GitBranch, Map, Target, Zap, Sparkles]

const TESTIMONIAL_META = [
  {
    name: 'Sarah Kim',
    role: 'CS @ Stanford',
    avatarColor: 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300',
  },
  {
    name: 'David Chen',
    role: 'SE Intern @ Google',
    avatarColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
  },
  {
    name: 'Priya Patel',
    role: 'ML @ CMU',
    avatarColor: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
  },
]

// ---------- dashboard preview grid (deterministic pseudo-random fill) ----------

const GRID_ROWS = 4
const GRID_COLS = 14

function cellShade(row: number, col: number): string {
  const seed = (row * 7 + col * 13) % 5
  if (seed === 0) return 'bg-gray-100 dark:bg-white/5'
  if (seed === 1) return 'bg-indigo-100 dark:bg-indigo-950/40'
  if (seed === 2) return 'bg-indigo-300 dark:bg-indigo-700/50'
  if (seed === 3) return 'bg-indigo-200 dark:bg-indigo-900/40'
  return 'bg-indigo-500 dark:bg-indigo-500/70'
}

const BOTTOM_STATS = [
  { value: '120K+', labelKey: 'home.stats.students' },
  { value: '412', labelKey: 'home.stats.universities' },
  { value: '94%', labelKey: 'home.stats.internship' },
  { value: '4.9★', labelKey: 'home.stats.rating' },
]

// ---------- page ----------

export default function HomePage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [featureViewMode, setFeatureViewMode] = useState<'coverflow' | 'grid'>('coverflow')
  const { t } = useTranslation()

  const featureItems = t('home.features.items', { returnObjects: true }) as { title: string; description: string }[]
  const features = FEATURE_ICONS.map((icon, i) => ({ icon, ...featureItems[i] }))

  const testimonialItems = t('home.testimonials.items', { returnObjects: true }) as { quote: string }[]
  const testimonials = TESTIMONIAL_META.map((m, i) => ({ ...m, quote: testimonialItems[i]?.quote ?? '' }))

  const { data: plansRes, isLoading: plansLoading, isError: plansError } = useBillingPlansQuery()
  const plans = plansRes?.data?.data ?? []

  const faqs = t('home.faq.items', { returnObjects: true }) as { question: string; answer: string }[]

  return (
    <div className='min-h-screen flex flex-col bg-[#FAFAF9] dark:bg-[#121114] overflow-x-hidden selection:bg-indigo-600 selection:text-white transition-colors'>
      <PublicHeader onSignIn={() => navigate('/login')} onGetStarted={() => navigate('/register')} />

      <main className='flex-1 relative'>
        {/* Lớp nền Parallax nhẹ nhàng (chỉ dùng màu indigo-100/50 sẵn có) */}
        <div aria-hidden='true' className='pointer-events-none absolute inset-0 overflow-hidden'>
          <div className='absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-indigo-100/50 dark:from-indigo-950/20 to-transparent rounded-full blur-3xl opacity-50' />
          <div className='absolute top-96 -left-32 w-80 h-80 bg-indigo-50 dark:bg-indigo-950/10 rounded-full blur-2xl opacity-60' />
        </div>

        {/* ================= HERO SECTION ================= */}
        <section className='relative bg-[#FAFAF9] dark:bg-[#121114] z-10 transition-colors'>
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
                <div className='relative z-10 inline-flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/10 shadow-sm hover:border-gray-300 dark:hover:border-white/20 transition-all select-none'>
                  <div className='w-8 h-8 rounded-xl bg-[#131428] flex items-center justify-center shrink-0 p-1 shadow-xs'>
                    <img src='/favicon.svg' alt='EduMap AI' className='w-full h-full object-contain' />
                  </div>
                  <div className='text-left'>
                    <div className='text-xs font-black tracking-tight text-gray-900 dark:text-[#ECE9E4] leading-none'>
                      EDUMAP<span className='text-indigo-600 dark:text-[#A99DFF]'>AI</span>
                    </div>
                    <div className='text-[8px] font-bold tracking-wider text-gray-400 dark:text-[#85808C] uppercase mt-0.5'>
                      {t('brand.tagline')}
                    </div>
                  </div>
                  <span className='w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20' />
                  <span className='text-xs font-semibold text-indigo-600 dark:text-[#A99DFF] hidden sm:inline'>
                    {t('home.poweredBy')}
                  </span>
                </div>
              </Floating3D>
            </div>

            {/* Tiêu đề chính Hero */}
            <ScrollPerspective3D rotateXAmount={4}>
              <h1 className='text-4xl sm:text-6xl font-bold text-gray-900 dark:text-[#ECE9E4] tracking-tight leading-[1.12] sm:leading-[1.1] max-w-4xl mx-auto'>
                {t('home.hero.title1')}
                <br />
                {t('home.hero.title2')}
              </h1>

              <p className='mt-5 sm:mt-6 text-base sm:text-lg text-gray-500 dark:text-[#B5B1BA] max-w-2xl mx-auto leading-relaxed'>
                {t('home.hero.desc')}
              </p>
            </ScrollPerspective3D>

            {/* Nút bấm CTA với hiệu ứng Micro-interaction 3D */}
            <div className='mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto sm:max-w-none relative z-10'>
              <button
                type='button'
                onClick={() => navigate('/register')}
                className='w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-medium px-6 py-3 text-[15px] transition-all shadow-md hover:shadow-indigo-600/25 cursor-pointer'
              >
                <span>{t('common.getStarted')}</span>
                <ArrowRight className='w-4 h-4' />
              </button>
              <button
                type='button'
                onClick={() => {
                  const el = document.getElementById('preview-card')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
                className='w-full sm:w-auto flex items-center justify-center gap-2 text-gray-900 dark:text-[#ECE9E4] font-medium px-4 py-3 text-[15px] hover:text-gray-600 dark:hover:text-white active:scale-[0.98] transition cursor-pointer'
              >
                <Play className='w-4 h-4 text-indigo-600 dark:text-[#A99DFF]' />
                <span>{t('home.hero.watchDemo')}</span>
              </button>
            </div>

            <p className='mt-4 text-xs sm:text-sm text-gray-400 dark:text-[#85808C] relative z-10'>
              {t('home.hero.freeNote')}
            </p>

            {/* ================= DASHBOARD PREVIEW 3D TILT CARD ================= */}
            {/* Hạng mục 2: Tilt Card + Hạng mục 3: Layered Depth Panel */}
            <div id='preview-card' className='mt-12 sm:mt-16 relative z-10'>
              <Card3D
                maxTilt={6}
                scale={1.015}
                glare={true}
                className='rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A191C] shadow-xl overflow-hidden text-left'
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
                <MotionStaggerContainer className='grid grid-cols-2 sm:grid-cols-4 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A191C]'>
                  {BOTTOM_STATS.map((stat, i) => (
                    <MotionStaggerItem
                      key={stat.labelKey}
                      className={`px-4 sm:px-6 py-5 sm:py-6 text-center ${i > 0 ? 'border-l border-gray-200 dark:border-white/10' : ''}`}
                    >
                      <div className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-[#ECE9E4]'>
                        {stat.value}
                      </div>
                      <div className='text-xs sm:text-sm text-gray-500 dark:text-[#A29FA8] mt-1'>
                        {t(stat.labelKey)}
                      </div>
                    </MotionStaggerItem>
                  ))}
                </MotionStaggerContainer>
              </Card3D>
            </div>
          </div>
        </section>

        {/* ================= LOGO STRIP ================= */}
        <MotionFadeIn>
          <section className='py-12 sm:py-14 border-t border-gray-100/60 dark:border-white/5'>
            <div className='max-w-5xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-10 gap-y-4'>
              {TRUSTED_LOGOS.map((name) => (
                <span
                  key={name}
                  className='text-base sm:text-lg text-gray-400 dark:text-[#5E5A64] font-medium select-none hover:text-gray-600 dark:hover:text-[#A29FA8] transition-colors'
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
                <p className='text-xs sm:text-sm text-gray-500 dark:text-[#A29FA8] uppercase tracking-wider font-semibold'>
                  {t('home.features.label')}
                </p>
                <h2 className='mt-2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
                  {t('home.features.title')}
                </h2>
                <p className='mt-2 text-gray-500 dark:text-[#B5B1BA] text-sm sm:text-[15px]'>
                  {t('home.features.subtitle')}
                </p>
              </div>

              {/* Nút chuyển chế độ xem: Vuốt 3D Coverflow vs Lưới 3D Grid */}
              <div className='inline-flex items-center p-1 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 self-start sm:self-auto'>
                <button
                  type='button'
                  onClick={() => setFeatureViewMode('coverflow')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    featureViewMode === 'coverflow'
                      ? 'bg-white dark:bg-[#232227] text-indigo-600 dark:text-[#A99DFF] shadow-xs'
                      : 'text-gray-600 dark:text-[#A29FA8] hover:text-gray-900 dark:hover:text-[#ECE9E4]'
                  }`}
                >
                  <Layers className='w-3.5 h-3.5' />
                  <span>{t('home.features.swipe')}</span>
                </button>
                <button
                  type='button'
                  onClick={() => setFeatureViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    featureViewMode === 'grid'
                      ? 'bg-white dark:bg-[#232227] text-indigo-600 dark:text-[#A99DFF] shadow-xs'
                      : 'text-gray-600 dark:text-[#A29FA8] hover:text-gray-900 dark:hover:text-[#ECE9E4]'
                  }`}
                >
                  <LayoutGrid className='w-3.5 h-3.5' />
                  <span>{t('home.features.grid')}</span>
                </button>
              </div>
            </div>

            {/* Chế độ 1: 3D Swipe Coverflow Carousel */}
            {featureViewMode === 'coverflow' ? (
              <div>
                <p className='text-center text-xs text-gray-400 dark:text-[#85808C] mb-2'>
                  {t('home.features.swipeHint')}
                </p>
                <Coverflow3D
                  items={features.map((feature) => {
                    const Icon = feature.icon
                    return (
                      <div
                        key={feature.title}
                        className='bg-white dark:bg-[#1A191C] p-7 sm:p-8 rounded-2xl border border-gray-200 dark:border-white/10 h-[260px] flex flex-col justify-between transition-colors'
                      >
                        <div>
                          <div className='w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/40 flex items-center justify-center text-indigo-600 dark:text-[#A99DFF] mb-4'>
                            <Icon className='w-5 h-5' />
                          </div>
                          <h3 className='font-bold text-gray-900 dark:text-[#ECE9E4] text-lg sm:text-xl'>
                            {feature.title}
                          </h3>
                          <p className='mt-2.5 text-sm text-gray-500 dark:text-[#B5B1BA] leading-relaxed'>
                            {feature.description}
                          </p>
                        </div>
                        <div className='text-xs font-semibold text-indigo-600 dark:text-[#A99DFF] flex items-center gap-1'>
                          <span>{t('home.features.explore')}</span>
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
                {features.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <Card3D
                      key={feature.title}
                      maxTilt={6}
                      scale={1.015}
                      className='bg-white dark:bg-[#1A191C] p-7 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xs hover:border-gray-300 dark:hover:border-white/20 transition-colors'
                    >
                      <div className='w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/40 flex items-center justify-center text-indigo-600 dark:text-[#A99DFF] mb-4'>
                        <Icon className='w-5 h-5' />
                      </div>
                      <h3 className='font-semibold text-gray-900 dark:text-[#ECE9E4] text-base sm:text-lg'>
                        {feature.title}
                      </h3>
                      <p className='mt-2 text-xs sm:text-[15px] text-gray-500 dark:text-[#B5B1BA] leading-relaxed'>
                        {feature.description}
                      </p>
                    </Card3D>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* ================= TESTIMONIALS 3D SWIPE ================= */}
        <section className='py-16 sm:py-24 bg-white dark:bg-[#1A191C] border-y border-gray-200 dark:border-white/10 relative z-10 transition-colors'>
          <div className='max-w-5xl mx-auto px-4 sm:px-6'>
            <ScrollPerspective3D>
              <div className='text-center max-w-xl mx-auto mb-8'>
                <p className='text-xs sm:text-sm text-gray-500 dark:text-[#A29FA8] uppercase tracking-wider font-semibold'>
                  {t('home.testimonials.label')}
                </p>
                <h2 className='mt-2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
                  {t('home.testimonials.title')}
                </h2>
                <p className='mt-2 text-xs text-gray-400 dark:text-[#85808C]'>{t('home.testimonials.hint')}</p>
              </div>
            </ScrollPerspective3D>

            {/* 3D Coverflow cho Testimonials */}
            <Coverflow3D
              items={testimonials.map((t) => (
                <div
                  key={t.name}
                  className='bg-[#FAFAF9] dark:bg-[#232227] border border-gray-200 dark:border-white/10 rounded-2xl p-7 sm:p-8 flex flex-col justify-between h-[250px] transition-colors'
                >
                  <p className='text-sm sm:text-[15px] text-gray-700 dark:text-[#ECE9E4] leading-relaxed italic'>
                    "{t.quote}"
                  </p>
                  <div className='mt-4 pt-4 border-t border-gray-200/80 dark:border-white/10 flex items-center gap-3'>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold ${t.avatarColor}`}
                    >
                      {t.name
                        .split(' ')
                        .map((p) => p[0])
                        .join('')}
                    </div>
                    <div>
                      <div className='text-sm font-bold text-gray-900 dark:text-[#ECE9E4]'>{t.name}</div>
                      <div className='text-xs sm:text-sm text-gray-500 dark:text-[#A29FA8]'>{t.role}</div>
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
              <p className='text-xs sm:text-sm text-gray-500 dark:text-[#A29FA8] uppercase tracking-wider font-semibold'>
                {t('home.plans.label')}
              </p>
              <h2 className='mt-2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
                {t('home.plans.title')}
              </h2>
            </div>
          </ScrollPerspective3D>

          {plansLoading ? (
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className='h-[460px] rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse' />
              ))}
            </div>
          ) : plansError || plans.length === 0 ? (
            <p className='text-center text-sm text-red-500'>{t('billing.subscription.loadError')}</p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch'>
              {plans.map((plan) => {
                const { amount, period } = formatPrice(plan)
                const isPopular = plan.code === 'PRO_STUDENT'
                const isSelected = selectedPlan === plan.id
                const savingBadge = getYearlySavingBadge(plan, plans)

                const cardElement = (
                  <Card3D
                    maxTilt={6}
                    scale={1.015}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative bg-white dark:bg-[#1A191C] rounded-2xl p-6 border-2 cursor-pointer transition-all h-full flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 dark:border-[#818CF8] shadow-xl'
                        : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 shadow-xs'
                    }`}
                  >
                    <div>
                      <div className='mb-3 flex h-6 items-center justify-between'>
                        {isPopular ? (
                          <span className='bg-indigo-600 text-white text-[11px] font-medium px-3 py-1 rounded-full'>
                            {t('billing.subscription.mostPopular')}
                          </span>
                        ) : (
                          <span />
                        )}
                        {savingBadge && (
                          <span className='bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[11px] font-medium px-3 py-1 rounded-full'>
                            {savingBadge}
                          </span>
                        )}
                      </div>

                      <h3 className='text-[17px] font-semibold text-gray-900 dark:text-[#ECE9E4]'>
                        {getPlanName(plan.code, plan.name)}
                      </h3>
                      <p className='mt-1 text-sm text-gray-500 dark:text-[#A29FA8] leading-5 min-h-[40px]'>
                        {getPlanDescription(plan.code, plan.description)}
                      </p>

                      <div className='mt-4 flex items-baseline gap-1'>
                        <span className='text-3xl font-bold text-gray-900 dark:text-[#ECE9E4]'>{amount}</span>
                        <span className='text-sm text-gray-400 dark:text-[#A29FA8]'>{period}</span>
                      </div>
                    </div>

                    <div>
                      <button
                        type='button'
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate('/register')
                        }}
                        className={`mt-5 w-full rounded-xl py-2.5 text-sm font-medium transition cursor-pointer ${
                          isPopular
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                            : 'border border-gray-200 dark:border-white/10 text-gray-900 dark:text-[#ECE9E4] hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                      >
                        {plan.priceVnd === 0 ? t('common.getStarted') : t('billing.subscription.upgrade')}
                      </button>

                      <ul className='mt-5 space-y-2.5'>
                        {getCardHighlights(plan).map((label) => (
                          <li key={label} className='flex items-center gap-2 text-sm text-gray-600 dark:text-[#ECE9E4]'>
                            <Check className='w-4 h-4 text-indigo-600 dark:text-[#A99DFF] shrink-0' />
                            {label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card3D>
                )

                if (isPopular) {
                  return (
                    <GradientBorderCard key={plan.id} rounded='rounded-2xl'>
                      {cardElement}
                    </GradientBorderCard>
                  )
                }
                return (
                  <div key={plan.id} className='h-full'>
                    {cardElement}
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ================= FAQ + CLOSING CTA ================= */}
        <section id='faq' className='py-16 sm:py-24 px-4 sm:px-6 max-w-3xl mx-auto relative z-10'>
          <ScrollPerspective3D>
            <div className='text-center mb-10'>
              <p className='text-xs sm:text-sm text-gray-500 dark:text-[#A29FA8] uppercase tracking-wider font-semibold'>
                {t('home.faq.label')}
              </p>
              <h2 className='mt-2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
                {t('home.faq.title')}
              </h2>
            </div>
          </ScrollPerspective3D>

          <div className='border-t border-gray-200 dark:border-white/10'>
            {faqs.map((item, i) => {
              const isOpen = openFaq === i
              return (
                <div key={item.question} className='border-b border-gray-200 dark:border-white/10'>
                  <button
                    type='button'
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className='w-full flex items-center justify-between py-5 text-left cursor-pointer'
                    aria-expanded={isOpen}
                  >
                    <span className='text-sm sm:text-[15px] font-medium text-gray-900 dark:text-[#ECE9E4]'>
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 dark:text-[#85808C] transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-indigo-600 dark:text-[#A99DFF]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className='pb-5 text-xs sm:text-[15px] text-gray-500 dark:text-[#B5B1BA] leading-relaxed pr-8'>
                      {item.answer}
                    </p>
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
                className='bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/10 rounded-3xl px-6 sm:px-8 py-12 sm:py-16 text-center shadow-lg transition-colors'
              >
                <Floating3D duration={5} distance={8}>
                  <div className='w-12 h-12 rounded-2xl bg-[#131428] dark:border dark:border-white/10 flex items-center justify-center mx-auto mb-4 p-1.5 shadow-md'>
                    <img src='/favicon.svg' alt='EduMap AI' className='w-full h-full object-contain' />
                  </div>
                </Floating3D>

                <h3 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
                  {t('home.cta.title')}
                </h3>
                <p className='mt-3 text-gray-500 dark:text-[#B5B1BA] text-sm sm:text-[15px] max-w-md mx-auto'>
                  {t('home.cta.desc')}
                </p>
                <button
                  type='button'
                  onClick={() => navigate('/register')}
                  className='mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-medium px-6 py-3 text-[15px] transition shadow-md hover:shadow-indigo-600/25 cursor-pointer'
                >
                  <span>{t('common.getStarted')}</span>
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
