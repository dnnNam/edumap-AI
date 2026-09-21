import { ALL_CATEGORIES } from '../../../utils/skillTree'

export default function CategoryFilter({
  categories,
  active,
  onChange,
}: {
  categories: string[]
  active: string
  onChange: (category: string) => void
}) {
  const options = [ALL_CATEGORIES, ...categories]

  return (
    <div className='flex flex-wrap gap-2' role='group' aria-label='Filter by category'>
      {options.map((category) => {
        const isActive = active === category
        return (
          <button
            key={category}
            type='button'
            onClick={() => onChange(category)}
            aria-pressed={isActive}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-gray-200 bg-white text-gray-900 shadow-sm hover:bg-gray-50'
            }`}
          >
            {category === ALL_CATEGORIES ? 'All' : category}
          </button>
        )
      })}
    </div>
  )
}
