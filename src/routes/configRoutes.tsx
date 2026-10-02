import { createBrowserRouter } from 'react-router'

import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

import ChatPage from '../pages/main/ChatPage'
import DashBoard from '../pages/main/DashBoard'

import AppLayouts from '../layout/AppLayouts'

import HomeEntry from '../pages/auth/HomeEntry'
import AdminPermissionsPage from '../pages/main/AdminPermissionPage'
import SubscriptionPlans from '../pages/main/BillingPage'
import BillingUsagePage from '../pages/main/BillingUsagePage'
import JobsPage from '../pages/main/JobsPage'
import NotificationsPage from '../pages/main/NotificationPage'
import ProfilePage from '../pages/main/ProfilePage'
import ResourceDetailPage from '../pages/main/ResourceDetailPage'
import ResourceHistoryPage from '../pages/main/ResourceHistory'
import ResourcesPage from '../pages/main/ResourcesPage'
import SettingsPage from '../pages/main/SettingPage'
import SkillResourcesPage from '../pages/main/SkillResourcesPage'
import SkillTreePage from '../pages/main/SkillTree'
import UploadPage from '../pages/main/UploadAndAnalyze'
import AdminRoute from './AdminRoute'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoutes'
import PortfolioPage from '../pages/main/PortfolioPage'
import PortfolioPublicPage from '../pages/main/PublicPortfolioPage'
import AdminSkillsPage from '../pages/admin/AdminSkill'

const router = createBrowserRouter([
  {
    Component: PublicRoute,
    path: '/',
    children: [
      { index: true, Component: HomeEntry },
      { path: '/login', Component: LoginPage },
      { path: '/register', Component: RegisterPage },
      { path: '/portfolio/:username', Component: PortfolioPublicPage },
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
          { path: '/notifications', Component: NotificationsPage },
          { path: '/subscription', Component: SubscriptionPlans },
          { path: '/usage', Component: BillingUsagePage },
          { path: '/resources', Component: ResourcesPage },
          { path: '/resources/history', Component: ResourceHistoryPage },
          { path: '/resources/:skillId', Component: SkillResourcesPage },
          { path: '/resources/detail/:resourceId', Component: ResourceDetailPage },
          { path: '/jobs', Component: JobsPage },
          { path: '/portfolio', Component: PortfolioPage },
          {
            Component: AdminRoute, // gác thêm 1 lớp checkRole trước khi vào /admin
            children: [
              { path: '/admin', Component: AdminPermissionsPage },
              { path: 'admin/skills', element: <AdminSkillsPage /> },
            ],
          },
        ],
      },
    ],
  },
])

export default router
