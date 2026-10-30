import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Sparkles, ArrowRight, GitBranch, Briefcase, Zap, ShieldCheck } from 'lucide-react'
import { MotionFadeIn } from '../../motion/MotionWrapper'

interface DashboardHeroBannerProps {
  fullName?: string
  totalSkills?: number
  totalHours?: number
}

export default function DashboardHeroBanner({ fullName, totalSkills = 0, totalHours = 0 }: DashboardHeroBannerProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <MotionFadeIn className='relative overflow-hidden rounded-3xl border border-indigo-500/20 dark:border-white/[0.08] bg-gradient-to-br from-[#1C1838] via-[#12111A] to-[#1A122E] p-6 sm:p-8 md:p-10 shadow-xl shadow-indigo-950/15 mb-8 text-white'>
      {/* Background Decorative Glow Orbs */}
      <div className='absolute -right-20 -top-20 w-80 h-80 bg-[#5F2CFF]/20 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute -left-16 -bottom-16 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none' />

      {/* Grid Pattern Overlay */}
      <div
        className='absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]'
        aria-hidden='true'
      />

      <div className='relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center'>
        {/* Left Column: Greeting & Actions (Col 7) */}
        <div className='lg:col-span-7 space-y-4'>
          {/* Top Pill Badge */}
          <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#C49BFF] backdrop-blur-md'>
            <Sparkles className='w-3.5 h-3.5 text-amber-300 animate-pulse' />
            <span>EduMap AI Engine · Bảng điều khiển năng lực lập trình</span>
          </div>

          {/* Heading */}
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight'>
            Chào mừng trở lại,{' '}
            <span className='bg-gradient-to-r from-[#B99AFF] via-[#D8B4FE] to-[#F472B6] bg-clip-text text-transparent'>
              {fullName || 'bạn'}! 👋
            </span>
          </h1>

          {/* Subtitle */}
          <p className='text-sm sm:text-[15px] leading-relaxed text-[#B5B1BA] max-w-xl'>
            Tiếp tục mở rộng cây kỹ năng cá nhân hóa, đối soát tech stack từ GitHub với các cơ hội việc làm thực tế và
            chuẩn bị sẵn sàng cho những thử thách công nghệ mới.
          </p>

          {/* Action Buttons */}
          <div className='pt-2 flex flex-wrap items-center gap-3'>
            <button
              type='button'
              onClick={() => navigate('/skill-tree')}
              className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer'
            >
              <GitBranch className='w-4 h-4' />
              <span>Xem Cây kỹ năng của tôi</span>
              <ArrowRight className='w-4 h-4' />
            </button>

            <button
              type='button'
              onClick={() => navigate('/jobs/trending')}
              className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-medium hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer backdrop-blur-sm'
            >
              <Briefcase className='w-4 h-4 text-[#A99DFF]' />
              <span>Khám phá Việc làm Hot</span>
            </button>

            <button
              type='button'
              onClick={() => navigate('/upload')}
              className='inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs text-[#C49BFF] hover:text-white transition cursor-pointer'
            >
              <Zap className='w-3.5 h-3.5' />
              <span>{t('dashboard.runAnalysis')}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Mini Interactive Glassmorphic Radar Card (Col 5) */}
        <div className='lg:col-span-5'>
          <div className='rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 sm:p-6 shadow-xl relative overflow-hidden'>
            {/* Subtle glow orb inside card */}
            <div className='absolute -right-8 -bottom-8 w-36 h-36 bg-[#5F2CFF]/25 rounded-full blur-2xl pointer-events-none' />

            <div className='relative z-10 space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/20'>
                    <Zap className='w-4 h-4 text-white' />
                  </div>
                  <div>
                    <h3 className='text-xs font-bold uppercase tracking-wider text-white/90'>Tổng quan lộ trình</h3>
                    <p className='text-[11px] text-[#A29FA8]'>Cập nhật theo thời gian thực</p>
                  </div>
                </div>

                <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold'>
                  <ShieldCheck className='w-3 h-3' />
                  Đang hoạt động
                </span>
              </div>

              {/* Progress Summary Cards */}
              <div className='grid grid-cols-2 gap-3 pt-1'>
                <div className='p-3.5 rounded-xl bg-white/5 border border-white/5'>
                  <div className='text-xs text-[#A29FA8]'>Kỹ năng đã mở</div>
                  <div className='mt-1 text-xl sm:text-2xl font-black text-white'>
                    {totalSkills} <span className='text-xs font-normal text-indigo-300'>skills</span>
                  </div>
                </div>

                <div className='p-3.5 rounded-xl bg-white/5 border border-white/5'>
                  <div className='text-xs text-[#A29FA8]'>Thời lượng tích lũy</div>
                  <div className='mt-1 text-xl sm:text-2xl font-black text-white'>
                    {totalHours} <span className='text-xs font-normal text-purple-300'>giờ</span>
                  </div>
                </div>
              </div>

              {/* Footer Tip inside card */}
              <div className='pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#B5B1BA]'>
                <span>Chuẩn IEEE / ACM đối soát</span>
                <span className='font-semibold text-[#A99DFF]'>AI Advisor v2.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionFadeIn>
  )
}
