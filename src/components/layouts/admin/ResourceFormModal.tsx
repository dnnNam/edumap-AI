import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, X } from 'lucide-react'
import { useEffect, useMemo, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { useAllSkillsQuery } from '../../../hooks/skillsQuery'
import { useCreateSkillResourceMutation } from '../../../hooks/skillResourceQuery'
import {
  RESOURCE_TYPES,
  skillResourceSchema,
  type SkillResourceFormValues,
} from '../../../schemas/skillResource.schema'
import { getResourceTypeLabel } from '../../../utils/skillResource'

const DEFAULT_VALUES: Partial<SkillResourceFormValues> = {
  skillId: '',
  affiliateId: '',
  resourceType: 'VIDEO_COURSE',
  title: '',
  url: '',
  cost: 0,
  rating: 0,
  durationHours: 1,
}

const inputClass =
  'w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-400'

function Field({
  label,
  error,
  required,
  className = '',
  children,
}: {
  label: string
  error?: string
  required?: boolean
  className?: string
  children: ReactNode
}) {
  const { t } = useTranslation()
  return (
    <div className={className}>
      <label className='block text-sm font-medium text-gray-700 mb-1.5'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      {children}
      {error && <p className='mt-1 text-xs text-red-600'>{t(error)}</p>}
    </div>
  )
}

export default function ResourceFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation()
  const { data: skillsRes } = useAllSkillsQuery()
  const skills = useMemo(
    () => [...(skillsRes?.data?.data ?? [])].sort((a, b) => a.name.localeCompare(b.name, 'vi')),
    [skillsRes],
  )
  const { mutate: createResource, isPending } = useCreateSkillResourceMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillResourceFormValues>({
    resolver: zodResolver(skillResourceSchema),
    defaultValues: DEFAULT_VALUES,
  })

  // mỗi lần mở modal thì reset form sạch
  useEffect(() => {
    if (open) reset(DEFAULT_VALUES)
  }, [open, reset])

  if (!open) return null

  const onSubmit = (values: SkillResourceFormValues) => {
    createResource({ ...values, affiliateId: values.affiliateId || undefined }, { onSuccess: () => onClose() })
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
        className='relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl'
      >
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
          <h3 className='text-[17px] font-semibold text-gray-900'>{t('admin.resources.form.addTitle')}</h3>
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

        <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col min-h-0'>
          <div className='overflow-y-auto px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Field
              label={t('admin.resources.form.skill')}
              required
              error={errors.skillId?.message}
              className='sm:col-span-2'
            >
              <select {...register('skillId')} className={inputClass}>
                <option value=''>{t('admin.resources.form.selectSkill')}</option>
                {skills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label={t('admin.resources.form.title')}
              required
              error={errors.title?.message}
              className='sm:col-span-2'
            >
              <input
                {...register('title')}
                placeholder={t('admin.resources.form.titlePlaceholder')}
                className={inputClass}
              />
            </Field>

            <Field label='URL' required error={errors.url?.message} className='sm:col-span-2'>
              <input {...register('url')} placeholder='https://...' className={inputClass} />
            </Field>

            <Field label={t('admin.resources.form.type')} required error={errors.resourceType?.message}>
              <select {...register('resourceType')} className={inputClass}>
                {RESOURCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {getResourceTypeLabel(type)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label='Affiliate ID' error={errors.affiliateId?.message}>
              <input
                {...register('affiliateId')}
                placeholder={t('admin.resources.form.optional')}
                className={inputClass}
              />
            </Field>

            <Field label={t('admin.resources.form.cost')} required error={errors.cost?.message}>
              <input
                type='number'
                step='any'
                min={0}
                {...register('cost', { valueAsNumber: true })}
                className={inputClass}
              />
            </Field>

            <Field label={t('admin.resources.form.rating')} required error={errors.rating?.message}>
              <input
                type='number'
                step='0.1'
                min={0}
                max={5}
                {...register('rating', { valueAsNumber: true })}
                className={inputClass}
              />
            </Field>

            <Field label={t('admin.resources.form.duration')} required error={errors.durationHours?.message}>
              <input
                type='number'
                step='any'
                min={0}
                {...register('durationHours', { valueAsNumber: true })}
                className={inputClass}
              />
            </Field>
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
              {isPending ? t('admin.resources.form.creating') : t('admin.resources.form.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
