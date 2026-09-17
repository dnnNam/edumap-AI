import { Mail, Lock, User } from 'lucide-react'
import Logo from '../../components/ui/Logo'
import FormInput from '../../components/ui/FormInput'
import PrimaryButton from '../../components/ui/PrimaryButton'
import StatCard from '../../components/ui/StatCard'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { registerSchema, type RegisterFormPayload } from '../../schemas/auth.schema'
import { useRegisterMutation } from '../../hooks/useAuthQuery'
import { toast } from 'sonner'

export default function RegisterPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormPayload>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const { mutate: registerUser, isPending } = useRegisterMutation()

  const onSubmit = (data: RegisterFormPayload) => {
    // Bỏ confirmPassword trước khi gửi lên backend
    const { email, password, fullName } = data

    registerUser(
      { email, password, fullName },
      {
        onSuccess: () => {
          toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
          navigate('/login')
        },
        // onError không cần xử lý riêng vì http.ts interceptor đã toast lỗi chung rồi
      },
    )
  }

  return (
    <div className='min-h-screen w-full flex bg-white'>
      {/* Left panel: the form */}
      <div className='flex flex-1 md:w-1/2 flex-col px-6 md:px-16 py-12'>
        <Logo />

        <div className='w-full max-w-md mt-10'>
          <h2 className='text-[26px] font-bold text-gray-900'>Create your account</h2>
          <p className='mt-1.5 text-gray-500 text-[15px]'>90-second setup. Free forever for students.</p>

          <form onSubmit={handleSubmit(onSubmit)} className='mt-8 space-y-5'>
            <div>
              <FormInput
                id='fullName'
                label='Full name'
                icon={<User className='w-4 h-4' />}
                placeholder='Alex Johnson'
                {...register('fullName')}
              />
              {errors.fullName && <p className='text-sm text-red-500 mt-1'>{errors.fullName.message}</p>}
            </div>

            <div>
              <FormInput
                id='email'
                label='Email'
                type='email'
                icon={<Mail className='w-4 h-4' />}
                placeholder='you@university.edu'
                {...register('email')}
              />
              {errors.email && <p className='text-sm text-red-500 mt-1'>{errors.email.message}</p>}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <FormInput
                  id='password'
                  label='Password'
                  type='password'
                  icon={<Lock className='w-4 h-4' />}
                  placeholder='••••••••'
                  {...register('password')}
                />
                {errors.password && <p className='text-sm text-red-500 mt-1'>{errors.password.message}</p>}
              </div>
              <div>
                <FormInput
                  id='confirmPassword'
                  label='Confirm'
                  type='password'
                  icon={<Lock className='w-4 h-4' />}
                  placeholder='••••••••'
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className='text-sm text-red-500 mt-1'>{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <PrimaryButton type='submit' loading={isPending} loadingText='Creating account...'>
              Create account
            </PrimaryButton>

            <p className='text-center text-xs text-gray-400'>
              By signing up you agree to our{' '}
              <a href='#' className='underline hover:text-gray-600'>
                Terms
              </a>{' '}
              &{' '}
              <a href='#' className='underline hover:text-gray-600'>
                Privacy
              </a>
              .
            </p>
          </form>

          <p className='mt-4 text-center text-sm text-gray-500'>
            Already have an account?{' '}
            <Link to='/login' className='font-medium text-gray-900 hover:underline'>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel: marketing content */}
      <div className='hidden md:flex md:w-1/2 flex-col justify-between bg-[#FAFAF9] px-16 py-12 border-l border-gray-200'>
        <div />
        <div className='max-w-lg self-end text-right'>
          <h1 className='text-[40px] leading-[1.15] font-bold text-gray-900 tracking-tight'>
            Map your career.
            <br />
            In under a minute.
          </h1>
          <p className='mt-5 text-gray-500 text-[15px] leading-relaxed'>
            Get a personalized roadmap, skill tree and job matches the moment you sign up.
          </p>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <StatCard value='120K+' label='Students' className='text-center' />
          <StatCard value='412' label='Schools' className='text-center' />
          <StatCard value='4.9★' label='Rating' className='text-center' />
        </div>
      </div>
    </div>
  )
}
