import { useTranslation } from 'react-i18next'
import { User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import FormInput from '../../components/ui/FormInput'
import FormSelect from '../../components/ui/FormSelect'

import SettingsTabs from '../../components/ui/SettingTab'
import { useProfileQuery, useUpdateProfileMutation } from '../../hooks/useUserQuery'
import type { UserInfor } from '../../types/api/user.type'
import AppLoadingSkeleton from '../../components/ui/AppLoadingSkeleton'
import Avatar from '../../components/ui/Avatar'

// ---------- tabs ----------

type TabKey = 'account' | 'appearance' | 'notifications' | 'privacy' | 'danger'

const TABS: { key: TabKey; labelKey: string }[] = [
  { key: 'account', labelKey: 'settings.tab.account' },
  { key: 'appearance', labelKey: 'settings.tab.appearance' },
  { key: 'notifications', labelKey: 'settings.tab.notifications' },
  { key: 'privacy', labelKey: 'settings.tab.privacy' },
  { key: 'danger', labelKey: 'settings.tab.danger' },
]

const YEAR_OPTIONS = ['1', '2', '3', '4', '5', '6']

// ---------- page ----------

export default function SettingsPage() {
  const { t } = useTranslation()
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
          toast.success(t('settings.updated'))
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
        <h1 className='text-[28px] font-bold text-gray-900 dark:text-[#ECE9E4]'>{t('settings.title')}</h1>
        <p className='mt-1 text-gray-500 dark:text-[#A29FA8] text-[15px]'>{t('settings.subtitle')}</p>

        {/* Tabs */}
        <SettingsTabs
          className='mt-6'
          tabs={TABS.map((tab) => ({ key: tab.key, label: t(tab.labelKey) }))}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Tab content */}
        {activeTab === 'account' && (
          <div className='mt-5 bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-6'>
            <h2 className='text-[15px] font-semibold text-gray-900 dark:text-[#ECE9E4]'>{t('settings.profile')}</h2>

            {isLoading ? (
              <div className='mt-4 animate-pulse space-y-5'>
                <div className='flex items-center gap-4'>
                  <div className='w-16 h-16 rounded-full bg-gray-100 dark:bg-white/10' />
                  <div className='h-8 w-28 rounded-lg bg-gray-100 dark:bg-white/10' />
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5'>
                  <div className='h-11 rounded-xl bg-gray-100 dark:bg-white/10' />
                  <div className='h-11 rounded-xl bg-gray-100 dark:bg-white/10' />
                  <div className='h-11 rounded-xl bg-gray-100 dark:bg-white/10' />
                  <div className='h-11 rounded-xl bg-gray-100 dark:bg-white/10' />
                </div>
              </div>
            ) : (
              <>
                {/* Avatar */}
                <div className='mt-4 flex items-center gap-4'>
                  <Avatar className='w-16 h-16 border border-gray-200 dark:border-white/[0.08]' />
                  <div>
                    <button
                      type='button'
                      className='rounded-lg border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-[#ECE9E4] text-sm font-medium px-3.5 py-1.5 hover:bg-gray-50 dark:hover:bg-[#232227] transition cursor-pointer'
                    >
                      {t('settings.uploadNew')}
                    </button>
                    <p className='mt-1.5 text-xs text-gray-400 dark:text-[#A29FA8]'>{t('settings.avatarHint')}</p>
                  </div>
                </div>

                {/* Form fields */}
                <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5'>
                  <FormInput
                    id='fullName'
                    label={t('settings.fullName')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <FormInput
                    id='universityName'
                    label={t('settings.university')}
                    value={universityName}
                    onChange={(e) => setUniversityName(e.target.value)}
                  />
                  <FormSelect
                    id='currentYear'
                    label={t('settings.currentYear')}
                    options={YEAR_OPTIONS}
                    value={currentYear}
                    onChange={(e) => setCurrentYear(e.target.value)}
                  />
                  <FormInput
                    id='githubUsername'
                    label={t('settings.githubUsername')}
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                  />
                </div>

                {/* Save */}
                <div className='mt-6 flex justify-end'>
                  <button
                    type='button'
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    className='rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-[#5F2CFF] dark:hover:bg-[#4B1FD6] disabled:opacity-70 text-white text-[15px] font-medium px-5 py-2.5 transition cursor-pointer'
                  >
                    {updateProfileMutation.isPending ? t('common.saving') : t('common.save')}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab !== 'account' && (
          <div className='mt-5 bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-10 flex flex-col items-center justify-center text-center'>
            <div className='w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center'>
              <UserIcon className='w-5 h-5 text-gray-400 dark:text-[#A29FA8]' />
            </div>
            <p className='mt-3 text-sm text-gray-500 dark:text-[#A29FA8]'>
              {t('settings.comingSoon', { tab: t(TABS.find((x) => x.key === activeTab)?.labelKey ?? '') })}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
