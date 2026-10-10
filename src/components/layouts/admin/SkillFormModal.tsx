import { useTranslation } from 'react-i18next'
// src/components/layouts/admin/SkillFormModal.tsx
// Dùng chung cho cả TẠO (skill = null) và SỬA (skill = skill cần sửa)
import { useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { useAllSkillsQuery, useCreateSkillMutation, useUpdateSkillMutation } from '../../../hooks/skillsQuery'
import { createSkillSchema, type CreateSkillFormValues } from '../../../schemas/skill.schema'
import type { Skill, UpdateSkillPayload } from '../../../types/api/skills.type'

interface Props {
  open: boolean
  onClose: () => void
  skill?: Skill | null
}

const EMPTY_VALUES: CreateSkillFormValues = {
  name: '',
  category: '',
  difficultyLevel: 1,
  demandScore: 0,
}

const inputClass = (hasError: boolean) =>
  `w-full h-10 rounded-lg border bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition ${
    hasError ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-gray-300'
  }`

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  const { t } = useTranslation()
  return (
    <label className='block'>
      <span className='block text-sm font-medium text-gray-900 mb-1.5'>{label}</span>
      {children}
      {error ? (
        <span className='block mt-1 text-xs text-red-600'>{t(error)}</span>
      ) : hint ? (
        <span className='block mt-1 text-xs text-gray-400'>{hint}</span>
      ) : null}
    </label>
  )
}

export default function SkillFormModal({ open, onClose, skill }: Props) {
  const { t } = useTranslation()
  const isEdit = !!skill

  const { data: skillsRes } = useAllSkillsQuery()
  const skills = useMemo(() => skillsRes?.data?.data ?? [], [skillsRes])
  const categories = useMemo(
    () => [...new Set(skills.map((s) => s.category))].sort((a, b) => a.localeCompare(b, 'vi')),
    [skills],
  )

  const { mutate: createSkill, isPending: creating } = useCreateSkillMutation()
  const { mutate: updateSkill, isPending: updating } = useUpdateSkillMutation()
  const isPending = creating || updating

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, dirtyFields },
  } = useForm<CreateSkillFormValues>({
    resolver: zodResolver(createSkillSchema),
    defaultValues: EMPTY_VALUES,
  })

  // Mỗi lần mở modal: nạp dữ liệu skill (sửa) hoặc form trống (tạo)
  useEffect(() => {
    if (!open) return
    reset(
      skill
        ? {
            name: skill.name,
            category: skill.category,
            difficultyLevel: skill.difficultyLevel,
            demandScore: skill.demandScore,
          }
        : EMPTY_VALUES,
    )
  }, [open, skill, reset])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !isPending && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, isPending, onClose])

  if (!open) return null

  const onSubmit = (values: CreateSkillFormValues) => {
    // Chặn trùng tên (bỏ qua chính skill đang sửa)
    const duplicated = skills.some(
      (s) => s.id !== skill?.id && s.name.trim().toLowerCase() === values.name.toLowerCase(),
    )
    if (duplicated) {
      setError('name', { message: 'admin.skills.duplicate' })
      return
    }

    const done = {
      onSuccess: () => {
        reset(EMPTY_VALUES)
        onClose()
      },
    }

    if (!skill) {
      createSkill(values, done)
      return
    }

    // PATCH: chỉ gửi những field thật sự thay đổi
    const changedKeys = Object.keys(dirtyFields) as (keyof CreateSkillFormValues)[]
    if (changedKeys.length === 0) {
      toast.info(t('admin.skills.noChanges'))
      onClose()
      return
    }
    const payload = Object.fromEntries(changedKeys.map((k) => [k, values[k]])) as UpdateSkillPayload
    updateSkill({ id: skill.id, payload }, done)
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-gray-900/30 backdrop-blur-xs'
        onClick={() => !isPending && onClose()}
        aria-hidden='true'
      />

      <div
        role='dialog'
        aria-modal='true'
        className='relative w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl'
      >
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
          <h2 className='text-[17px] font-semibold text-gray-900'>
            {isEdit ? t('admin.skills.edit') : t('admin.skills.add')}
          </h2>
          <button
            type='button'
            onClick={onClose}
            disabled={isPending}
            aria-label={t('common.close')}
            className='p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition'
          >
            <X className='w-4 h-4' />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex-1 overflow-y-auto'>
          <div className='px-6 py-5 space-y-4'>
            <Field label={t('admin.skills.name')} error={errors.name?.message}>
              <input
                type='text'
                placeholder={t('admin.skills.namePlaceholder')}
                autoFocus
                {...register('name')}
                className={inputClass(!!errors.name)}
              />
            </Field>

            <Field
              label={t('admin.skills.category')}
              error={errors.category?.message}
              hint={t('admin.skills.categoryHint')}
            >
              <input
                type='text'
                list='skill-categories'
                placeholder={t('admin.skills.categoryPlaceholder')}
                {...register('category')}
                className={inputClass(!!errors.category)}
              />
              <datalist id='skill-categories'>
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>

            <div className='grid grid-cols-2 gap-4'>
              <Field label={t('admin.skills.difficulty')} error={errors.difficultyLevel?.message}>
                <select
                  {...register('difficultyLevel', { valueAsNumber: true })}
                  className={inputClass(!!errors.difficultyLevel)}
                >
                  {[1, 2, 3, 4, 5].map((l) => (
                    <option key={l} value={l}>
                      {t('admin.skills.level', { n: l })}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label={t('admin.skills.demand')}
                error={errors.demandScore?.message}
                hint={t('admin.skills.demandHint')}
              >
                <input
                  type='number'
                  step='any'
                  min={0}
                  {...register('demandScore', { valueAsNumber: true })}
                  className={inputClass(!!errors.demandScore)}
                />
              </Field>
            </div>
          </div>

          <div className='flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100'>
            <button
              type='button'
              onClick={onClose}
              disabled={isPending}
              className='rounded-xl border border-gray-200 text-gray-900 text-sm font-medium px-4 py-2 hover:bg-gray-50 disabled:opacity-60 transition'
            >
              {t('common.cancel')}
            </button>
            <button
              type='submit'
              disabled={isPending}
              className='inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 disabled:opacity-60 transition'
            >
              {isPending && <Loader2 className='w-4 h-4 animate-spin' />}
              {isPending ? t('common.saving') : isEdit ? t('admin.skills.saveChanges') : t('admin.skills.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
