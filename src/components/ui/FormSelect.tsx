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
        className="block text-sm font-medium text-gray-800 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className="w-full appearance-none rounded-xl border border-gray-200 pl-4 pr-10 py-2.5 text-[15px] text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition bg-white"
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}