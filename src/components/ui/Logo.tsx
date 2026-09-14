import { Sparkles } from "lucide-react";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="w-9 h-9 rounded-lg bg-[#14142B] flex items-center justify-center shrink-0">
        <Sparkles className="text-white" size={18} />
      </div>
      <span className="text-[15px] font-semibold text-gray-900">EduMap AI</span>
    </div>
  );
}