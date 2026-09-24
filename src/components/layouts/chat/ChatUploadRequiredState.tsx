import { FileText, GraduationCap, UploadCloud } from 'lucide-react'
import { useNavigate } from 'react-router'
import { FaGithub } from 'react-icons/fa'

const SOURCES = [
  { icon: GraduationCap, label: 'Transcript học thuật' },
  { icon: FaGithub, label: 'GitHub profile' },
  { icon: FileText, label: 'CV / Resume' },
]

export default function ChatUploadRequiredState() {
  const navigate = useNavigate()
  return (
    <div className='flex-1 min-h-0 flex items-center justify-center p-6'>
      <div className='w-full max-w-xl text-center'>
        <div className='w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-sm'>
          <UploadCloud className='w-6 h-6 text-white' />
        </div>

        <h2 className='mt-5 text-xl font-semibold text-gray-900'>Chưa có dữ liệu để AI tư vấn</h2>
        <p className='mt-2 text-sm text-gray-500 leading-relaxed max-w-md mx-auto'>
          Hãy upload dữ liệu của bạn để AI phân tích hồ sơ trước khi bắt đầu trò chuyện.
        </p>

        <button
          type='button'
          onClick={() => navigate('/upload')}
          className='mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 transition'
        >
          <UploadCloud className='w-4 h-4' />
          Upload ngay
        </button>

        <div className='mt-10 flex items-center justify-center gap-3 flex-wrap'>
          {SOURCES.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className='inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/60 px-3.5 py-1.5 text-xs font-medium text-gray-600'
            >
              <Icon className='w-3.5 h-3.5 text-indigo-600' />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
