import { motion, type Variants } from 'framer-motion'

interface AnimatedIconProps {
  className?: string
  size?: number
}

/**
 * 1. AnimatedSparkles: Ngôi sao chính xoay nhẹ đàn hồi, các tia sao phụ nhấp nháy phát sáng
 */
export function AnimatedSparkles({ className = '', size = 18 }: AnimatedIconProps) {
  return (
    <motion.svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      whileHover='hover'
      initial='idle'
    >
      {/* Ngôi sao chính */}
      <motion.path
        d='M12 3c0 4.5 3.5 8 8 8-4.5 0-8 3.5-8 8 0-4.5-3.5-8-8-8 4.5 0 8-3.5 8-8z'
        variants={{
          idle: { rotate: 0, scale: 1 },
          hover: { rotate: [0, 15, -10, 0], scale: [1, 1.15, 1], transition: { duration: 0.6, ease: 'easeInOut' } },
        }}
      />
      {/* Tia sáng phụ trên góc */}
      <motion.path
        d='M19 3v4M21 5h-4'
        variants={{
          idle: { scale: 1, opacity: 0.8 },
          hover: { scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8], transition: { duration: 0.5, repeat: 1 } },
        }}
      />
      {/* Tia sáng phụ góc dưới */}
      <motion.path
        d='M5 17v2M6 18H4'
        variants={{
          idle: { scale: 1, opacity: 0.7 },
          hover: { scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7], transition: { duration: 0.5, delay: 0.1, repeat: 1 } },
        }}
      />
    </motion.svg>
  )
}

/**
 * 2. AnimatedGitBranch: Tách nhánh và các điểm nút nhảy đàn hồi (rất hợp nút Cây Kỹ Năng)
 */
export function AnimatedGitBranch({ className = '', size = 18 }: AnimatedIconProps) {
  return (
    <motion.svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      whileHover='hover'
      initial='idle'
    >
      {/* Đường thân chính */}
      <motion.line
        x1='6'
        y1='3'
        x2='6'
        y2='15'
        variants={{
          idle: { pathLength: 1 },
          hover: { pathLength: [0.6, 1], transition: { duration: 0.4 } },
        }}
      />
      {/* Đường nhánh rẽ cong */}
      <motion.path
        d='M18 9a9 9 0 0 1-9 9'
        variants={{
          idle: { pathLength: 1, opacity: 1 },
          hover: { pathLength: [0, 1], opacity: [0.4, 1], transition: { duration: 0.45, ease: 'easeOut' } },
        }}
      />
      {/* Node gốc dưới */}
      <motion.circle
        cx='6'
        cy='18'
        r='3'
        variants={{
          idle: { scale: 1 },
          hover: { scale: [1, 1.25, 1], transition: { duration: 0.4 } },
        }}
      />
      {/* Node trên */}
      <motion.circle
        cx='6'
        cy='6'
        r='3'
        variants={{
          idle: { scale: 1 },
          hover: { scale: [1, 1.25, 1], transition: { duration: 0.4, delay: 0.08 } },
        }}
      />
      {/* Node nhánh rẽ */}
      <motion.circle
        cx='18'
        cy='9'
        r='3'
        variants={{
          idle: { scale: 1 },
          hover: { scale: [1, 1.35, 1], transition: { duration: 0.4, delay: 0.16 } },
        }}
      />
    </motion.svg>
  )
}

/**
 * 3. AnimatedZap: Tia sét nạp năng lượng phóng to và giật điện nhẹ
 */
export function AnimatedZap({ className = '', size = 18 }: AnimatedIconProps) {
  return (
    <motion.svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      whileHover='hover'
      initial='idle'
    >
      <motion.polygon
        points='13 2 3 14 12 14 11 22 21 10 12 10 13 2'
        variants={{
          idle: { scale: 1, rotate: 0 },
          hover: {
            scale: [1, 1.2, 0.95, 1.1, 1],
            rotate: [0, -8, 8, -4, 0],
            transition: { duration: 0.5, ease: 'easeInOut' },
          },
        }}
      />
    </motion.svg>
  )
}

/**
 * 4. AnimatedBell: Chuông thông báo lắc lư con lắc đung đưa
 */
export function AnimatedBell({ className = '', size = 18 }: AnimatedIconProps) {
  const bellVariants: Variants = {
    idle: { rotate: 0 },
    hover: {
      rotate: [0, 18, -16, 12, -8, 4, 0],
      transition: { duration: 0.65, ease: 'easeInOut' },
    },
  }

  return (
    <motion.svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      whileHover='hover'
      initial='idle'
      style={{ originX: '50%', originY: '15%' }}
    >
      <motion.path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' variants={bellVariants} />
      <motion.path
        d='M13.73 21a2 2 0 0 1-3.46 0'
        variants={{
          idle: { x: 0 },
          hover: { x: [0, 2, -2, 1, 0], transition: { duration: 0.5, delay: 0.1 } },
        }}
      />
    </motion.svg>
  )
}

/**
 * 5. AnimatedArrowRight: Mũi tên trượt về phía trước đàn hồi
 */
export function AnimatedArrowRight({ className = '', size = 16 }: AnimatedIconProps) {
  return (
    <motion.svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2.2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      whileHover='hover'
      initial='idle'
    >
      <motion.line
        x1='5'
        y1='12'
        x2='19'
        y2='12'
        variants={{
          idle: { x: 0 },
          hover: { x: [0, 4, 2], transition: { duration: 0.35, ease: 'easeOut' } },
        }}
      />
      <motion.polyline
        points='12 5 19 12 12 19'
        variants={{
          idle: { x: 0 },
          hover: { x: [0, 4, 2], transition: { duration: 0.35, ease: 'easeOut' } },
        }}
      />
    </motion.svg>
  )
}
