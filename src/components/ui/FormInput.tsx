import type { InputHTMLAttributes, ReactNode } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
}

export default function FormInput({
  label,
  icon,
  id,
  className = "",
  ...rest
}: FormInputProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-800 dark:text-[#ECE9E4] mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#85808C] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={`w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#232227] ${
            icon ? "pl-10" : "pl-4"
          } pr-4 py-2.5 text-[15px] text-gray-900 dark:text-[#ECE9E4] placeholder-gray-400 dark:placeholder-[#5E5A64] outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 transition`}
          {...rest}
        />
      </div>
    </div>
  );
}