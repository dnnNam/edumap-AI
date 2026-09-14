import { Search, Bell, Sparkles, ChevronRight } from "lucide-react";

export default function AppHeader({
  logoText = "EduMap AI",
  badgeText = "Demo",
  breadcrumbs = ["Home", "Chat"],
  userName = "Alex Johnson",
  userPlan = "Free plan",
  notificationCount = 7,
}) {
  return (
    <header className="w-full h-16 shrink-0 bg-white border-b border-gray-200 flex items-stretch">
      {/* Left: Logo block — fixed width w-60, matches AppAside width so both columns align */}
      <div className="w-60 shrink-0 flex items-center gap-2 px-5">
        <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-gray-900 text-base">{logoText}</span>
        <span className="text-xs text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5">
          {badgeText}
        </span>
      </div>

      {/* Right: Breadcrumb + Search + Notifications + Profile */}
      <div className="flex-1 flex items-center justify-between px-6 min-w-0">
        <nav className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500">
          {breadcrumbs.map((crumb, i) => (
            <div key={crumb} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-300" />}
              <span className={i === breadcrumbs.length - 1 ? "text-gray-900" : ""}>
                {crumb}
              </span>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 w-64 h-9 rounded-lg bg-gray-50 border border-gray-200 px-3 text-gray-400 focus-within:border-gray-300">
            <Search className="w-4 h-4 shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full"
            />
          </div>

          <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors">
            <Bell className="w-5 h-5 text-gray-500" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
            )}
          </button>

          <button className="flex items-center gap-2.5 pl-1">
            <img
              src="https://i.pravatar.cc/64?img=12"
              alt={userName}
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-sm font-medium text-gray-900">{userName}</span>
              <span className="text-xs text-gray-500">{userPlan}</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}