import { Link } from 'react-router'
import { Sparkles, TrendingUp, Compass, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react'
import { MotionFadeIn } from '../../motion/MotionWrapper'

interface JobsHeroBannerProps {
  activeTab: 'trending' | 'analysis'
}

export default function JobsHeroBanner({ activeTab }: JobsHeroBannerProps) {
  return (
    <MotionFadeIn className='relative overflow-hidden rounded-3xl border border-indigo-500/20 dark:border-white/[0.08] bg-gradient-to-br from-indigo-900/30 via-slate-900/40 to-purple-950/30 dark:from-[#1D1735] dark:via-[#15141C] dark:to-[#19132A] p-6 sm:p-8 md:p-10 shadow-lg shadow-indigo-950/10 mb-8'>
      {/* Background Decorative Glow Orbs */}
      <div className='absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/15 dark:bg-[#5F2CFF]/20 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute -left-12 -bottom-12 w-56 h-56 bg-purple-500/15 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none' />

      {/* Grid Pattern Overlay */}
      <div
        className='absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]'
        aria-hidden='true'
      />

      <div className='relative z-10 max-w-3xl'>
        {/* Top Badge */}
        <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 dark:bg-[#5F2CFF]/20 border border-indigo-500/20 dark:border-[#5F2CFF]/30 text-xs font-semibold text-indigo-600 dark:text-[#A99DFF] mb-4 backdrop-blur-sm'>
          <Sparkles className='w-3.5 h-3.5 animate-pulse text-indigo-500 dark:text-[#A99DFF]' />
          <span>EduMap AI Career Radar · Thị trường IT 2026</span>
        </div>

        {/* Heading */}
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-[#ECE9E4] leading-snug'>
          Khám Phá & Chinh Phục{' '}
          <span className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-[#9D84FF] dark:via-[#C49BFF] dark:to-[#F472B6] bg-clip-text text-transparent'>
            Cơ Hội Nghề Nghiệp IT
          </span>
        </h1>

        {/* Subtitle */}
        <p className='mt-3 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-[#A29FA8] max-w-2xl'>
          Hệ thống đối soát kỹ năng thực chiến từ các dự án lập trình thực tế của bạn với nhu cầu tuyển dụng theo thời
          gian thực trên các nền tảng ITviec, TopCV và LinkedIn.
        </p>

        {/* Action Tabs / Switcher */}
        <div className='mt-6 flex flex-wrap items-center gap-3'>
          <Link
            to='/jobs/trending'
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'trending'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400/30'
                : 'bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-[#ECE9E4] hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
          >
            <TrendingUp className='w-4 h-4' />
            <span>Việc làm xu hướng (Trending)</span>
          </Link>

          <Link
            to='/jobs/analysis'
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'analysis'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400/30'
                : 'bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-[#ECE9E4] hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
          >
            <Compass className='w-4 h-4' />
            <span>Phân tích gợi ý việc làm của tôi</span>
            <ArrowUpRight className='w-3.5 h-3.5 opacity-80' />
          </Link>
        </div>

        {/* Quick Highlights Row */}
        <div className='mt-6 pt-5 border-t border-gray-200/60 dark:border-white/5 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-gray-600 dark:text-[#A29FA8]'>
          <div className='flex items-center gap-1.5'>
            <Zap className='w-3.5 h-3.5 text-amber-500' />
            <span>Dữ liệu chuẩn thị trường IT 2026</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <ShieldCheck className='w-3.5 h-3.5 text-emerald-500' />
            <span>Bám sát Tech Stack GitHub thực tế</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <Sparkles className='w-3.5 h-3.5 text-indigo-500 dark:text-[#A99DFF]' />
            <span>Kết nối trực tiếp ITviec & TopCV</span>
          </div>
        </div>
      </div>
    </MotionFadeIn>
  )
}
