interface AnimatedIconProps {
  className?: string
  size?: number
}

/**
 * 1. AnimatedSparkles: Ngôi sao chính xoay lấp lánh, các tia sáng phụ phát sáng phóng to
 */
export function AnimatedSparkles({ className = '', size = 18 }: AnimatedIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`icon-sparkle shrink-0 ${className}`}
    >
      <path d='M12 3c0 4.5 3.5 8 8 8-4.5 0-8 3.5-8 8 0-4.5-3.5-8-8-8 4.5 0 8-3.5 8-8z' />
      <path
        d='M19 3v4M21 5h-4'
        className='transition-transform duration-300 origin-center group-hover:scale-125 group-hover:opacity-100'
      />
      <path
        d='M5 17v2M6 18H4'
        className='transition-transform duration-300 origin-center group-hover:scale-125 group-hover:opacity-100'
      />
    </svg>
  )
}

/**
 * 2. AnimatedGitBranch: Tách nhánh và các điểm node tròn phập phồng nảy nở
 */
export function AnimatedGitBranch({ className = '', size = 18 }: AnimatedIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`icon-branch shrink-0 ${className}`}
    >
      <line x1='6' y1='3' x2='6' y2='15' />
      <path d='M18 9a9 9 0 0 1-9 9' />
      <circle
        cx='6'
        cy='18'
        r='3'
        className='transition-transform duration-300 origin-[6px_18px] group-hover:scale-125'
      />
      <circle
        cx='6'
        cy='6'
        r='3'
        className='transition-transform duration-300 origin-[6px_6px] group-hover:scale-125'
      />
      <circle
        cx='18'
        cy='9'
        r='3'
        className='transition-transform duration-300 origin-[18px_9px] group-hover:scale-130'
      />
    </svg>
  )
}

/**
 * 3. AnimatedZap: Tia sét nạp năng lượng đàn hồi
 */
export function AnimatedZap({ className = '', size = 18 }: AnimatedIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`icon-zap shrink-0 ${className}`}
    >
      <polygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2' />
    </svg>
  )
}

/**
 * 4. AnimatedBell: Chuông thông báo đung đưa lắc lư con lắc vật lý
 */
export function AnimatedBell({ className = '', size = 18 }: AnimatedIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`icon-bell shrink-0 ${className}`}
    >
      <path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' />
      <path d='M13.73 21a2 2 0 0 1-3.46 0' />
    </svg>
  )
}

/**
 * 5. AnimatedArrowRight: Mũi tên lướt tới phía trước 4px
 */
export function AnimatedArrowRight({ className = '', size = 16 }: AnimatedIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2.2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`icon-arrow transition-transform duration-300 ease-out shrink-0 ${className}`}
    >
      <line x1='5' y1='12' x2='19' y2='12' />
      <polyline points='12 5 19 12 12 19' />
    </svg>
  )
}

/**
 * 6. AnimatedBriefcase: Cặp tài liệu nảy nhẹ khi hover (rất hợp nút Việc làm Hot)
 */
export function AnimatedBriefcase({ className = '', size = 18 }: AnimatedIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`icon-briefcase shrink-0 ${className}`}
    >
      <rect width='20' height='14' x='2' y='7' rx='2' ry='2' />
      <path
        d='M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'
        className='transition-transform duration-300 origin-top group-hover:-translate-y-0.5'
      />
    </svg>
  )
}

/**
 * 7. AnimatedShieldCheck: Khiên bảo vệ nảy nhẹ với dấu tick xanh uy tín
 */
export function AnimatedShieldCheck({ className = '', size = 16 }: AnimatedIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`icon-shield shrink-0 ${className}`}
    >
      <path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z' />
      <path d='m9 12 2 2 4-4' className='transition-transform duration-300 origin-center group-hover:scale-115' />
    </svg>
  )
}

/**
 * 8. AnimatedClock: Đồng hồ với kim giờ/phút quay vòng mượt mà (dành cho thẻ Thời lượng)
 */
export function AnimatedClock({ className = '', size = 18 }: AnimatedIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`icon-clock shrink-0 ${className}`}
    >
      <circle cx='12' cy='12' r='10' />
      <polyline points='12 6 12 12 16 14' className='icon-clock-hand' />
    </svg>
  )
}

/**
 * 9. AnimatedTarget: Hồng tâm mục tiêu co giãn nhấp nháy tập trung lộ trình
 */
export function AnimatedTarget({ className = '', size = 18 }: AnimatedIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`icon-target shrink-0 ${className}`}
    >
      <circle cx='12' cy='12' r='10' />
      <circle cx='12' cy='12' r='6' className='transition-transform duration-300 origin-center group-hover:scale-110' />
      <circle
        cx='12'
        cy='12'
        r='2'
        className='transition-transform duration-300 origin-center group-hover:scale-130 fill-current'
      />
    </svg>
  )
}

/**
 * 10. AnimatedLayers: Các tầng kỹ năng trượt nâng tách lớp 3D (dành cho thẻ Nhóm kỹ năng)
 */
export function AnimatedLayers({ className = '', size = 18 }: AnimatedIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`icon-layers shrink-0 ${className}`}
    >
      <polygon
        points='12 2 2 7 12 12 22 7 12 2'
        className='transition-transform duration-300 group-hover:-translate-y-1'
      />
      <polyline points='2 17 12 22 22 17' className='transition-transform duration-300 group-hover:translate-y-0.5' />
      <polyline points='2 12 12 17 22 12' />
    </svg>
  )
}

/**
 * 11. AnimatedFlame: Ngọn lửa bập bùng nhiệt huyết (dành cho chuỗi ngày streak)
 */
export function AnimatedFlame({ className = '', size = 18 }: AnimatedIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`icon-flame shrink-0 ${className}`}
    >
      <path d='M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z' />
    </svg>
  )
}

/**
 * 12. AnimatedSettings: Bánh răng cài đặt xoay nhịp nhàng khi hover
 */
export function AnimatedSettings({ className = '', size = 18 }: AnimatedIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`icon-gear shrink-0 ${className}`}
    >
      <path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' />
      <circle cx='12' cy='12' r='3' />
    </svg>
  )
}
