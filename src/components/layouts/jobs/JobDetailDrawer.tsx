import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Building2,
  MapPin,
  Banknote,
  Clock,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Gift,
  ListChecks,
  GraduationCap,
  ArrowRight,
  Globe,
} from 'lucide-react'
import { Link } from 'react-router'
import type { SampleJob } from '../../../types/api/job.types'
import { AnimatedZap, AnimatedSparkles } from '../../ui/AnimatedIcons'

const VERIFIED_COMPANY_CAREERS: Record<string, string> = {
  momo: 'https://momo.careers/',
  'ví momo': 'https://momo.careers/',
  m_service: 'https://momo.careers/',
  vng: 'https://itviec.com/companies/vng-corporation',
  'vng corporation': 'https://itviec.com/companies/vng-corporation',
  fpt: 'https://itviec.com/companies/fpt-software',
  'fpt software': 'https://itviec.com/companies/fpt-software',
  'fpt telecom': 'https://tuyendung.fpt.vn/',
  'fpt is': 'https://tuyendung.fpt.vn/',
  viettel: 'https://tuyendung.viettel.vn/',
  vnpt: 'https://tuyendung.vnpt.vn/',
  shopee: 'https://careers.shopee.vn/',
  zalo: 'https://careers.zalo.me/',
  tiki: 'https://tuyendung.tiki.vn/',
  'one mount': 'https://careers.onemount.com/',
  onemount: 'https://careers.onemount.com/',
  techcombank: 'https://www.techcombankjobs.com/',
  vpbank: 'https://tuyendung.vpbank.com.vn/',
  mbbank: 'https://tuyendung.mbbank.com.vn/',
  mb: 'https://tuyendung.mbbank.com.vn/',
  grab: 'https://careers.grab.com/',
  vinai: 'https://www.vinai.io/careers/',
  vnpay: 'https://vnpay.vn/tuyen-dung/',
}

function sanitizeUrl(url: string): string {
  if (url.includes('fptsoftware.com')) return 'https://itviec.com/companies/fpt-software'
  if (url.includes('careers.vng.com.vn')) return 'https://itviec.com/companies/vng-corporation'
  if (url.includes('momo.vn')) return 'https://momo.careers/'
  return url
}

function resolveApplyUrl(job: SampleJob): string {
  const normCompany = (job.company || '').toLowerCase().trim()

  for (const [key, verifiedUrl] of Object.entries(VERIFIED_COMPANY_CAREERS)) {
    if (normCompany.includes(key)) {
      return verifiedUrl
    }
  }

  const rawUrl = job.applyUrl || job.careerUrl
  if (rawUrl) {
    return sanitizeUrl(rawUrl)
  }

  const cleanCompany = (job.company || '').replace(/\([^)]*\)/g, '').trim() || job.company
  return `https://itviec.com/it-jobs?query=${encodeURIComponent(`${cleanCompany} ${job.title}`)}`
}

interface JobDetailDrawerProps {
  job: SampleJob | null
  isOpen: boolean
  onClose: () => void
}

export default function JobDetailDrawer({ job, isOpen, onClose }: JobDetailDrawerProps) {
  // Khoá cuộn trang nền khi Drawer đang mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Lắng nghe phím ESC để đóng nhanh
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!job) return null

  const matchScore = job.matchScore ?? 88
  const matchedSkills = job.matchedSkills ?? job.requirements?.slice(0, 3) ?? []
  const missingSkills = job.missingSkills ?? []
  const cleanCompany = (job.company || '').replace(/\([^)]*\)/g, '').trim() || job.company
  const primaryApplyUrl = resolveApplyUrl(job)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-50 flex justify-end select-none'>
          {/* Backdrop mờ phía sau */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className='fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity'
          />

          {/* Slide-over Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className='relative z-50 flex h-full w-full max-w-2xl flex-col bg-white dark:bg-[#161426] border-l border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden'
          >
            {/* Header */}
            <div className='relative px-6 py-5 border-b border-gray-200/80 dark:border-white/10 bg-gray-50/80 dark:bg-[#1A191C]/80 backdrop-blur-md'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex items-start gap-3.5 min-w-0'>
                  {/* Logo hoặc Avatar ký tự công ty */}
                  <div className='w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-center shrink-0 shadow-sm overflow-hidden'>
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={cleanCompany} className='w-full h-full object-contain p-1.5' />
                    ) : (
                      <Building2 className='w-6 h-6 text-indigo-600 dark:text-[#A99DFF]' />
                    )}
                  </div>

                  <div className='min-w-0'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-snug truncate'>
                        {job.title}
                      </h3>
                    </div>
                    <p className='text-sm font-semibold text-indigo-600 dark:text-[#A99DFF] mt-0.5 truncate'>
                      {cleanCompany}
                    </p>
                  </div>
                </div>

                {/* Nút đóng */}
                <button
                  type='button'
                  onClick={onClose}
                  className='p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-white/10 transition cursor-pointer'
                  title='Đóng (Esc)'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>

              {/* Match Badge & Live Tags */}
              <div className='mt-4 flex flex-wrap items-center gap-2'>
                <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-black shadow-xs'>
                  <AnimatedZap className='w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400' />
                  <span>{matchScore}% Match với hồ sơ của bạn</span>
                </span>

                <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/40 text-indigo-700 dark:text-[#A99DFF] text-xs font-medium'>
                  <Briefcase className='w-3 h-3' />
                  <span>{job.jobType || 'Full-time'}</span>
                </span>

                {job.experienceLevel && (
                  <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-medium'>
                    <Clock className='w-3 h-3' />
                    <span>{job.experienceLevel}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Nội dung cuộn (Scrollable Body) */}
            <div className='flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin select-text'>
              {/* Thẻ tóm tắt thông số quan trọng */}
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-[#1A191C] border border-gray-200/80 dark:border-white/5'>
                <div className='flex items-center gap-2.5'>
                  <div className='w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0'>
                    <Banknote className='w-4 h-4' />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-[11px] text-gray-500 dark:text-gray-400'>Mức lương</p>
                    <p className='text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate'>{job.salary}</p>
                  </div>
                </div>

                <div className='flex items-center gap-2.5'>
                  <div className='w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-[#A99DFF] flex items-center justify-center shrink-0'>
                    <MapPin className='w-4 h-4' />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-[11px] text-gray-500 dark:text-gray-400'>Địa điểm</p>
                    <p className='text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate'>
                      {job.location}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-2.5'>
                  <div className='w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0'>
                    <Clock className='w-4 h-4' />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-[11px] text-gray-500 dark:text-gray-400'>Thời gian đăng</p>
                    <p className='text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate'>
                      {job.postedAt || 'Mới cập nhật'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 🤖 KHỐI ĐỐI SOÁT KỸ NĂNG AI ĐỘC QUYỀN (Skill Match Radar) */}
              <div className='rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 dark:from-indigo-950/30 dark:via-[#1A191C] dark:to-purple-950/20 p-5 shadow-xs'>
                <div className='flex items-center justify-between gap-2 mb-3'>
                  <div className='flex items-center gap-2'>
                    <Sparkles className='w-4.5 h-4.5 text-indigo-600 dark:text-[#A99DFF]' />
                    <h4 className='text-sm font-bold text-gray-900 dark:text-white'>
                      Đối soát kỹ năng thực chiến (EduMap AI Radar)
                    </h4>
                  </div>
                  <span className='text-xs font-black text-indigo-700 dark:text-[#A99DFF]'>{matchScore}% Phù hợp</span>
                </div>

                {/* Thanh tiến độ */}
                <div className='w-full h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden mb-4'>
                  <div
                    className='h-full rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 transition-all duration-700'
                    style={{ width: `${matchScore}%` }}
                  />
                </div>

                {/* Kỹ năng bạn đã đạt */}
                {matchedSkills.length > 0 && (
                  <div className='mb-3'>
                    <p className='text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-2'>
                      <CheckCircle2 className='w-3.5 h-3.5' />
                      <span>Kỹ năng bạn đã sở hữu ({matchedSkills.length}):</span>
                    </p>
                    <div className='flex flex-wrap gap-1.5'>
                      {matchedSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className='inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-800/50 text-xs font-medium text-emerald-800 dark:text-emerald-300'
                        >
                          <CheckCircle2 className='w-3 h-3 text-emerald-600 dark:text-emerald-400' />
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Kỹ năng bạn cần bổ sung */}
                {missingSkills.length > 0 && (
                  <div className='pt-2 border-t border-indigo-100 dark:border-white/5'>
                    <p className='text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-2'>
                      <AlertTriangle className='w-3.5 h-3.5' />
                      <span>Kỹ năng nên bổ sung để đạt 100% ({missingSkills.length}):</span>
                    </p>
                    <div className='flex flex-wrap gap-1.5'>
                      {missingSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className='inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-xs font-medium text-amber-800 dark:text-amber-300'
                        >
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>

                    {/* Nút giữ chân user học tiếp trên SkillTree */}
                    <div className='mt-3.5 pt-3 border-t border-dashed border-indigo-200 dark:border-white/10 flex items-center justify-between gap-3'>
                      <span className='text-[11px] text-gray-500 dark:text-gray-400'>
                        Học bổ sung kỹ năng còn thiếu trên cây kỹ năng EduMap
                      </span>
                      <Link
                        to='/skills'
                        onClick={onClose}
                        className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs shrink-0 group'
                      >
                        <GraduationCap className='w-3.5 h-3.5' />
                        <span>Học trên SkillTree</span>
                        <ArrowRight className='w-3 h-3 group-hover:translate-x-0.5 transition-transform' />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 📋 MÔ TẢ CÔNG VIỆC TỔNG QUAN */}
              <div>
                <h4 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2.5'>
                  <Briefcase className='w-4 h-4 text-indigo-600 dark:text-[#A99DFF]' />
                  <span>Mô tả công việc (Job Description)</span>
                </h4>
                <p className='text-sm leading-relaxed text-gray-600 dark:text-[#B5B1BA]'>{job.description}</p>
              </div>

              {/* 🎯 TRÁCH NHIỆM CHÍNH (RESPONSIBILITIES) */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div>
                  <h4 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2.5'>
                    <ListChecks className='w-4 h-4 text-indigo-600 dark:text-[#A99DFF]' />
                    <span>Trách nhiệm chính của bạn</span>
                  </h4>
                  <ul className='space-y-2 text-sm text-gray-600 dark:text-[#B5B1BA]'>
                    {job.responsibilities.map((item, idx) => (
                      <li key={idx} className='flex items-start gap-2.5'>
                        <span className='w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0' />
                        <span className='leading-relaxed'>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 🎯 YÊU CẦU ỨNG VIÊN (REQUIREMENTS) */}
              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h4 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2.5'>
                    <ShieldCheck className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
                    <span>Yêu cầu ứng viên (Requirements)</span>
                  </h4>
                  <ul className='space-y-2 text-sm text-gray-600 dark:text-[#B5B1BA]'>
                    {job.requirements.map((item, idx) => (
                      <li key={idx} className='flex items-start gap-2.5'>
                        <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0' />
                        <span className='leading-relaxed'>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 🎁 CHẾ ĐỘ ĐÃI NGỘ & PHÚC LỢI (BENEFITS) */}
              {job.benefits && job.benefits.length > 0 && (
                <div>
                  <h4 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2.5'>
                    <Gift className='w-4 h-4 text-purple-600 dark:text-purple-400' />
                    <span>Chế độ đãi ngộ & Phúc lợi</span>
                  </h4>
                  <ul className='space-y-2 text-sm text-gray-600 dark:text-[#B5B1BA]'>
                    {job.benefits.map((item, idx) => (
                      <li key={idx} className='flex items-start gap-2.5'>
                        <span className='w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0' />
                        <span className='leading-relaxed'>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 🌐 CÁC KÊNH ĐỐI SOÁT & ỨNG TUYỂN DỰ PHÒNG */}
              {job.links && job.links.length > 0 && (
                <div className='p-4 rounded-2xl border border-gray-200/80 dark:border-white/10 bg-gray-50/70 dark:bg-white/[0.02]'>
                  <h4 className='text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5 flex items-center gap-1.5'>
                    <Globe className='w-3.5 h-3.5 text-indigo-500' />
                    <span>Tìm bài đăng liên quan trên các nền tảng khác</span>
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {job.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={sanitizeUrl(link.url)}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1f1e24] text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-[#A99DFF] hover:border-indigo-300 dark:hover:border-indigo-500/40 transition'
                      >
                        <span>{link.platform}</span>
                        <ExternalLink className='w-3 h-3 text-gray-400' />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* STICKY FOOTER (Duy nhất 1 nút nộp đơn chính thức) */}
            <div className='p-5 border-t border-gray-200/80 dark:border-white/10 bg-gray-50/90 dark:bg-[#1A191C]/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3'>
              <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
                <ShieldCheck className='w-4 h-4 text-emerald-500 shrink-0' />
                <span>Nộp trực tiếp đến cổng tuyển dụng chính thức của {cleanCompany}</span>
              </div>

              <a
                href={primaryApplyUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 transition cursor-pointer group'
              >
                <AnimatedSparkles className='w-4 h-4 text-amber-300' />
                <span>Ứng tuyển chính thức tại {cleanCompany}</span>
                <ExternalLink className='w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform' />
              </a>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
