import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export default function FormSelect({
  label,
  options,
  id,
  className = "",
  ...rest
}: FormSelectProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-800 dark:text-[#ECE9E4] mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className="w-full appearance-none rounded-xl border border-gray-200 dark:border-white/10 pl-4 pr-10 py-2.5 text-[15px] text-gray-900 dark:text-[#ECE9E4] outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 transition bg-white dark:bg-[#232227] cursor-pointer"
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-white dark:bg-[#232227] text-gray-900 dark:text-[#ECE9E4]">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#85808C] pointer-events-none" />
      </div>
    </div>
  );
}