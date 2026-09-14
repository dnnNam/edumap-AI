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
        className="block text-sm font-medium text-gray-800 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={`w-full rounded-xl border border-gray-200 ${
            icon ? "pl-10" : "pl-4"
          } pr-4 py-2.5 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition`}
          {...rest}
        />
      </div>
    </div>
  );
}