import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles, GitBranch, Terminal, Cpu, Database, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useSplash } from '../../context/SplashContext'

interface LandingHeroProps {
  onWatchDemo: () => void
}

export default function LandingHero({ onWatchDemo }: LandingHeroProps) {
  const navigate = useNavigate()
  const { isPageRevealed } = useSplash()

  return (
    <section className='relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden z-10'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        {/* 1. Holographic Tech Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isPageRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 shadow-xs mb-6 select-none'
        >
          <span className='flex h-2 w-2 relative'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-2 w-2 bg-indigo-600 dark:bg-[#A99DFF]'></span>
          </span>
          <span className='text-xs font-bold text-indigo-700 dark:text-[#C4B5FD] tracking-wide flex items-center gap-1.5'>
            <Sparkles className='w-3.5 h-3.5 text-indigo-500' />
            Tích hợp RAG AI • Phân tích GitHub Profile • Chuẩn hóa IT 2026
          </span>
        </motion.div>

        {/* 2. Main Hero Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={isPageRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className='text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-[#ECE9E4] tracking-tight leading-[1.15] max-w-4xl mx-auto'
        >
          Lộ trình học tập & Định hướng nghề nghiệp cá nhân hóa cho{' '}
          <span className='bg-gradient-to-r from-indigo-600 via-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent'>
            Developer
          </span>
        </motion.h1>

        {/* 3. Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isPageRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className='mt-5 sm:mt-6 text-base sm:text-lg text-gray-600 dark:text-[#B5B1BA] max-w-2xl mx-auto leading-relaxed'
        >
          Thu hẹp khoảng cách giữa giảng đường đại học và yêu cầu tuyển dụng thực tế. Tự động chuyển đổi kho mã nguồn
          GitHub thành cây kỹ năng trực quan, tối ưu lộ trình phát triển bản thân bằng AI.
        </motion.p>

        {/* 4. Action Buttons (CTA) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isPageRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className='mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto sm:max-w-none'
        >
          <button
            type='button'
            onClick={() => navigate('/register')}
            className='w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold px-7 py-3.5 text-sm sm:text-base transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 cursor-pointer'
          >
            <span>Khám phá Lộ trình miễn phí</span>
            <ArrowRight className='w-4.5 h-4.5' />
          </button>

          <button
            type='button'
            onClick={onWatchDemo}
            className='w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500/40 text-gray-900 dark:text-[#ECE9E4] font-bold px-6 py-3.5 text-sm sm:text-base active:scale-[0.98] transition cursor-pointer shadow-xs group'
          >
            <span className='w-7 h-7 rounded-xl bg-indigo-50 dark:bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform'>
              <Play className='w-3.5 h-3.5 fill-indigo-600 text-indigo-600 dark:fill-[#A99DFF] dark:text-[#A99DFF] ml-0.5' />
            </span>
            <span>Xem Video Demo</span>
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isPageRevealed ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='mt-3.5 text-xs text-gray-400 dark:text-[#85808C]'
        >
          Không yêu cầu thẻ tín dụng • Hoàn toàn miễn phí cho sinh viên IT
        </motion.p>

        {/* 5. THẺ MINH HỌA GIAO DIỆN LỘ TRÌNH HỌC TẬP (Trượt từ dưới lên và phóng to vào vị trí) */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={isPageRevealed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.95 }}
          transition={{ duration: 0.85, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className='mt-12 sm:mt-16 text-left relative'
        >
          {/* Ambient Glow Aura */}
          <div className='absolute -inset-1 rounded-[36px] bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-teal-500/20 blur-xl pointer-events-none' />

          <div className='relative rounded-[32px] border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#161420] shadow-2xl overflow-hidden p-5 sm:p-8 backdrop-blur-xl'>
            {/* Window Topbar */}
            <div className='flex items-center justify-between pb-5 border-b border-gray-100 dark:border-white/5'>
              <div className='flex items-center gap-2'>
                <span className='w-3 h-3 rounded-full bg-rose-500/80' />
                <span className='w-3 h-3 rounded-full bg-amber-500/80' />
                <span className='w-3 h-3 rounded-full bg-emerald-500/80' />
                <span className='ml-2 text-xs font-mono text-gray-400 dark:text-[#A29FA8]'>
                  edumap-ai // roadmap-graph.dag
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-1'>
                  <CheckCircle2 className='w-3 h-3' />
                  Độ khớp thị trường: 88%
                </span>
              </div>
            </div>

            {/* Interactive Mock DAG Skill Nodes */}
            <div className='mt-6 grid grid-cols-1 md:grid-cols-4 gap-4'>
              {/* Node 1 */}
              <div className='rounded-2xl p-4 bg-gray-50/80 dark:bg-[#1E1B2C] border border-gray-200/60 dark:border-white/5'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-[10px] font-mono text-indigo-600 dark:text-[#A99DFF] font-bold'>
                    LVL 1 • NỀN TẢNG
                  </span>
                  <Terminal className='w-4 h-4 text-gray-400' />
                </div>
                <h4 className='font-bold text-gray-900 dark:text-[#ECE9E4] text-sm'>Cấu Trúc Dữ Liệu & Giải Thuật</h4>
                <div className='mt-3 flex items-center justify-between text-[11px] text-gray-500'>
                  <span>Đã mở khóa</span>
                  <span className='font-bold text-emerald-500'>100%</span>
                </div>
                <div className='w-full h-1.5 rounded-full bg-gray-200 dark:bg-white/10 mt-1.5 overflow-hidden'>
                  <div className='h-full bg-emerald-500 rounded-full w-full' />
                </div>
              </div>

              {/* Node 2 */}
              <div className='rounded-2xl p-4 bg-indigo-50/50 dark:bg-[#25203D] border border-indigo-200/60 dark:border-indigo-500/30 ring-2 ring-indigo-500/20'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-[10px] font-mono text-indigo-600 dark:text-[#A99DFF] font-bold'>
                    LVL 2 • CHUYÊN MÔN
                  </span>
                  <Cpu className='w-4 h-4 text-indigo-500' />
                </div>
                <h4 className='font-bold text-gray-900 dark:text-[#ECE9E4] text-sm'>
                  NestJS & Microservices Architecture
                </h4>
                <div className='mt-3 flex items-center justify-between text-[11px] text-gray-500'>
                  <span>Đang tiến hành</span>
                  <span className='font-bold text-indigo-600 dark:text-[#A99DFF]'>75%</span>
                </div>
                <div className='w-full h-1.5 rounded-full bg-gray-200 dark:bg-white/10 mt-1.5 overflow-hidden'>
                  <div className='h-full bg-indigo-600 dark:bg-[#A99DFF] rounded-full w-3/4' />
                </div>
              </div>

              {/* Node 3 */}
              <div className='rounded-2xl p-4 bg-gray-50/80 dark:bg-[#1E1B2C] border border-gray-200/60 dark:border-white/5'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-[10px] font-mono text-gray-400 font-bold'>LVL 3 • DỮ LIỆU</span>
                  <Database className='w-4 h-4 text-gray-400' />
                </div>
                <h4 className='font-bold text-gray-900 dark:text-[#ECE9E4] text-sm'>PostgreSQL, Redis & Prisma ORM</h4>
                <div className='mt-3 flex items-center justify-between text-[11px] text-gray-500'>
                  <span>Mục tiêu tiếp</span>
                  <span className='font-bold text-amber-500'>50%</span>
                </div>
                <div className='w-full h-1.5 rounded-full bg-gray-200 dark:bg-white/10 mt-1.5 overflow-hidden'>
                  <div className='h-full bg-amber-500 rounded-full w-1/2' />
                </div>
              </div>

              {/* Node 4 */}
              <div className='rounded-2xl p-4 bg-gray-50/80 dark:bg-[#1E1B2C] border border-gray-200/60 dark:border-white/5'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-[10px] font-mono text-gray-400 font-bold'>LVL 4 • DEPLOYMENT</span>
                  <GitBranch className='w-4 h-4 text-gray-400' />
                </div>
                <h4 className='font-bold text-gray-900 dark:text-[#ECE9E4] text-sm'>Docker, Kubernetes & AWS Cloud</h4>
                <div className='mt-3 flex items-center justify-between text-[11px] text-gray-500'>
                  <span>Khóa</span>
                  <span className='font-bold text-gray-400'>0%</span>
                </div>
                <div className='w-full h-1.5 rounded-full bg-gray-200 dark:bg-white/10 mt-1.5 overflow-hidden'>
                  <div className='h-full bg-gray-300 dark:bg-white/20 rounded-full w-0' />
                </div>
              </div>
            </div>

            {/* Bottom Insight Strip */}
            <div className='mt-6 pt-5 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-[#A29FA8]'>
              <span className='flex items-center gap-2'>
                <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                Hệ thống đề xuất 3 dự án thực chiến để sẵn sàng ứng tuyển vị trí Backend Engineer 2026
              </span>
              <span className='font-mono font-semibold text-indigo-600 dark:text-[#A99DFF]'>
                Dự báo mức lương: $1,200 - $1,800/tháng
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
