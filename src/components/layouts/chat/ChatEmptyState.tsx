import { Brain, GitBranch, MessageSquare, Sparkles, Target } from 'lucide-react'

const HIGHLIGHTS = [
  {
    icon: Brain,
    title: 'Hiểu hồ sơ của bạn',
    description: 'AI đọc transcript, GitHub và CV để nắm rõ năng lực hiện tại.',
  },
  {
    icon: GitBranch,
    title: 'Bám theo skill tree',
    description: 'Mọi lời khuyên đều dựa trên lộ trình kỹ năng bạn đã tạo.',
  },
  {
    icon: Target,
    title: 'Gợi ý bước tiếp theo',
    description: 'Đề xuất dự án, khóa học và kỹ năng nên học kế tiếp.',
  },
]

export default function ChatEmptyState({ onNewChat }: { onNewChat: () => void }) {
  return (
    <div className='flex-1 min-h-0 flex items-center justify-center p-6'>
      <div className='w-full max-w-xl text-center'>
        <div className='w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-sm'>
          <MessageSquare className='w-6 h-6 text-white' />
        </div>

        <h2 className='mt-5 text-xl font-semibold text-gray-900'>Chưa có cuộc trò chuyện nào</h2>
        <p className='mt-2 text-sm text-gray-500 leading-relaxed'>
          Bắt đầu trò chuyện với AI Mentor để nhận tư vấn lộ trình.
        </p>

        <button
          type='button'
          onClick={onNewChat}
          className='mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 transition'
        >
          <Sparkles className='w-4 h-4' />
          Bắt đầu trò chuyện
        </button>

        <div className='mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left'>
          {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
            <div key={title} className='rounded-xl border border-gray-100 bg-gray-50/60 p-4'>
              <div className='w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center'>
                <Icon className='w-4 h-4 text-indigo-600' />
              </div>
              <p className='mt-3 text-sm font-medium text-gray-900'>{title}</p>
              <p className='mt-1 text-xs text-gray-500 leading-relaxed'>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
