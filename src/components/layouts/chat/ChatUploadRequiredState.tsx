import { FileText, GraduationCap, UploadCloud } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { FaGithub } from 'react-icons/fa'

export default function ChatUploadRequiredState() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const sources = [
    { icon: GraduationCap, label: t('chat.uploadRequired.sourceTranscript') },
    { icon: FaGithub, label: t('chat.uploadRequired.sourceGithub') },
    { icon: FileText, label: t('chat.uploadRequired.sourceCv') },
  ]

  return (
    <div className='flex-1 min-h-0 flex items-center justify-center p-6'>
      <div className='w-full max-w-xl text-center'>
        <div className='w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-sm'>
          <UploadCloud className='w-6 h-6 text-white' />
        </div>

        <h2 className='mt-5 text-xl font-semibold text-gray-900 dark:text-[#ECE9E4]'>
          {t('chat.uploadRequired.title')}
        </h2>
        <p className='mt-2 text-sm text-gray-500 dark:text-[#A29FA8] leading-relaxed max-w-md mx-auto'>
          {t('chat.uploadRequired.desc')}
        </p>

        <button
          type='button'
          onClick={() => navigate('/upload')}
          className='mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 transition cursor-pointer shadow-xs'
        >
          <UploadCloud className='w-4 h-4' />
          {t('chat.uploadRequired.cta')}
        </button>

        <div className='mt-10 flex items-center justify-center gap-3 flex-wrap'>
          {sources.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className='inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/[0.08] bg-gray-50/60 dark:bg-[#1A191C] px-3.5 py-1.5 text-xs font-medium text-gray-600 dark:text-[#ECE9E4] transition-colors'
            >
              <Icon className='w-3.5 h-3.5 text-indigo-600 dark:text-[#A99DFF]' />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
