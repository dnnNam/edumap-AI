export default function Avatar({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox='0 0 100 100' className={`shrink-0 rounded-full ${className}`} role='img' aria-label='User avatar'>
      <circle cx='50' cy='50' r='50' fill='#29B6F6' />
      <circle cx='48' cy='36' r='13' fill='none' stroke='#fff' strokeWidth='7' />
      <path
        d='M26 74 V71 C26 63 34 58 42 58 H55 C63 58 71 63 71 71 V74'
        fill='none'
        stroke='#fff'
        strokeWidth='6.5'
        strokeLinecap='round'
      />
    </svg>
  )
}
