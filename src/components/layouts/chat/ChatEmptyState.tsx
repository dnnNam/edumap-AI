import { Brain, GitBranch, MessageSquare, Sparkles, Target } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function ChatEmptyState({ onNewChat }: { onNewChat: () => void }) {
  const { t } = useTranslation()

  const highlights = [
    { icon: Brain, title: t('chat.empty.h1Title'), description: t('chat.empty.h1Desc') },
    { icon: GitBranch, title: t('chat.empty.h2Title'), description: t('chat.empty.h2Desc') },
    { icon: Target, title: t('chat.empty.h3Title'), description: t('chat.empty.h3Desc') },
  ]

  return (
    <div className='flex-1 min-h-0 flex items-center justify-center p-6 bg-white dark:bg-[#1A191C] transition-colors'>
      <div className='w-full max-w-xl text-center'>
        <div className='w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-sm'>
          <MessageSquare className='w-6 h-6 text-white' />
        </div>

        <h2 className='mt-5 text-xl font-semibold text-gray-900 dark:text-[#ECE9E4]'>{t('chat.empty.title')}</h2>
        <p className='mt-2 text-sm text-gray-500 dark:text-[#B5B1BA] leading-relaxed'>{t('chat.empty.desc')}</p>

        <button
          type='button'
          onClick={onNewChat}
          className='mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 transition cursor-pointer shadow-xs'
        >
          <Sparkles className='w-4 h-4' />
          {t('chat.empty.cta')}
        </button>

        <div className='mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left'>
          {highlights.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className='rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50/60 dark:bg-white/5 p-4 transition-colors'
            >
              <div className='w-8 h-8 rounded-lg bg-white dark:bg-[#232227] border border-gray-200 dark:border-white/10 flex items-center justify-center'>
                <Icon className='w-4 h-4 text-indigo-600 dark:text-[#A99DFF]' />
              </div>
              <p className='mt-3 text-sm font-medium text-gray-900 dark:text-[#ECE9E4]'>{title}</p>
              <p className='mt-1 text-xs text-gray-500 dark:text-[#A29FA8] leading-relaxed'>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
