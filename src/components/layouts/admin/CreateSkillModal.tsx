// src/components/layouts/admin/CreateSkillModal.tsx
import { useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, X } from 'lucide-react'
import { useAllSkillsQuery, useCreateSkillMutation } from '../../../hooks/skillsQuery'
import { createSkillSchema, type CreateSkillFormValues } from '../../../schemas/skill.schema'

interface Props {
  open: boolean
  onClose: () => void
}

const DEFAULT_VALUES: CreateSkillFormValues = {
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
  return (
    <label className='block'>
      <span className='block text-sm font-medium text-gray-900 mb-1.5'>{label}</span>
      {children}
      {error ? (
        <span className='block mt-1 text-xs text-red-600'>{error}</span>
      ) : hint ? (
        <span className='block mt-1 text-xs text-gray-400'>{hint}</span>
      ) : null}
    </label>
  )
}

export default function CreateSkillModal({ open, onClose }: Props) {
  const { data: skillsRes } = useAllSkillsQuery()
  const skills = useMemo(() => skillsRes?.data?.data ?? [], [skillsRes])
  const categories = useMemo(
    () => [...new Set(skills.map((s) => s.category))].sort((a, b) => a.localeCompare(b, 'vi')),
    [skills],
  )

  const { mutate, isPending } = useCreateSkillMutation()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateSkillFormValues>({
    resolver: zodResolver(createSkillSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open) reset(DEFAULT_VALUES)
  }, [open, reset])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !isPending && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, isPending, onClose])

  if (!open) return null

  const onSubmit = (values: CreateSkillFormValues) => {
    // Danh sách hiện có nhiều skill trùng tên -> chặn tạo trùng ngay ở client
    const duplicated = skills.some((s) => s.name.trim().toLowerCase() === values.name.toLowerCase())
    if (duplicated) {
      setError('name', { message: 'A skill with this name already exists' })
      return
    }

    mutate(values, {
      onSuccess: () => {
        reset(DEFAULT_VALUES)
        onClose()
      },
    })
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
          <h2 className='text-[17px] font-semibold text-gray-900'>Add skill</h2>
          <button
            type='button'
            onClick={onClose}
            disabled={isPending}
            aria-label='Close'
            className='p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition'
          >
            <X className='w-4 h-4' />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex-1 overflow-y-auto'>
          <div className='px-6 py-5 space-y-4'>
            <Field label='Name' error={errors.name?.message}>
              <input
                type='text'
                placeholder='e.g. Redis'
                autoFocus
                {...register('name')}
                className={inputClass(!!errors.name)}
              />
            </Field>

            <Field label='Category' error={errors.category?.message} hint='Pick an existing category or type a new one'>
              <input
                type='text'
                list='skill-categories'
                placeholder='e.g. Databases'
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
              <Field label='Difficulty' error={errors.difficultyLevel?.message}>
                <select
                  {...register('difficultyLevel', { valueAsNumber: true })}
                  className={inputClass(!!errors.difficultyLevel)}
                >
                  {[1, 2, 3, 4, 5].map((l) => (
                    <option key={l} value={l}>
                      Level {l}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label='Demand score' error={errors.demandScore?.message} hint='e.g. 8.5'>
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
              Cancel
            </button>
            <button
              type='submit'
              disabled={isPending}
              className='inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 disabled:opacity-60 transition'
            >
              {isPending && <Loader2 className='w-4 h-4 animate-spin' />}
              {isPending ? 'Creating...' : 'Create skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
