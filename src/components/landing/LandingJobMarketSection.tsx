import { motion } from 'framer-motion'
import { Briefcase, ArrowUpRight, Search, Building2, MapPin, DollarSign, Activity } from 'lucide-react'
import { useNavigate } from 'react-router'

const LIVE_JOBS = [
  {
    id: 1,
    title: 'Junior / Mid Backend Engineer (Node.js, NestJS)',
    company: 'Fintech Unicorn SG',
    location: 'Hồ Chí Minh / Hybrid',
    salary: '22,000,000 - 35,000,000 VNĐ',
    matchScore: 96,
    tags: ['NestJS', 'PostgreSQL', 'Docker', 'Microservices'],
    hot: true,
  },
  {
    id: 2,
    title: 'Fullstack Developer (React 19, TypeScript)',
    company: 'NextGen SaaS Platform',
    location: 'Hà Nội / Remote',
    salary: '18,000,000 - 30,000,000 VNĐ',
    matchScore: 92,
    tags: ['Next.js', 'React', 'Tailwind', 'GraphQL'],
    hot: false,
  },
  {
    id: 3,
    title: 'GenAI & RAG Application Engineer',
    company: 'AI Innovation Lab',
    location: 'Đà Nẵng / Remote',
    salary: '28,000,000 - 45,000,000 VNĐ',
    matchScore: 89,
    tags: ['Python', 'FastAPI', 'LangChain', 'VectorDB'],
    hot: true,
  },
  {
    id: 4,
    title: 'Cloud DevOps Associate (AWS, CI/CD)',
    company: 'Global Tech Delivery Center',
    location: 'Hồ Chí Minh',
    salary: '20,000,000 - 32,000,000 VNĐ',
    matchScore: 86,
    tags: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'],
    hot: false,
  },
]

const DEMAND_BARS = [
  { skill: 'NestJS / Backend Core', score: 96, growth: '+32% quý này' },
  { skill: 'React / Next.js', score: 93, growth: '+28% quý này' },
  { skill: 'Generative AI / RAG Pipelines', score: 98, growth: '+140% đột phá' },
  { skill: 'Docker & Cloud Kubernetes', score: 90, growth: '+24% quý này' },
]

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const listItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: 'easeOut' as const,
    },
  },
}

export default function LandingJobMarketSection() {
  const navigate = useNavigate()

  return (
    <section
      id='jobs'
      className='py-20 sm:py-28 relative z-10 overflow-hidden bg-[#FAFAF9] dark:bg-[#121114] transition-colors'
    >
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16'>
          <div>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-3'>
              <Activity className='w-3.5 h-3.5 animate-pulse text-emerald-500' />
              REALTIME JOB MARKET SCRAPING ENGINE
            </div>
            <h2 className='text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
              Cơ Hội Việc Làm & Quét Dữ Liệu Thị Trường IT
            </h2>
            <p className='mt-3 text-sm sm:text-base text-gray-500 dark:text-[#B5B1BA] max-w-xl'>
              Hệ thống tự động quét và phân tích hàng ngàn tin tuyển dụng từ các sàn lớn, tính toán độ khớp năng lực với
              hồ sơ của bạn theo thời gian thực.
            </p>
          </div>

          <button
            type='button'
            onClick={() => navigate('/jobs/trending')}
            className='inline-flex items-center gap-2 self-start md:self-auto px-5 py-2.5 rounded-xl bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/10 hover:border-indigo-400 text-xs sm:text-sm font-bold text-gray-900 dark:text-[#ECE9E4] transition shadow-xs cursor-pointer'
          >
            <Search className='w-4 h-4 text-indigo-500' />
            <span>Xem xu hướng thị trường đầy đủ</span>
            <ArrowUpRight className='w-4 h-4 text-gray-400' />
          </button>
        </div>

        {/* 2-Column Split: Demand Charts on Left, Job List on Right */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
          {/* Left Column: Biểu đồ kỹ năng & Mức độ khát nhân lực (5 cols) */}
          <div className='lg:col-span-5 rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-6 sm:p-7 shadow-xs'>
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-[#A99DFF] flex items-center justify-center font-bold'>
                  <Briefcase className='w-4 h-4' />
                </div>
                <h3 className='font-bold text-gray-900 dark:text-[#ECE9E4] text-base'>Nhu Cầu Kỹ Năng 2026</h3>
              </div>
              <span className='text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full'>
                Live Updated
              </span>
            </div>

            <p className='text-xs text-gray-500 dark:text-[#A29FA8] mb-6'>
              Tỷ lệ tin tuyển dụng yêu cầu các công nghệ hàng đầu trên tổng số 12,000+ vị trí IT:
            </p>

            <div className='space-y-4'>
              {DEMAND_BARS.map((bar) => (
                <div key={bar.skill} className='space-y-1.5'>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='font-bold text-gray-800 dark:text-[#ECE9E4]'>{bar.skill}</span>
                    <span className='font-mono font-semibold text-indigo-600 dark:text-[#A99DFF]'>{bar.score}%</span>
                  </div>
                  <div className='w-full h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden'>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bar.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className='h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 dark:to-[#A99DFF]'
                    />
                  </div>
                  <div className='text-[10px] text-gray-400 dark:text-[#8E8B96]'>{bar.growth}</div>
                </div>
              ))}
            </div>

            <div className='mt-8 pt-5 border-t border-gray-100 dark:border-white/5 text-xs text-gray-400 flex items-center justify-between'>
              <span>Dữ liệu tổng hợp từ:</span>
              <span className='font-semibold text-gray-700 dark:text-[#A99DFF]'>LinkedIn • TopCV • ITviec</span>
            </div>
          </div>

          {/* Right Column: Bảng danh sách việc làm hiển thị lần lượt từng dòng (7 cols) */}
          <motion.div
            variants={listContainerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.1 }}
            className='lg:col-span-7 space-y-3.5'
          >
            {LIVE_JOBS.map((job) => (
              <motion.div
                key={job.id}
                variants={listItemVariants}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className='rounded-2xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-5 shadow-xs hover:shadow-md hover:border-indigo-400/80 dark:hover:border-indigo-500/40 transition-all cursor-pointer group'
              >
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <h4 className='font-bold text-gray-900 dark:text-[#ECE9E4] text-sm sm:text-base group-hover:text-indigo-600 dark:group-hover:text-[#A99DFF] transition-colors'>
                        {job.title}
                      </h4>
                      {job.hot && (
                        <span className='px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40 text-[10px] font-bold'>
                          HOT MATCH
                        </span>
                      )}
                    </div>

                    <div className='mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-[#A29FA8] flex-wrap'>
                      <span className='flex items-center gap-1'>
                        <Building2 className='w-3.5 h-3.5 text-gray-400' />
                        {job.company}
                      </span>
                      <span className='flex items-center gap-1'>
                        <MapPin className='w-3.5 h-3.5 text-gray-400' />
                        {job.location}
                      </span>
                      <span className='flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400'>
                        <DollarSign className='w-3.5 h-3.5' />
                        {job.salary}
                      </span>
                    </div>
                  </div>

                  {/* Match Percentage Pill */}
                  <div className='shrink-0 text-right'>
                    <div className='inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold'>
                      <span>Khớp {job.matchScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className='mt-3.5 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center gap-1.5 flex-wrap'>
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className='text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-[#A29FA8]'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
