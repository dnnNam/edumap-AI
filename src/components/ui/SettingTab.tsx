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
    <div className={`inline-flex items-center gap-1 rounded-xl bg-gray-100 dark:bg-[#1A191C] border border-transparent dark:border-white/[0.08] p-1 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type='button'
          onClick={() => onChange(tab.key)}
          aria-current={activeTab === tab.key ? 'page' : undefined}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            activeTab === tab.key
              ? 'bg-white dark:bg-[#232227] text-gray-900 dark:text-[#ECE9E4] shadow-sm'
              : 'text-gray-500 dark:text-[#A29FA8] hover:text-gray-800 dark:hover:text-[#ECE9E4]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
