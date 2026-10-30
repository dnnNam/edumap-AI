import { motion } from 'framer-motion'
import { Star, Quote, Award } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Nguyễn Đức Huy',
    role: 'Sinh viên năm 4 ĐH Bách Khoa TP.HCM',
    company: 'Backend Intern @ Shopee',
    quote:
      'Trước khi dùng EduMap AI, mình học rất lan man giữa Nodejs, Java và Python. Nhờ tính năng phân tích repo GitHub, hệ thống chỉ rõ mình thiếu Redis và Microservices. Mình bổ sung trong 2 tháng và vượt qua vòng phỏng vấn Shopee thành công!',
    highlight: 'Trúng tuyển Shopee sau 2 tháng theo lộ trình',
    rating: 5,
    avatar: 'H',
    accentColor: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Trần Mai Linh',
    role: 'Cựu sinh viên ĐH Công Nghệ - ĐHQGHN',
    company: 'AI Research Engineer @ FPT Software',
    quote:
      'Đồ thị kỹ năng (DAG) của EduMap AI thực sự vượt trội. Nó không chỉ liệt kê từ khóa mà hướng dẫn cụ thể từ toán giải tích cho Deep Learning đến pipeline RAG thực chiến với LangChain. Cực kỳ khuyến khích các bạn theo ngành AI trải nghiệm!',
    highlight: 'Tiết kiệm 6 tháng tự mày mò tài liệu',
    rating: 5,
    avatar: 'L',
    accentColor: 'from-purple-500 to-pink-600',
  },
  {
    name: 'ThS. Lê Hoàng Nam',
    role: 'Giảng viên CNTT & Senior Solution Architect',
    company: 'Cố vấn hướng nghiệp EduMap',
    quote:
      'Khoảng cách giữa giáo trình đại học và yêu cầu doanh nghiệp luôn là trăn trở lớn. EduMap AI giải quyết bài toán này nhờ cơ chế quét dữ liệu việc làm thực tế thời gian thực. Sinh viên của tôi định hướng rõ ràng và tự tin hơn rất nhiều.',
    highlight: 'Giải pháp cầu nối đại học - doanh nghiệp xuất sắc',
    rating: 5,
    avatar: 'N',
    accentColor: 'from-emerald-500 to-teal-600',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: 'easeOut' as const,
    },
  },
}

export default function LandingTestimonialsSection() {
  return (
    <section
      id='testimonials'
      className='py-20 sm:py-28 relative z-10 overflow-hidden bg-white dark:bg-[#15141A] border-t border-gray-200/80 dark:border-white/5 transition-colors'
    >
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center max-w-2xl mx-auto mb-14 sm:mb-18'>
          <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-xs font-bold text-amber-700 dark:text-amber-400 mb-3'>
            <Award className='w-3.5 h-3.5' />
            TIẾNG NÓI TỪ CỘNG ĐỒNG CÔNG NGHỆ
          </div>
          <h2 className='text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
            Được Tin Dùng Bởi Hơn 10,000+ Sinh Viên & Giảng Viên IT
          </h2>
          <p className='mt-3 text-sm sm:text-base text-gray-500 dark:text-[#B5B1BA]'>
            Lắng nghe câu chuyện thực tế từ những bạn trẻ đã bứt phá sự nghiệp và các chuyên gia đầu ngành.
          </p>
        </div>

        {/* Testimonials Cards trượt mượt mà vào tiêu điểm khi cuộn vào viewport */}
        <motion.div
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.15 }}
          className='grid grid-cols-1 md:grid-cols-3 gap-6'
        >
          {TESTIMONIALS.map((item) => (
            <motion.div
              key={item.name}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className='rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-gray-50/50 dark:bg-[#1A1824] p-7 shadow-xs hover:shadow-xl hover:border-indigo-400/80 dark:hover:border-indigo-500/40 transition-all flex flex-col justify-between group'
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-1 text-amber-400'>
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className='w-4 h-4 fill-amber-400' />
                    ))}
                  </div>
                  <Quote className='w-7 h-7 text-indigo-200 dark:text-indigo-900/50' />
                </div>

                <div className='inline-block text-[11px] font-bold text-indigo-600 dark:text-[#A99DFF] bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full mb-3'>
                  ✨ {item.highlight}
                </div>

                <p className='text-sm text-gray-700 dark:text-[#ECE9E4] leading-relaxed italic'>"{item.quote}"</p>
              </div>

              {/* Author Footer */}
              <div className='mt-6 pt-5 border-t border-gray-200/60 dark:border-white/5 flex items-center gap-3'>
                <div
                  className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${item.accentColor} text-white font-bold flex items-center justify-center text-sm shadow-sm`}
                >
                  {item.avatar}
                </div>
                <div>
                  <h4 className='font-bold text-gray-900 dark:text-[#ECE9E4] text-sm'>{item.name}</h4>
                  <p className='text-[11px] text-gray-500 dark:text-[#A29FA8] font-medium'>{item.role}</p>
                  <p className='text-[10px] text-indigo-600 dark:text-[#A99DFF] font-semibold'>{item.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
