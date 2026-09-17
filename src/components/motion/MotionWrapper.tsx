import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { FADE_UP, STAGGER_CONTAINER, STAGGER_ITEM } from '../../config/motionConfig'

interface MotionWrapperProps {
  children: ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  id?: string
  style?: React.CSSProperties
}

/**
 * Bọc quanh 1 phần tử BẤT KỲ (tiêu đề, đoạn văn, 1 card đơn lẻ...) để nó
 * fade + trượt lên đúng lúc phần tử đó cuộn vào khung nhìn.
 * Đây là component DUY NHẤT dùng cho hiệu ứng "cuộn tới đâu hiện tới đó" trong toàn app.
 */
export function MotionFadeIn({ children, className = '', onClick, id, style }: MotionWrapperProps) {
  return (
    <motion.div className={className} {...FADE_UP} onClick={onClick} id={id} style={style}>
      {children}
    </motion.div>
  )
}

/**
 * Bọc quanh 1 danh sách (grid feature cards, testimonials, pricing...).
 * Chỉ có nhiệm vụ "phát lệnh" stagger cho các MotionStaggerItem bên trong nó —
 * khi container này cuộn vào khung nhìn, nó ra lệnh cho từng item con lần lượt hiện lên.
 */
export function MotionStaggerContainer({ children, className = '', onClick, id, style }: MotionWrapperProps) {
  return (
    <motion.div className={className} {...STAGGER_CONTAINER} onClick={onClick} id={id} style={style}>
      {children}
    </motion.div>
  )
}

/**
 * Từng phần tử con BÊN TRONG MotionStaggerContainer.
 * PHẢI nằm trực tiếp bên trong 1 MotionStaggerContainer thì mới nhận được
 * tín hiệu "hidden -> visible" từ cha. Nhận thêm onClick/id/... để dùng được
 * cho cả những card có tương tác (như pricing card).
 */
export function MotionStaggerItem({ children, className = '', onClick, id, style }: MotionWrapperProps) {
  return (
    <motion.div className={className} {...STAGGER_ITEM} onClick={onClick} id={id} style={style}>
      {children}
    </motion.div>
  )
}
