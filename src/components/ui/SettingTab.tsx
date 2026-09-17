export interface SettingsTab<T extends string = string> {
  key: T
  label: string
}

interface SettingsTabsProps<T extends string> {
  tabs: SettingsTab<T>[]
  activeTab: T
  onChange: (key: T) => void
  className?: string
}

export default function SettingsTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className = '',
}: SettingsTabsProps<T>) {
  return (
    <div className={`inline-flex items-center gap-1 rounded-xl bg-gray-100 p-1 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type='button'
          onClick={() => onChange(tab.key)}
          aria-current={activeTab === tab.key ? 'page' : undefined}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
