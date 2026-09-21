export default function ToggleSwitch({ checked, label }: { checked: boolean; label: string }) {
  return (
    <span
      role='switch'
      aria-checked={checked}
      aria-readonly
      aria-label={label}
      className={`relative w-11 h-6 shrink-0 rounded-full ${checked ? 'bg-indigo-600' : 'bg-gray-200'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </span>
  )
}
