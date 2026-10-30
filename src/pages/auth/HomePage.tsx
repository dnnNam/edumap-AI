import { useTranslation } from 'react-i18next'
import { useBillingPlansQuery } from '../../hooks/billingQuery'
import {
  formatPrice,
  getCardHighlights,
  getPlanDescription,
  getPlanName,
  getYearlySavingBadge,
} from '../../utils/billing'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight, Check, ChevronDown } from 'lucide-react'
import PublicHeader from '../../components/layouts/PublicHeader'
import PublicFooter from '../../components/layouts/PublicFooter'
import LandingHero from '../../components/landing/LandingHero'
import LandingRoadmapSection from '../../components/landing/LandingRoadmapSection'
import LandingJobMarketSection from '../../components/landing/LandingJobMarketSection'
import LandingTestimonialsSection from '../../components/landing/LandingTestimonialsSection'
import { MotionFadeIn } from '../../components/motion/MotionWrapper'
import Card3D from '../../components/motion/Card3D'
import Floating3D from '../../components/motion/Floating3D'
import ScrollPerspective3D from '../../components/motion/ScrollPerspective3D'
import GradientBorderCard from '../../components/motion/GradientBorderCard'
import VideoDemoModal from '../../components/ui/VideoDemoModal'

const TRUSTED_LOGOS = ['Google', 'Stripe', 'Vercel', 'Linear', 'Notion', 'Figma', 'OpenAI', 'GitHub']

export default function HomePage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const { t } = useTranslation()

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
        <LandingHero onWatchDemo={() => setIsVideoModalOpen(true)} />

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

        {/* ================= LỘ TRÌNH KỸ NĂNG / ROADMAP ================= */}
        <LandingRoadmapSection />

        {/* ================= CƠ HỘI VIỆC LÀM & QUÉT THỊ TRƯỜNG IT ================= */}
        <LandingJobMarketSection />

        {/* ================= ĐÁNH GIÁ & PHẢN HỒI SINH VIÊN / GIẢNG VIÊN ================= */}
        <LandingTestimonialsSection />

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

      {/* Modal Video Demo Rạp Chiếu Phim Cao Cấp */}
      <VideoDemoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />

      <PublicFooter />
    </div>
  )
}
