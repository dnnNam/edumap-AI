
import { RouterProvider } from 'react-router'
import './App.css'
import router from './routes/configRoutes'
import { Toaster } from "sonner";

function App() {

  return (
    <>
        <Toaster />
         <RouterProvider router={router} />
    </>
  )
}

export default App
