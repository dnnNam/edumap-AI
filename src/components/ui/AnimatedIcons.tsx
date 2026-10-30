interface AnimatedIconProps {
  className?: string
  size?: number
}

/**
 * 1. AnimatedSparkles: Ngôi sao chính xoay lấp lánh, các tia sáng phụ phát sáng phóng to
 * Kích hoạt ngay khi hover vào bất kỳ vị trí nào của button/container chứa class 'group'
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
      {/* Ngôi sao chính */}
      <path d='M12 3c0 4.5 3.5 8 8 8-4.5 0-8 3.5-8 8 0-4.5-3.5-8-8-8 4.5 0 8-3.5 8-8z' />
      {/* Tia sáng phụ trên */}
      <path
        d='M19 3v4M21 5h-4'
        className='transition-transform duration-300 origin-center group-hover:scale-125 group-hover:opacity-100'
      />
      {/* Tia sáng phụ dưới */}
      <path
        d='M5 17v2M6 18H4'
        className='transition-transform duration-300 origin-center group-hover:scale-125 group-hover:opacity-100'
      />
    </svg>
  )
}

/**
 * 2. AnimatedGitBranch: Tách nhánh và các điểm node tròn phập phồng nảy nở
 * Kích hoạt ngay khi hover vào bất kỳ vị trí nào của button 'Xem Cây kỹ năng'
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
      {/* Thân chính */}
      <line x1='6' y1='3' x2='6' y2='15' />
      {/* Nhánh cong */}
      <path d='M18 9a9 9 0 0 1-9 9' />
      {/* Node gốc dưới */}
      <circle
        cx='6'
        cy='18'
        r='3'
        className='transition-transform duration-300 origin-[6px_18px] group-hover:scale-125'
      />
      {/* Node trên */}
      <circle
        cx='6'
        cy='6'
        r='3'
        className='transition-transform duration-300 origin-[6px_6px] group-hover:scale-125'
      />
      {/* Node nhánh rẽ */}
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
 * 3. AnimatedZap: Tia sét nạp năng lượng đàn hồi và chuyển động vi lượng
 * Kích hoạt ngay khi hover vào button hoặc radar overview
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
 * Kích hoạt ngay khi rê chuột vào bất kỳ góc nào của button chuông thông báo trên Header
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
 * 5. AnimatedArrowRight: Mũi tên lướt tới phía trước 4px mượt mà
 * Kích hoạt ngay khi chạm vào bất kỳ điểm nào của button CTA
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
