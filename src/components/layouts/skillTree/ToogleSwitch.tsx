export default function ToggleSwitch({
  checked,
  label,
  onChange,
  disabled = false,
}: {
  checked: boolean
  label: string
  onChange?: () => void
  disabled?: boolean
}) {
  return (
    <button
      type='button'
      role='switch'
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative w-11 h-6 shrink-0 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
        checked ? 'bg-indigo-600 dark:bg-[#5F2CFF]' : 'bg-gray-200 dark:bg-white/20'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-[#ECE9E4] shadow-sm transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
