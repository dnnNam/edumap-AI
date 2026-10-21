import { useLocation, useOutlet } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'

export default function AnimatedOutlet() {
  const location = useLocation()
  const element = useOutlet()

  return (
    <AnimatePresence mode='wait' initial={true}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className='h-full w-full'
      >
        {element}
      </motion.div>
    </AnimatePresence>
  )
}
