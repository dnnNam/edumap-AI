import { User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import FormInput from '../../components/ui/FormInput'
import FormSelect from '../../components/ui/FormSelect'

import SettingsTabs, { type SettingsTab } from '../../components/ui/SettingTab'
import { useProfileQuery, useUpdateProfileMutation } from '../../hooks/useUserQuery'
import type { UserInfor } from '../../types/api/user.type'
import AppLoadingSkeleton from '../../components/ui/AppLoadingSkeleton'

// ---------- tabs ----------

type TabKey = 'account' | 'appearance' | 'notifications' | 'privacy' | 'danger'

const TABS: SettingsTab<TabKey>[] = [
  { key: 'account', label: 'Account' },
  { key: 'appearance', label: 'Appearance' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'privacy', label: 'Privacy' },
  { key: 'danger', label: 'Danger' },
]

const YEAR_OPTIONS = ['1', '2', '3', '4', '5', '6']

// ---------- page ----------

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('account')

  const { data: profileResponse, isLoading } = useProfileQuery()
  const user = profileResponse?.data?.data
  const updateProfileMutation = useUpdateProfileMutation()

  // Form state — được đồng bộ lại mỗi khi profile load xong / thay đổi
  const [fullName, setFullName] = useState('')
  const [universityName, setUniversityName] = useState('')
  const [currentYear, setCurrentYear] = useState('1')
  const [githubUsername, setGithubUsername] = useState('')

  const [prevUser, setPrevUser] = useState<UserInfor | null>(null)

  if (user && user !== prevUser) {
    setPrevUser(user) // Cập nhật lại user cũ để không bị lặp vô hạn
    setFullName(user.fullName ?? '')
    setUniversityName(user.universityName ?? '')
    setCurrentYear(user.currentYear ? String(user.currentYear) : '1')
    setGithubUsername(user.githubUsername ?? '')
  }

  const handleSave = () => {
    updateProfileMutation.mutate(
      {
        fullName: fullName.trim(),
        universityName: universityName.trim(),
        currentYear: Number(currentYear),
        githubUsername: githubUsername.trim(),
      },
      {
        onSuccess: () => {
          toast.success('Cập nhật thông tin thành công!')
        },
        // onError không cần xử lý riêng — http.ts interceptor đã toast lỗi chung rồi
      },
    )
  }

  if (updateProfileMutation.isPending) {
    return <AppLoadingSkeleton />
  }

  return (
    <div className='flex-1 min-h-0 overflow-y-auto p-6'>
      <div className='max-w-5xl mx-auto'>
        {/* Page header */}
        <h1 className='text-[28px] font-bold text-gray-900'>Settings</h1>
        <p className='mt-1 text-gray-500 text-[15px]'>Manage your account, preferences and privacy.</p>

        {/* Tabs */}
        <SettingsTabs className='mt-6' tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab content */}
        {activeTab === 'account' && (
          <div className='mt-5 bg-white border border-gray-200 rounded-2xl p-6'>
            <h2 className='text-[15px] font-semibold text-gray-900'>Profile</h2>

            {isLoading ? (
              <div className='mt-4 animate-pulse space-y-5'>
                <div className='flex items-center gap-4'>
                  <div className='w-16 h-16 rounded-full bg-gray-100' />
                  <div className='h-8 w-28 rounded-lg bg-gray-100' />
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5'>
                  <div className='h-11 rounded-xl bg-gray-100' />
                  <div className='h-11 rounded-xl bg-gray-100' />
                  <div className='h-11 rounded-xl bg-gray-100' />
                  <div className='h-11 rounded-xl bg-gray-100' />
                </div>
              </div>
            ) : (
              <>
                {/* Avatar */}
                <div className='mt-4 flex items-center gap-4'>
                  <img
                    src='https://i.pravatar.cc/128?img=12'
                    alt={fullName || 'Avatar'}
                    className='w-16 h-16 rounded-full object-cover border border-gray-200'
                  />
                  <div>
                    <button
                      type='button'
                      className='rounded-lg border border-gray-200 text-gray-900 text-sm font-medium px-3.5 py-1.5 hover:bg-gray-50 transition'
                    >
                      Upload new
                    </button>
                    <p className='mt-1.5 text-xs text-gray-400'>PNG or JPG, max 2MB</p>
                  </div>
                </div>

                {/* Form fields */}
                <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5'>
                  <FormInput
                    id='fullName'
                    label='Full name'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <FormInput
                    id='universityName'
                    label='University'
                    value={universityName}
                    onChange={(e) => setUniversityName(e.target.value)}
                  />
                  <FormSelect
                    id='currentYear'
                    label='Current year'
                    options={YEAR_OPTIONS}
                    value={currentYear}
                    onChange={(e) => setCurrentYear(e.target.value)}
                  />
                  <FormInput
                    id='githubUsername'
                    label='GitHub username'
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    // Đã xóa className='sm:col-span-2' ở đây
                  />
                </div>

                {/* Save */}
                <div className='mt-6 flex justify-end'>
                  <button
                    type='button'
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    className='rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white text-[15px] font-medium px-5 py-2.5 transition'
                  >
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab !== 'account' && (
          <div className='mt-5 bg-white border border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center'>
            <div className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center'>
              <UserIcon className='w-5 h-5 text-gray-400' />
            </div>
            <p className='mt-3 text-sm text-gray-500'>
              {TABS.find((t) => t.key === activeTab)?.label} settings coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
