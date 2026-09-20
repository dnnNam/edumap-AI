import { zodResolver } from '@hookform/resolvers/zod'
import { BookOpen, ChevronDown, FileText, Layers, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, type ElementType } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { FaGithub } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import FormInput from '../../components/ui/FormInput'
import FormSelect from '../../components/ui/FormSelect'
import { LIST_ITEM } from '../../config/motionConfig'
import { analyzeFormSchema, type AnalysisMode, type AnalyzeFormValues } from '../../schemas/ai-adivisor,schema'
import type { GenerateSkillTreePayload } from '../../types/api/ai-advisor.types'
import { useGenerateSkillTreeMutation } from '../../hooks/ai-adivisorQuery'
import { useProfileQuery } from '../../hooks/useUserQuery'
import SectionHeader from '../../components/layouts/SectionHeader'

// ---------- data ----------

interface ModeOption {
  key: AnalysisMode
  title: string
  description: string
  icon: ElementType
  recommended?: boolean
}

const MODES: ModeOption[] = [
  { key: 'ACADEMIC', title: 'Academic Only', description: 'Transcript & grades', icon: BookOpen },
  { key: 'GITHUB', title: 'GitHub Only', description: 'Repos & activity', icon: FaGithub },
  { key: 'HYBRID', title: 'Hybrid', description: 'Transcript + repos', icon: Layers, recommended: true },
]

const TARGET_ROLES = [
  'Backend Developer',
  'Frontend Developer',
  'Full-stack Developer',
  'Mobile Developer',
  'DevOps Engineer',
  'Data Engineer',
  'Machine Learning Engineer',
  'QA Engineer',
]

const YEAR_OPTIONS = ['1', '2', '3', '4', '5', '6']

// Chỉnh lại cho khớp với thang điểm mà backend chấp nhận
const GRADE_OPTIONS = ['A', 'B+', 'B', 'C+', 'C', 'D', 'F']

// ---------- helpers ----------

// Form → body gửi lên API, chỉ đính kèm phần dữ liệu mà mode đang chọn cần
function buildPayload(data: AnalyzeFormValues): GenerateSkillTreePayload {
  const payload: GenerateSkillTreePayload = { targetRole: data.targetRole }

  if (data.mode !== 'GITHUB') {
    payload.academicForm = {
      universityName: data.universityName.trim(),
      currentYear: data.currentYear,
      coreCourses: data.coreCourses.map((c) => ({ courseName: c.courseName.trim(), grade: c.grade })),
    }
  }

  if (data.mode !== 'ACADEMIC') {
    // Phòng trường hợp user dán cả link profile: https://github.com/octocat/
    payload.githubUsername = data.githubUsername
      .trim()
      .replace(/^(https?:\/\/)?(www\.)?github\.com\//i, '')
      .replace(/\/+$/, '')
  }

  return payload
}

// ---------- page ----------

export default function UploadPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<AnalyzeFormValues>({
    resolver: zodResolver(analyzeFormSchema),
    // Chỉ validate khi bấm submit. Nếu để mặc định (onChange), sau lần submit lỗi đầu tiên
    // mỗi lần "Add course" RHF sẽ validate lại cả field array -> dòng trống mới hiện lỗi đỏ ngay.
    // Lỗi từng ô sẽ tự được xoá khi user gõ (clearErrors trong register).
    reValidateMode: 'onSubmit',
    defaultValues: {
      mode: 'HYBRID',
      targetRole: TARGET_ROLES[0],
      universityName: '',
      currentYear: 3,
      coreCourses: [{ courseName: '', grade: 'A' }],
      githubUsername: '',
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'coreCourses' })
  const mode = watch('mode')
  const listRef = useRef<HTMLDivElement>(null)
  const showAcademic = mode !== 'GITHUB'
  const showGithub = mode !== 'ACADEMIC'
  const modeTitle = MODES.find((m) => m.key === mode)?.title ?? ''
  const summary = showAcademic ? `${modeTitle} · ${fields.length} course${fields.length > 1 ? 's' : ''}` : modeTitle

  const { mutate: generateSkillTree, isPending } = useGenerateSkillTreeMutation()

  // Điền sẵn trường đại học + năm học từ profile (GitHub username để trống, user tự nhập)
  const { data: profileResponse } = useProfileQuery()
  const profile = profileResponse?.data?.data

  useEffect(() => {
    if (!profile) return
    if (!getValues('universityName') && profile.universityName) {
      setValue('universityName', profile.universityName)
    }
    const year = Number(profile.currentYear)
    if (Number.isInteger(year) && year >= 1 && year <= 6) {
      setValue('currentYear', year)
    }
  }, [profile, getValues, setValue])

  const handleChangeMode = (next: AnalysisMode) => {
    setValue('mode', next)
    clearErrors() // bỏ lỗi cũ của field không còn hiển thị ở mode mới
  }

  const handleAddCourse = () => {
    // shouldFocus: false → không để RHF tự focus (trình duyệt sẽ nhảy cuộn giật trang)
    append({ courseName: '', grade: 'A' }, { shouldFocus: false })

    // Focus ô mới ngay khi render xong nhưng KHÔNG cuộn (preventScroll),
    // rồi cuộn mượt tới dòng mới sau khi animation mở rộng chiều cao kết thúc
    requestAnimationFrame(() => {
      const rows = listRef.current?.querySelectorAll<HTMLElement>('[data-course-row]')
      const lastRow = rows?.[rows.length - 1]
      lastRow?.querySelector('input')?.focus({ preventScroll: true })
      setTimeout(() => lastRow?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 320)
    })
  }

  const onSubmit = (data: AnalyzeFormValues) => {
    generateSkillTree(buildPayload(data), {
      onSuccess: () => {
        toast.success('Phân tích hoàn tất!')
        navigate('/skill-tree')
      },
      // onError không cần xử lý riêng vì http.ts interceptor đã toast lỗi chung rồi
    })
  }

  return (
    // Dùng h-full (KHÔNG dùng flex-1): cha trực tiếp của trang là <motion.div className='h-full'>
    // của AnimatedOutlet — một block thường, không phải flex container, nên flex-1 / min-h-0
    // không có tác dụng → vùng overflow-y-auto không bị giới hạn chiều cao → không cuộn được.
    <div className='h-full overflow-y-auto flex flex-col [scrollbar-gutter:stable]'>
      <div className='flex-1 w-full max-w-5xl mx-auto px-6 pt-6 pb-6'>
        {/* Page header */}
        <h1 className='text-[28px] font-bold text-gray-900'>Upload &amp; Analyze</h1>
        <p className='mt-1 text-gray-500 text-[15px]'>
          Choose an analysis mode and give the AI everything it needs to build your career map.
        </p>

        {/* Mode cards */}
        <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
          {MODES.map(({ key, title, description, icon: Icon, recommended }) => {
            const isActive = mode === key
            return (
              <button
                key={key}
                type='button'
                onClick={() => handleChangeMode(key)}
                aria-pressed={isActive}
                className={`relative text-left rounded-2xl border p-5 transition-colors ${
                  isActive ? 'border-indigo-600 bg-indigo-50/60' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className='flex items-start justify-between'>
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Icon className='w-4 h-4' />
                  </div>
                  {recommended && (
                    <span className='text-xs text-gray-700 bg-white border border-gray-200 rounded-full px-2.5 py-1'>
                      Recommended
                    </span>
                  )}
                </div>
                <p className='mt-4 font-semibold text-gray-900'>{title}</p>
                <p className='mt-0.5 text-sm text-gray-500'>{description}</p>
              </button>
            )
          })}
        </div>

        <form id='analyze-form' onSubmit={handleSubmit(onSubmit)} noValidate className='mt-5'>
          <div className='bg-white border border-gray-200 rounded-2xl p-6'>
            {/* Target role — bắt buộc ở cả 3 mode */}
            <div>
              <FormSelect
                id='targetRole'
                label='Target role'
                options={TARGET_ROLES}
                className='max-w-xs'
                {...register('targetRole')}
              />
              {errors.targetRole && <p className='text-sm text-red-500 mt-1'>{errors.targetRole.message}</p>}
            </div>

            {/* Academic transcript → academicForm */}
            {showAcademic && (
              <section className='mt-6 pt-6 border-t border-gray-100'>
                <SectionHeader icon={FileText} title='Academic transcript' tag='academicForm' />

                <div className='mt-4 grid grid-cols-1 sm:grid-cols-[1fr_260px] gap-x-4 gap-y-5'>
                  <div>
                    <FormInput
                      id='universityName'
                      label='University name'
                      placeholder='Đại học Bách Khoa'
                      {...register('universityName', { onChange: () => clearErrors('universityName') })}
                    />
                    {errors.universityName && (
                      <p className='text-sm text-red-500 mt-1'>{errors.universityName.message}</p>
                    )}
                  </div>
                  <FormSelect
                    id='currentYear'
                    label='Current year'
                    options={YEAR_OPTIONS}
                    {...register('currentYear', { valueAsNumber: true })}
                  />
                </div>

                <div className='mt-6 flex items-center justify-between'>
                  <p className='text-sm font-medium text-gray-800'>Core courses &amp; grades</p>
                  <button
                    type='button'
                    onClick={handleAddCourse}
                    className='flex items-center gap-1.5 rounded-lg border border-gray-200 text-gray-900 text-sm font-medium px-3.5 py-2 hover:bg-gray-50 transition-colors'
                  >
                    <Plus className='w-4 h-4' />
                    Add course
                  </button>
                </div>

                {/* Mỗi dòng animate chiều cao (LIST_ITEM) nên các phần tử bên dưới trượt xuống/lên mượt,
                    không bị "nhảy cục" khi thêm/xoá. Padding nằm ở div trong để height: 0 thật sự về 0 */}
                {/* Tối đa ~5 dòng rồi cuộn trong khung này, để form không dài vô hạn.
                    -mx-2/pl-2/pr-1 chừa chỗ cho focus ring không bị cắt; gutter stable để
                    thanh cuộn xuất hiện không làm các dòng bị dịch ngang */}
                <div
                  ref={listRef}
                  className='mt-1.5 -mx-2 pl-2 pr-1 max-h-72 overflow-y-auto [scrollbar-gutter:stable] [scrollbar-width:thin]'
                >
                  <AnimatePresence initial={false}>
                    {fields.map((field, index) => {
                      const courseError = errors.coreCourses?.[index]?.courseName
                      return (
                        <motion.div
                          key={field.id}
                          data-course-row
                          {...LIST_ITEM}
                          className='-mx-1 overflow-hidden scroll-mb-20'
                        >
                          <div className='px-1 py-1.5'>
                            <div className='flex items-center gap-3'>
                              <input
                                type='text'
                                aria-label={`Course ${index + 1} name`}
                                placeholder='Cơ sở dữ liệu'
                                className='flex-1 min-w-0 rounded-xl border border-gray-200 px-4 py-2.5 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition'
                                {...register(`coreCourses.${index}.courseName`, {
                                  onChange: () => clearErrors(`coreCourses.${index}.courseName`),
                                })}
                              />

                              <div className='relative w-24 shrink-0'>
                                <select
                                  aria-label={`Course ${index + 1} grade`}
                                  className='w-full appearance-none rounded-xl border border-gray-200 bg-white pl-3.5 pr-9 py-2.5 text-[15px] text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition'
                                  {...register(`coreCourses.${index}.grade`)}
                                >
                                  {GRADE_OPTIONS.map((g) => (
                                    <option key={g} value={g}>
                                      {g}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
                              </div>

                              <button
                                type='button'
                                onClick={() => remove(index)}
                                disabled={fields.length === 1}
                                aria-label={`Remove course ${index + 1}`}
                                className='w-9 h-9 shrink-0 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors'
                              >
                                <Trash2 className='w-4 h-4' />
                              </button>
                            </div>
                            {courseError && <p className='text-sm text-red-500 mt-1'>{courseError.message}</p>}
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </section>
            )}

            {/* GitHub profile → githubUsername */}
            {showGithub && (
              <section className='mt-6 pt-6 border-t border-gray-100'>
                <SectionHeader icon={FaGithub} title='GitHub profile' tag='githubUsername' />

                <div className='mt-4'>
                  <label htmlFor='githubUsername' className='block text-sm font-medium text-gray-800 mb-1.5'>
                    GitHub username
                  </label>
                  <div className='flex items-center max-w-xs rounded-xl border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition'>
                    <span className='pl-4 text-[15px] text-gray-400 select-none'>github.com/</span>
                    <input
                      id='githubUsername'
                      type='text'
                      placeholder='octocat'
                      className='flex-1 min-w-0 bg-transparent py-2.5 pr-4 text-[15px] text-gray-900 placeholder-gray-400 outline-none'
                      {...register('githubUsername', { onChange: () => clearErrors('githubUsername') })}
                    />
                  </div>
                  {errors.githubUsername && (
                    <p className='text-sm text-red-500 mt-1'>{errors.githubUsername.message}</p>
                  )}
                  <p className='mt-2 text-xs text-gray-500'>
                    We scan your top repos, languages and contribution activity.
                  </p>
                </div>
              </section>
            )}
          </div>
        </form>
      </div>

      {/* Action bar dính đáy: dù form dài đến đâu nút Start luôn nhìn thấy.
          Nút nằm ngoài <form> nên liên kết bằng thuộc tính form='analyze-form' */}
      <div className='sticky bottom-0 z-10 shrink-0 border-t border-gray-200 bg-white/90 backdrop-blur'>
        <div className='max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4'>
          <p className='text-sm text-gray-500 truncate'>{summary}</p>
          <button
            type='submit'
            form='analyze-form'
            disabled={isPending}
            className='shrink-0 flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white text-[15px] font-medium px-6 py-2.5 transition'
          >
            {isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : <Sparkles className='w-4 h-4' />}
            {isPending ? 'Analyzing...' : 'Start AI analysis'}
          </button>
        </div>
      </div>

      {/* Overlay trong lúc AI đang phân tích (có thể mất vài chục giây) */}
      {isPending && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-[2px] px-4'
          role='status'
          aria-live='polite'
        >
          <div className='w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-lg p-6 text-center'>
            <Loader2 className='w-6 h-6 mx-auto text-indigo-600 animate-spin' />
            <p className='mt-4 text-[15px] font-semibold text-gray-900'>AI đang phân tích hồ sơ của bạn</p>
            <p className='mt-1.5 text-sm text-gray-500'>
              Quá trình này có thể mất vài chục giây. Vui lòng không đóng trang.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
