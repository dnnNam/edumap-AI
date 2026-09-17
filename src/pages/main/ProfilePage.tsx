import { Flag, KeyRound, Mail, Pencil } from 'lucide-react'
import { useState } from 'react'
import { FaLinkedin, FaTwitter } from 'react-icons/fa'

import StatCard from '../../components/ui/StatCard'
import ChangePasswordModal from '../../components/ui/Changepasswordmodal'

// ---------- data (swap for real profile/query data later) ----------

const STATS = [
  { value: '87', label: 'Career Score' },
  { value: '24d', label: 'Streak' },
  { value: '15', label: 'Skills mastered' },
  { value: '12,480', label: 'Total XP' },
]

const ACHIEVEMENTS = [
  { emoji: '🚀', label: 'First Steps' },
  { emoji: '🔥', label: 'Week Streak' },
  { emoji: '💻', label: 'Code Ninja' },
  { emoji: '☁️', label: 'Cloud Native' },
  { emoji: '🤖', label: 'AI Explorer' },
  { emoji: '🎓', label: 'Mentor' },
  { emoji: '⭐', label: 'Open Source' },
  { emoji: '🏆', label: 'Interview Ready' },
]

const GOALS = [
  { label: 'Complete LeetCode 50', progress: 73 },
  { label: 'Build an AI chatbot', progress: 33 },
  { label: 'Get AWS certified', progress: 34 },
  { label: 'Contribute to a React lib', progress: 61 },
  { label: 'Learn Kubernetes', progress: 53 },
]

const CERTIFICATES = [
  { letter: 'A', name: 'AWS Solutions Architect', year: '2025' },
  { letter: 'T', name: 'TensorFlow Developer', year: '2024' },
  { letter: 'M', name: 'Meta Frontend Pro', year: '2023' },
  { letter: 'G', name: 'GitHub Foundations', year: '2025' },
]

const SKILLS = [
  { name: 'React', level: 92 },
  { name: 'TypeScript', level: 85 },
  { name: 'Node.js', level: 78 },
  { name: 'System Design', level: 64 },
  { name: 'Python', level: 71 },
  { name: 'Docker', level: 58 },
]

interface ProfileUser {
  name: string
  school: string
  major: string
  year: string
  avatarUrl: string
}

const USER: ProfileUser = {
  name: 'Alex Johnson',
  school: 'MIT',
  major: 'Computer Science',
  year: 'Junior',
  avatarUrl: 'https://i.pravatar.cc/160?img=47',
}

export default function ProfilePage() {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

  return (
    <div className='flex-1 min-h-0 overflow-y-auto p-6'>
      <div className='max-w-5xl mx-auto space-y-6'>
        {/* Header card */}
        <div className='bg-white border border-gray-200 rounded-2xl p-6'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5'>
            <div className='flex items-center gap-4'>
              <img
                src={USER.avatarUrl}
                alt={USER.name}
                className='w-20 h-20 rounded-full object-cover border border-gray-200'
              />
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>{USER.name}</h1>
                <p className='mt-0.5 text-[15px] text-gray-500'>
                  {USER.school} · {USER.major} · {USER.year}
                </p>
                <div className='mt-3 flex items-center gap-2'>
                  <a
                    href='#'
                    aria-label='Report'
                    className='w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition'
                  >
                    <Flag className='w-3.5 h-3.5' />
                  </a>
                  <a
                    href='#'
                    aria-label='Twitter'
                    className='w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition'
                  >
                    <FaTwitter className='w-3.5 h-3.5' />
                  </a>
                  <a
                    href='#'
                    aria-label='LinkedIn'
                    className='w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition'
                  >
                    <FaLinkedin className='w-3.5 h-3.5' />
                  </a>
                  <a
                    href='#'
                    aria-label='Email'
                    className='w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition'
                  >
                    <Mail className='w-3.5 h-3.5' />
                  </a>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2.5 shrink-0'>
              <button
                type='button'
                className='rounded-xl border border-gray-200 text-gray-900 text-sm font-medium px-4 py-2 hover:bg-gray-50 transition'
              >
                View portfolio
              </button>
              <button
                type='button'
                onClick={() => setIsChangePasswordOpen(true)}
                className='flex items-center gap-1.5 rounded-xl border border-gray-200 text-gray-900 text-sm font-medium px-4 py-2 hover:bg-gray-50 transition'
              >
                <KeyRound className='w-3.5 h-3.5' />
                Change password
              </button>
              <button
                type='button'
                className='flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 transition'
              >
                <Pencil className='w-3.5 h-3.5' />
                Edit profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          {STATS.map((stat) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>

        {/* Achievements / Goals / Certificates */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
          <div className='bg-white border border-gray-200 rounded-2xl p-5'>
            <h2 className='flex items-center gap-2 text-[15px] font-semibold text-gray-900'>🏆 Achievements</h2>
            <div className='mt-4 grid grid-cols-4 gap-3'>
              {ACHIEVEMENTS.map((a) => (
                <div
                  key={a.label}
                  className='flex flex-col items-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50 py-3 px-1'
                >
                  <span className='text-xl leading-none'>{a.emoji}</span>
                  <span className='text-[11px] text-gray-600 text-center leading-tight truncate w-full'>{a.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='bg-white border border-gray-200 rounded-2xl p-5'>
            <h2 className='text-[15px] font-semibold text-gray-900'>Current goals</h2>
            <div className='mt-4 space-y-4'>
              {GOALS.map((goal) => (
                <div key={goal.label}>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-gray-700'>{goal.label}</span>
                    <span className='text-gray-500'>{goal.progress}%</span>
                  </div>
                  <div className='mt-1.5 h-1.5 rounded-full bg-gray-100 overflow-hidden'>
                    <div className='h-full rounded-full bg-indigo-600' style={{ width: `${goal.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='bg-white border border-gray-200 rounded-2xl p-5'>
            <h2 className='text-[15px] font-semibold text-gray-900'>Certificates</h2>
            <div className='mt-4 space-y-3'>
              {CERTIFICATES.map((cert) => (
                <div key={cert.name} className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold flex items-center justify-center shrink-0'>
                    {cert.letter}
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm text-gray-900 truncate'>{cert.name}</p>
                    <p className='text-xs text-gray-500'>Issued {cert.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills mastered */}
        <div className='bg-white border border-gray-200 rounded-2xl p-5'>
          <h2 className='text-[15px] font-semibold text-gray-900'>Skills mastered</h2>
          <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4'>
            {SKILLS.map((skill) => (
              <div key={skill.name}>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-700'>{skill.name}</span>
                  <span className='text-gray-500'>{skill.level}%</span>
                </div>
                <div className='mt-1.5 h-1.5 rounded-full bg-gray-100 overflow-hidden'>
                  <div className='h-full rounded-full bg-gray-900' style={{ width: `${skill.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ChangePasswordModal open={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />
    </div>
  )
}
