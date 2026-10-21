import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Sparkles, Flame, ExternalLink, Building2, MapPin } from 'lucide-react'

interface FlashJobItem {
  id: string
  title: string
  company: string
  location: string
  salary: string
  originalSalary?: string
  appliedCount: number
  totalSlots: number
  tags: string[]
  applyUrl: string
  badgeText: string
}

const FLASH_JOBS: FlashJobItem[] = [
  {
    id: 'fj-1',
    title: 'Senior Backend Developer (NestJS & Go)',
    company: 'Viettel Digital Solutions',
    location: 'Hồ Chí Minh',
    salary: '35.000.000đ - 55.000.000đ',
    originalSalary: '28.000.000đ',
    appliedCount: 8,
    totalSlots: 10,
    tags: ['NestJS', 'Golang', 'PostgreSQL', 'Docker'],
    applyUrl: 'https://itviec.com/it-jobs/ho-chi-minh-hcm?query=Backend%20Developer',
    badgeText: '🔥 Tuyển gấp trong 24h',
  },
  {
    id: 'fj-2',
    title: 'Frontend React / Next.js Engineer',
    company: 'VNG Corporation',
    location: 'Hồ Chí Minh',
    salary: '25.000.000đ - 42.000.000đ',
    originalSalary: '20.000.000đ',
    appliedCount: 6,
    totalSlots: 8,
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
    applyUrl: 'https://itviec.com/it-jobs/ho-chi-minh-hcm?query=Frontend%20Developer',
    badgeText: '⭐ Đãi ngộ khủng',
  },
  {
    id: 'fj-3',
    title: 'AI / Machine Learning Engineer',
    company: 'MoMo Fintech Innovation',
    location: 'Hồ Chí Minh',
    salary: '40.000.000đ - 65.000.000đ',
    originalSalary: '32.000.000đ',
    appliedCount: 4,
    totalSlots: 5,
    tags: ['Python', 'PyTorch', 'FastAPI', 'LLM / RAG'],
    applyUrl: 'https://itviec.com/it-jobs/ho-chi-minh-hcm?query=AI%20Engineer',
    badgeText: '🚀 Dự án trọng điểm',
  },
  {
    id: 'fj-4',
    title: 'DevOps & Cloud Infrastructure Engineer',
    company: 'FPT Software Global',
    location: 'Hồ Chí Minh',
    salary: '30.000.000đ - 50.000.000đ',
    originalSalary: '24.000.000đ',
    appliedCount: 7,
    totalSlots: 10,
    tags: ['AWS', 'Kubernetes', 'CI/CD', 'Terraform'],
    applyUrl: 'https://itviec.com/it-jobs/ho-chi-minh-hcm?query=DevOps',
    badgeText: '🔥 Cơ hội Onsite',
  },
  {
    id: 'fj-5',
    title: 'Fullstack Software Engineer',
    company: 'KMS Technology',
    location: 'Hồ Chí Minh',
    salary: '28.000.000đ - 45.000.000đ',
    originalSalary: '22.000.000đ',
    appliedCount: 9,
    totalSlots: 10,
    tags: ['TypeScript', 'Node.js', 'React', 'MongoDB'],
    applyUrl: 'https://itviec.com/it-jobs/ho-chi-minh-hcm?query=Fullstack',
    badgeText: '⚡ Sắp hết suất',
  },
]

export default function JobFlashSaleCarousel() {
  const [activeSession, setActiveSession] = useState<'today' | 'tomorrow'>('today')
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '11',
    minutes: '38',
    seconds: '22',
  })

  const sliderRef = useRef<HTMLDivElement>(null)

  // Đồng hồ đếm ngược chạy tích tắc theo thời gian thực
  useEffect(() => {
    // Đếm ngược tới 23:59:59 của ngày hôm nay
    const calculateTime = () => {
      const now = new Date()
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)

      const diff = Math.max(0, endOfDay.getTime() - now.getTime())
      const totalSeconds = Math.floor(diff / 1000)

      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      setTimeLeft({
        days: '00',
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      })
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Cuộn trái / phải
  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 320
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className='my-8 relative rounded-3xl overflow-hidden shadow-2xl border border-red-500/20 dark:border-red-500/30'>
      {/* 1. Header Khối FlashSale với đường cong nổi bật */}
      <div className='bg-gradient-to-r from-red-600 via-rose-600 to-red-700 dark:from-red-900 dark:via-rose-950 dark:to-red-950 pt-5 pb-4 px-4 sm:px-6 relative'>
        {/* Nút mào cong vát trên đầu (Header Tab) */}
        <div className='flex justify-center -mt-8 mb-3'>
          <div className='px-6 py-2 rounded-t-2xl bg-gradient-to-r from-red-700 to-rose-700 text-white font-black text-sm uppercase tracking-wider shadow-md flex items-center gap-2 border-t border-x border-red-400/40'>
            <Flame className='w-4 h-4 text-amber-300 animate-pulse' />
            <span>FLASHSALE VIỆC LÀM IT 24H</span>
            <Sparkles className='w-4 h-4 text-amber-300' />
          </div>
        </div>

        {/* Thanh điều khiển: Phiên giờ + Đồng hồ đếm ngược */}
        <div className='flex flex-wrap items-center justify-between gap-4'>
          {/* Tabs Khung giờ */}
          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={() => setActiveSession('today')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeSession === 'today'
                  ? 'bg-white text-red-600 shadow-md'
                  : 'bg-red-700/60 text-white/90 hover:bg-red-700'
              }`}
            >
              20-22h Hôm nay
            </button>
            <button
              type='button'
              onClick={() => setActiveSession('tomorrow')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeSession === 'tomorrow'
                  ? 'bg-white text-red-600 shadow-md'
                  : 'bg-red-700/60 text-white/90 hover:bg-red-700'
              }`}
            >
              20-22h Ngày mai
            </button>
          </div>

          {/* Bộ đếm ngược Countdown Timer */}
          <div className='flex items-center gap-2 text-white'>
            <span className='text-xs font-bold uppercase tracking-wider text-amber-200'>KẾT THÚC SAU</span>
            <div className='flex items-center gap-1 font-mono text-sm font-black'>
              <span className='px-2 py-1 rounded-lg bg-black/80 text-white shadow-inner'>{timeLeft.hours}</span>
              <span className='text-amber-300'>:</span>
              <span className='px-2 py-1 rounded-lg bg-black/80 text-white shadow-inner'>{timeLeft.minutes}</span>
              <span className='text-amber-300'>:</span>
              <span className='px-2 py-1 rounded-lg bg-black/80 text-white shadow-inner'>{timeLeft.seconds}</span>
            </div>
            <span className='text-amber-300 font-bold'>%</span>
          </div>
        </div>
      </div>

      {/* 2. Thân Khối: Carousel thẻ việc làm màu đỏ đun sang trọng */}
      <div className='bg-gradient-to-b from-red-600 to-rose-700 dark:from-[#380E14] dark:to-[#22080C] p-4 sm:p-6 relative'>
        {/* Nút điều hướng Trái */}
        <button
          type='button'
          onClick={() => scroll('left')}
          aria-label='Xem việc làm trước'
          className='absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-gray-900 shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer border border-gray-200'
        >
          <ChevronLeft className='w-5 h-5' />
        </button>

        {/* Nút điều hướng Phải */}
        <button
          type='button'
          onClick={() => scroll('right')}
          aria-label='Xem việc làm tiếp theo'
          className='absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-gray-900 shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer border border-gray-200'
        >
          <ChevronRight className='w-5 h-5' />
        </button>

        {/* Danh sách thẻ cuộn ngang */}
        <div
          ref={sliderRef}
          className='flex items-stretch gap-4 overflow-x-auto scrollbar-none px-4 py-2 scroll-smooth'
        >
          {FLASH_JOBS.map((job) => {
            const percentSold = Math.round((job.appliedCount / job.totalSlots) * 100)
            return (
              <div
                key={job.id}
                className='shrink-0 w-[270px] sm:w-[290px] rounded-2xl bg-white dark:bg-[#1E1922] p-4 flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 border border-white/20 dark:border-white/10'
              >
                <div>
                  {/* Badge Hot */}
                  <div className='flex items-center justify-between gap-2 mb-2.5'>
                    <span className='px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[11px] font-bold border border-red-200/60 dark:border-red-900/60'>
                      {job.badgeText}
                    </span>
                    <span className='flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400'>
                      <MapPin className='w-3 h-3 text-red-500' />
                      {job.location}
                    </span>
                  </div>

                  {/* Tiêu đề & Công ty */}
                  <h3 className='text-sm font-bold text-gray-900 dark:text-[#ECE9E4] line-clamp-2 leading-snug'>
                    {job.title}
                  </h3>
                  <div className='mt-1 flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 font-medium truncate'>
                    <Building2 className='w-3.5 h-3.5 shrink-0 text-gray-400' />
                    <span className='truncate'>{job.company}</span>
                  </div>

                  {/* Kỹ năng Tags */}
                  <div className='mt-2.5 flex flex-wrap gap-1'>
                    {job.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className='px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-[10px] font-medium text-gray-600 dark:text-gray-300'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Mức lương nổi bật */}
                  <div className='mt-3'>
                    <div className='text-sm sm:text-base font-black text-red-600 dark:text-red-400 tracking-tight'>
                      {job.salary}
                    </div>
                    {job.originalSalary && (
                      <div className='text-[11px] text-gray-400 line-through'>Thị trường từ: {job.originalSalary}</div>
                    )}
                  </div>
                </div>

                {/* Phần dưới: Thanh tiến độ "Đã ứng tuyển X/Y suất" + Nút bấm */}
                <div className='mt-3 pt-2.5 border-t border-gray-100 dark:border-white/5'>
                  {/* Thanh tiến độ */}
                  <div className='relative w-full h-4 rounded-full bg-red-100 dark:bg-red-950/50 overflow-hidden flex items-center justify-center mb-2.5'>
                    <div
                      className='absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-500 to-rose-600 rounded-full transition-all duration-500'
                      style={{ width: `${percentSold}%` }}
                    />
                    <span className='relative z-10 text-[10px] font-bold text-white drop-shadow-sm flex items-center gap-1'>
                      <Flame className='w-3 h-3 text-amber-300' />
                      Đã ứng tuyển {job.appliedCount}/{job.totalSlots} suất
                    </span>
                  </div>

                  {/* Nút Ứng tuyển */}
                  <a
                    href={job.applyUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-full py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-red-500/25 flex items-center justify-center gap-1.5 transition active:scale-95'
                  >
                    <span>Ứng tuyển ngay</span>
                    <ExternalLink className='w-3 h-3' />
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* Ghi chú chân trang */}
        <p className='mt-3 text-center text-[11px] text-white/80 font-medium'>
          Ưu tiên ứng viên có chứng chỉ kỹ năng EduMap AI — Hỗ trợ kết nối trực tiếp với nhà tuyển dụng đối tác.
        </p>
      </div>
    </div>
  )
}
