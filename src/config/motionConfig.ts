// config/motionConfig.ts

// Easing DUY NHẤT dùng cho toàn app — không định nghĩa easing ở file nào khác
const EASE = [0.22, 1, 0.36, 1] as const

// Thời lượng DUY NHẤT dùng cho toàn app
const DURATION = 0.3

// PAGE_TRANSITION — dùng khi CHUYỂN TRANG (route A -> route B)
// Chỉ dùng trong AnimatedOutlet.tsx

export const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: DURATION, ease: EASE },
}

// FADE_UP — dùng cho TỪNG SECTION khi CUỘN vào khung nhìn

export const FADE_UP = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: DURATION, ease: EASE },
}

// STAGGER_CONTAINER — bọc quanh 1 danh sách/grid

export const STAGGER_CONTAINER = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.2 },
  variants: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 },
    },
  },
}

// STAGGER_ITEM — dùng cho từng phần tử con bên trong STAGGER_CONTAINER
// KHÔNG có initial/whileInView riêng — nó ăn theo trạng thái hidden/visible
// được STAGGER_CONTAINER cha phát ra

export const STAGGER_ITEM = {
  variants: {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION, ease: EASE },
    },
  },
}

// LIST_ITEM — dùng khi THÊM / XÓA 1 dòng trong danh sách động (vd: form field array)
// Animate height để các phần tử bên dưới trượt xuống/lên mượt thay vì nhảy cục.
// Dùng kèm <AnimatePresence initial={false}>, đặt padding ở phần tử con (không đặt trên chính nó)

export const LIST_ITEM = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
  transition: { duration: DURATION, ease: EASE },
}
