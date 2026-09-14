import { Outlet } from "react-router"
import AppAside from "../components/layouts/AppAside"
import AppHeader from "../components/layouts/AppHeader"

export default function AppLayouts() {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      {/* Header: full width, spans across both sidebar + content columns */}
      <AppHeader />

      {/* Below header: sidebar + content side by side */}
      <div className="flex flex-1 min-h-0">
        <AppAside />

        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}