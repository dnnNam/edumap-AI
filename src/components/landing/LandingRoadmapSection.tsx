import { motion } from 'framer-motion'
import { Layout, Server, Bot, Cloud, Check, TrendingUp, Sparkles } from 'lucide-react'

const DOMAIN_ROADMAPS = [
  {
    id: 'frontend',
    title: 'Frontend Engineering',
    tag: 'Web & Mobile Apps',
    icon: Layout,
    color: 'from-blue-500 to-indigo-600',
    accentText: 'text-blue-600 dark:text-blue-400',
    bgBadge: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40',
    demandScore: '94% Nhu cầu cao',
    skills: [
      'React 19 & Next.js 15',
      'TypeScript Strict Mode',
      'Tailwind CSS & Shadcn',
      'State Management (Zustand)',
      'Web Performance & Core Vitals',
    ],
    avgSalary: '$800 - $1,500',
  },
  {
    id: 'backend',
    title: 'Backend Engineering',
    tag: 'High Concurrency & APIs',
    icon: Server,
    color: 'from-purple-500 to-indigo-600',
    accentText: 'text-purple-600 dark:text-[#C49BFF]',
    bgBadge:
      'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-[#C49BFF] border-purple-200 dark:border-purple-800/40',
    demandScore: '96% Nhu cầu cao',
    skills: [
      'Node.js & NestJS Architecture',
      'PostgreSQL & Prisma ORM',
      'Redis In-Memory Caching',
      'Microservices & Event-Driven',
      'RESTful & GraphQL Design',
    ],
    avgSalary: '$900 - $1,800',
  },
  {
    id: 'ai-ml',
    title: 'AI / Machine Learning',
    tag: 'LLMs & GenAI Engineering',
    icon: Bot,
    color: 'from-emerald-500 to-teal-600',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    bgBadge:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40',
    demandScore: '98% Tăng trưởng số 1',
    skills: [
      'Python Data Stack (NumPy/Pandas)',
      'Deep Learning (PyTorch)',
      'RAG & Vector Search (LangChain)',
      'LLM Fine-Tuning & Prompting',
      'FastAPI & AI Model Serving',
    ],
    avgSalary: '$1,200 - $2,500',
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud Systems',
    tag: 'CI/CD & Infrastructure',
    icon: Cloud,
    color: 'from-amber-500 to-orange-600',
    accentText: 'text-amber-600 dark:text-amber-400',
    bgBadge:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40',
    demandScore: '91% Nhu cầu ổn định',
    skills: [
      'Docker Containerization',
      'Kubernetes Cluster Orchestration',
      'GitHub Actions CI/CD Pipeline',
      'AWS / Cloud Architecture',
      'Linux Shell & System Security',
    ],
    avgSalary: '$1,000 - $2,200',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: 'easeOut' as const,
    },
  },
}

export default function LandingRoadmapSection() {
  return (
    <section
      id='roadmap'
      className='py-20 sm:py-28 relative z-10 overflow-hidden bg-white dark:bg-[#15141A] border-y border-gray-200/80 dark:border-white/5 transition-colors'
    >
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center max-w-2xl mx-auto mb-14 sm:mb-18'>
          <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 text-xs font-bold text-purple-700 dark:text-[#C49BFF] mb-3'>
            <Sparkles className='w-3.5 h-3.5' />
            LỘ TRÌNH KỸ NĂNG CHUẨN DOANH NGHIỆP
          </div>
          <h2 className='text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
            Bản Đồ Năng Lực Toàn Diện Cho 4 Nhánh IT Trọng Điểm
          </h2>
          <p className='mt-3 text-sm sm:text-base text-gray-500 dark:text-[#B5B1BA]'>
            Mỗi lộ trình được phân rã thành các node kỹ năng từ nền tảng đến chuyên sâu, tự động cập nhật theo tiêu
            chuẩn tuyển dụng IT mới nhất.
          </p>
        </div>

        {/* 4 Khối danh mục kỹ năng trượt lên theo thứ tự khi xuất hiện trong viewport */}
        <motion.div
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.15 }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
        >
          {DOMAIN_ROADMAPS.map((item) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className='rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-gray-50/50 dark:bg-[#1A1824] p-6 shadow-xs hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500/40 transition-all flex flex-col justify-between group'
              >
                <div>
                  {/* Card Header */}
                  <div className='flex items-center justify-between mb-4'>
                    <div className='w-12 h-12 rounded-2xl bg-white dark:bg-[#232032] border border-gray-200/70 dark:border-white/10 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform'>
                      <Icon className={`w-6 h-6 ${item.accentText}`} />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.bgBadge}`}>
                      {item.demandScore}
                    </span>
                  </div>

                  <h3 className='text-lg font-bold text-gray-900 dark:text-[#ECE9E4] group-hover:text-indigo-600 dark:group-hover:text-[#A99DFF] transition-colors'>
                    {item.title}
                  </h3>
                  <p className='text-xs text-gray-400 dark:text-[#8E8B96] font-medium mb-4'>{item.tag}</p>

                  {/* Skills Checklist */}
                  <ul className='space-y-2.5 pt-3 border-t border-gray-200/60 dark:border-white/5'>
                    {item.skills.map((skill) => (
                      <li key={skill} className='flex items-start gap-2 text-xs text-gray-700 dark:text-[#D5D2DA]'>
                        <Check className='w-3.5 h-3.5 text-indigo-600 dark:text-[#A99DFF] shrink-0 mt-0.5' />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer Salary */}
                <div className='mt-6 pt-4 border-t border-gray-200/60 dark:border-white/5 flex items-center justify-between text-xs'>
                  <span className='text-gray-400 flex items-center gap-1'>
                    <TrendingUp className='w-3.5 h-3.5 text-emerald-500' />
                    Lương trung bình:
                  </span>
                  <span className='font-bold text-gray-900 dark:text-[#ECE9E4] font-mono'>{item.avgSalary}</span>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
