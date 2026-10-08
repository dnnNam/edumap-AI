interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export default function StatCard({ value, label, className = "" }: StatCardProps) {
  return (
    <div
      className={`bg-white dark:bg-[#1A191C] border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 transition-colors ${className}`}
    >
      <div className="text-2xl font-bold text-gray-900 dark:text-[#ECE9E4]">{value}</div>
      <div className="text-sm text-gray-500 dark:text-[#A29FA8] mt-1">{label}</div>
    </div>
  );
}