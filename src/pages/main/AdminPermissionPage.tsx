import { useTranslation } from 'react-i18next'
import { getLocale } from '../../utils/locale'
import { useMemo, useState } from 'react'
import { Shield, UserPlus, Search, ChevronDown, MoreHorizontal } from 'lucide-react'
import { useAllUsersQuery, useUpdateUserRoleMutation } from '../../hooks/useUserQuery'
import { ROLE_BADGE_CLASS, ROLE_OPTIONS, type AdminUser, type UserRole } from '../../types/api/user.type'

type RoleFilter = 'ALL' | UserRole
type Tab = 'users' | 'matrix'

function getInitials(fullName: string) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(getLocale(), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function AdminPermissionsPage() {
  const { t } = useTranslation()
  const { data, isLoading, isError } = useAllUsersQuery()
  const { mutate: updateRole, isPending: isUpdatingRole, variables } = useUpdateUserRoleMutation()

  const [tab, setTab] = useState<Tab>('users')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL')

  const users: AdminUser[] = data?.data.data ?? []

  const counts = useMemo(() => {
    const base: Record<UserRole, number> = { ADMIN: 0, MODERATOR: 0, MENTOR: 0, STUDENT: 0 }
    users.forEach((u) => {
      base[u.role] = (base[u.role] ?? 0) + 1
    })
    return base
  }, [users])

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter((u) => {
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
      const matchesSearch = !q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      return matchesRole && matchesSearch
    })
  }, [users, search, roleFilter])

  return (
    // Trang KHÔNG cuộn nữa (overflow-hidden) — chỉ phần bảng bên trong cuộn riêng.
    // flex-col + min-h-0 để các block phía trên giữ chiều cao tự nhiên,
    // còn block "Users/Permission matrix" chiếm hết phần còn lại (flex-1 min-h-0).
    <div className='flex-1 min-h-0 overflow-hidden p-6 flex flex-col'>
      {/* Header */}
      <div className='shrink-0 flex items-start justify-between gap-4 flex-wrap'>
        <div>
          <div className='flex items-center gap-2'>
            <Shield className='w-6 h-6 text-gray-900 dark:text-[#ECE9E4]' />
            <h1 className='text-2xl font-bold text-gray-900 dark:text-[#ECE9E4] tracking-tight'>
              {t('admin.permissions.title')}
            </h1>
          </div>
          <p className='mt-1.5 text-[15px] text-gray-500 dark:text-[#A29FA8]'>{t('admin.permissions.desc')}</p>
        </div>

        <button
          type='button'
          className='flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm font-medium px-4 py-2.5 cursor-pointer shadow-xs'
        >
          <UserPlus className='w-4 h-4' />
          {t('admin.permissions.invite')}
        </button>
      </div>

      {/* Stat cards theo role */}
      <div className='shrink-0 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {ROLE_OPTIONS.map((role) => (
          <div
            key={role}
            className='bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/[0.08] rounded-xl p-5 transition-colors'
          >
            <p className='text-sm text-gray-500 dark:text-[#A29FA8]'>{t(`roles.${role}`)}</p>
            <p className='mt-1 text-3xl font-bold text-gray-900 dark:text-[#ECE9E4]'>{counts[role]}</p>
            <p className='mt-2 text-[13px] text-gray-500 dark:text-[#A29FA8] leading-relaxed'>
              {t(`roles.desc.${role}`)}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className='shrink-0 mt-6 inline-flex items-center gap-1 bg-gray-100 dark:bg-white/10 rounded-lg p-1 w-fit transition-colors'>
        <button
          type='button'
          onClick={() => setTab('users')}
          className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            tab === 'users'
              ? 'bg-white dark:bg-[#1A191C] text-gray-900 dark:text-[#ECE9E4] shadow-sm'
              : 'text-gray-500 dark:text-[#A29FA8] hover:text-gray-700 dark:hover:text-[#ECE9E4]'
          }`}
        >
          {t('admin.permissions.users')}
        </button>
        <button
          type='button'
          onClick={() => setTab('matrix')}
          className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            tab === 'matrix'
              ? 'bg-white dark:bg-[#1A191C] text-gray-900 dark:text-[#ECE9E4] shadow-sm'
              : 'text-gray-500 dark:text-[#A29FA8] hover:text-gray-700 dark:hover:text-[#ECE9E4]'
          }`}
        >
          {t('admin.permissions.matrix')}
        </button>
      </div>

      {tab === 'matrix' ? (
        <div className='mt-4 bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/[0.08] rounded-xl p-8 text-center text-sm text-gray-500 dark:text-[#A29FA8] transition-colors'>
          {t('admin.permissions.matrixSoon')}
        </div>
      ) : (
        // Khối bảng: chiếm hết phần chiều cao còn lại (flex-1 min-h-0),
        // bản thân nó là flex-col để search/filter đứng yên, còn vùng cuộn
        // (div overflow-y-auto phía dưới) tự co giãn theo không gian còn lại.
        <div className='mt-4 min-h-0 flex-1 flex flex-col bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/[0.08] rounded-xl overflow-hidden transition-colors'>
          {/* Search + filter */}
          <div className='shrink-0 flex items-center gap-3 p-4 border-b border-gray-100 dark:border-white/[0.08] flex-wrap transition-colors'>
            <div className='flex-1 min-w-[220px] flex items-center gap-2 h-10 rounded-lg bg-gray-50 dark:bg-[#232227] border border-gray-200 dark:border-white/[0.08] px-3 text-gray-400 dark:text-[#A29FA8] focus-within:border-gray-300 dark:focus-within:border-white/20 transition-colors'>
              <Search className='w-4 h-4 shrink-0' />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type='text'
                placeholder={t('admin.permissions.search')}
                className='bg-transparent outline-none text-sm text-gray-700 dark:text-[#ECE9E4] placeholder:text-gray-400 dark:placeholder:text-[#A29FA8]/60 w-full'
              />
            </div>

            <div className='relative'>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
                className='appearance-none h-10 rounded-lg border border-gray-200 dark:border-white/[0.08] pl-3.5 pr-9 text-sm text-gray-700 dark:text-[#ECE9E4] outline-none focus:border-gray-300 dark:focus:border-white/20 bg-white dark:bg-[#232227] transition-colors cursor-pointer'
              >
                <option value='ALL'>{t('admin.permissions.allRoles')}</option>
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {t(`roles.${role}`)}
                  </option>
                ))}
              </select>
              <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
            </div>
          </div>

          {/* Table — vùng cuộn thật sự: flex-1 min-h-0 overflow-y-auto */}
          <div className='flex-1 min-h-0 overflow-y-auto'>
            <table className='w-full text-left'>
              <thead className='sticky top-0 z-10 bg-white dark:bg-[#1A191C] transition-colors'>
                <tr className='text-xs text-gray-500 dark:text-[#A29FA8] border-b border-gray-100 dark:border-white/[0.08]'>
                  <th className='py-3 px-4 font-medium'>{t('admin.permissions.cols.user')}</th>
                  <th className='py-3 px-4 font-medium'>{t('admin.permissions.cols.role')}</th>
                  <th className='py-3 px-4 font-medium'>{t('admin.permissions.cols.subscription')}</th>
                  <th className='py-3 px-4 font-medium'>{t('admin.permissions.cols.joined')}</th>
                  <th className='py-3 px-4 font-medium w-10' />
                </tr>
              </thead>
              <tbody>
                {isLoading &&
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className='border-b border-gray-50 dark:border-white/[0.04]'>
                      <td className='py-4 px-4' colSpan={5}>
                        <div className='h-4 w-full max-w-xs rounded bg-gray-100 dark:bg-white/10 animate-pulse' />
                      </td>
                    </tr>
                  ))}

                {!isLoading && isError && (
                  <tr>
                    <td colSpan={5} className='py-8 px-4 text-center text-sm text-gray-500 dark:text-[#A29FA8]'>
                      {t('admin.permissions.loadError')}
                    </td>
                  </tr>
                )}

                {!isLoading && !isError && filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className='py-8 px-4 text-center text-sm text-gray-500 dark:text-[#A29FA8]'>
                      {t('admin.permissions.notFound')}
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !isError &&
                  filteredUsers.map((u) => {
                    const isRowUpdating = isUpdatingRole && variables?.userId === u.id
                    return (
                      <tr
                        key={u.id}
                        className='border-b border-gray-50 dark:border-white/[0.04] hover:bg-gray-50/60 dark:hover:bg-white/[0.03] transition-colors'
                      >
                        <td className='py-3.5 px-4'>
                          <div className='flex items-center gap-3'>
                            <div
                              className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold border ${ROLE_BADGE_CLASS[u.role]}`}
                            >
                              {getInitials(u.fullName)}
                            </div>
                            <div className='min-w-0'>
                              <p className='text-sm font-medium text-gray-900 dark:text-[#ECE9E4] truncate'>
                                {u.fullName}
                              </p>
                              <p className='text-xs text-gray-500 dark:text-[#A29FA8] truncate'>{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className='py-3.5 px-4'>
                          <div className='relative inline-block'>
                            <select
                              value={u.role}
                              disabled={isRowUpdating}
                              onChange={(e) => updateRole({ userId: u.id, role: e.target.value as UserRole })}
                              className='appearance-none h-9 rounded-lg border border-gray-200 dark:border-white/[0.08] pl-3 pr-8 text-sm text-gray-700 dark:text-[#ECE9E4] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white dark:bg-[#232227] disabled:opacity-60 transition cursor-pointer'
                            >
                              {ROLE_OPTIONS.map((role) => (
                                <option key={role} value={role}>
                                  {t(`roles.${role}`)}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className='absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-[#A29FA8] pointer-events-none' />
                          </div>
                        </td>
                        <td className='py-3.5 px-4'>
                          <span className='text-xs font-medium text-gray-600 dark:text-[#ECE9E4] bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/[0.08] rounded-full px-2.5 py-1'>
                            {u.subscriptionTier}
                          </span>
                        </td>
                        <td className='py-3.5 px-4 text-sm text-gray-500 dark:text-[#A29FA8]'>
                          {formatDate(u.createdAt)}
                        </td>
                        <td className='py-3.5 px-4'>
                          <button
                            type='button'
                            className='w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-400 dark:text-[#A29FA8] cursor-pointer'
                          >
                            <MoreHorizontal className='w-4 h-4' />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
