import { createBrowserRouter } from "react-router"
import HomePage from "../pages/auth/HomePage"
import LoginPage from "../pages/auth/LoginPage"
import DashBoard from "../pages/main/DashBoard"
import RegisterPage from "../pages/auth/Register"
import AppLayouts from "../layout/AppLayouts"
import ChatPage from "../pages/main/ChatPage"



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
  },

  {
     Component: AppLayouts,
    children: [
      {
        path: "/dashboard",
        Component: DashBoard,
      },
      {
        path: "/chat",
        Component: ChatPage,
      },
    ],
  }
])

export default router