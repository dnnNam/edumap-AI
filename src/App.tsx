import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import './App.css'
import router from './routes/configRoutes'
function App() {
  return (
    <SkeletonTheme baseColor='#f3f4f6' highlightColor='#e5e7eb'>
      <Toaster position='top-right' richColors />

      <RouterProvider router={router} />
    </SkeletonTheme>
  )
}

export default App
