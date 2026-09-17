import { useLocation, useOutlet } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { PAGE_TRANSITION } from '../../config/motionConfig'

export default function AnimatedOutlet() {
  const location = useLocation()
  const element = useOutlet()

  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div key={location.pathname} {...PAGE_TRANSITION} className='h-full w-full'>
        {element}
      </motion.div>
    </AnimatePresence>
  )
}
