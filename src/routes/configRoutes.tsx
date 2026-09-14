import { createBrowserRouter } from "react-router"
import HomePage from "../pages/auth/HomePage"
import LoginPage from "../pages/auth/LoginPage"
import DashBoard from "../pages/main/DashBoard"
import RegisterPage from "../pages/auth/Register"



const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/dashboard",
    Component: DashBoard,
  },
  {path: "/register",
    Component: RegisterPage
  }
])

export default router