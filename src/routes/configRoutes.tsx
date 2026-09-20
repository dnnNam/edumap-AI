import { createBrowserRouter } from 'react-router'

import HomePage from '../pages/auth/HomePage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

import DashBoard from '../pages/main/DashBoard'
import ChatPage from '../pages/main/ChatPage'

import AppLayouts from '../layout/AppLayouts'

import PublicRoute from './PublicRoutes'
import ProtectedRoute from './ProtectedRoute'
import ProfilePage from '../pages/main/ProfilePage'
import SettingsPage from '../pages/main/SettingPage'
import AdminRoute from './AdminRoute'
import AdminPermissionsPage from '../pages/main/AdminPermissionPage'
import UploadPage from '../pages/main/UploadAndAnalyze'
import SkillTreePage from '../pages/main/SkillTree'

const router = createBrowserRouter([
  {
    Component: PublicRoute,
    path: '/',
    children: [
      { index: true, Component: HomePage },
      { path: '/login', Component: LoginPage },
      { path: '/register', Component: RegisterPage },
    ],
  },

  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayouts,
        children: [
          {
            path: '/dashboard',
            Component: DashBoard,
          },
          {
            path: '/chat',
            Component: ChatPage,
          },
          { path: '/profile', Component: ProfilePage },
          { path: '/settings', Component: SettingsPage },
          { path: '/upload', Component: UploadPage },
          { path: '/skill-tree', Component: SkillTreePage },
          {
            Component: AdminRoute, // gác thêm 1 lớp checkRole trước khi vào /admin
            children: [{ path: '/admin', Component: AdminPermissionsPage }],
          },
        ],
      },
    ],
  },
])

export default router
