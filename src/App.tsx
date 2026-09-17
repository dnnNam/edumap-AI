import { RouterProvider } from 'react-router'
import './App.css'
import router from './routes/configRoutes'
import { Toaster } from 'sonner'
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
function App() {
  return (
    <SkeletonTheme baseColor='#f3f4f6' highlightColor='#e5e7eb'>
      <Toaster position='top-right' richColors />
      <RouterProvider router={router} />
    </SkeletonTheme>
  )
}

export default App
