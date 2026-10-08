export default function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className='rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#1A191C] p-5'>
      <p className='text-sm text-gray-500 dark:text-[#A29FA8]'>{label}</p>
      <p className='mt-2 text-3xl font-bold text-gray-900 dark:text-[#ECE9E4]'>{value}</p>
    </div>
  )
}
