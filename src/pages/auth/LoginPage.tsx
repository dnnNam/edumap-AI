import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Logo from "../../components/ui/Logo";
import StatCard from "../../components/ui/StatCard";
import FormInput from "../../components/ui/FormInput";
import PrimaryButton from "../../components/ui/PrimaryButton";



export default function LoginPage() {
  const [email, setEmail] = useState("alex@university.edu");
  const [password, setPassword] = useState("password");
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    // Demo mode: any email + password works
    setTimeout(() => setSubmitting(false), 800);
  };

  return (
     <div className="min-h-screen w-full flex bg-white">
      {/* Left panel */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between bg-[#FAFAF9] px-16 py-12 border-r border-gray-200">
        <Logo />
 
        <div className="max-w-md">
          <h1 className="text-[40px] leading-[1.15] font-bold text-gray-900 tracking-tight">
            Welcome back.
            <br />
            Your roadmap awaits.
          </h1>
          <p className="mt-5 text-gray-500 text-[15px] leading-relaxed">
            Your skill tree grew while you were gone — 3 new gaps closed, 2 jobs
            matched.
          </p>
 
          <div className="mt-8 grid grid-cols-2 gap-4">
            <StatCard value="+247 XP" label="Earned this week" />
            <StatCard value="94%" label="Stripe match" />
          </div>
        </div>
 
        <div className="text-sm text-gray-400">
          © EduMap AI — 120K students mentored
        </div>
      </div>
 
      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h2 className="text-[26px] font-bold text-gray-900">Sign in</h2>
          <p className="mt-1.5 text-gray-500 text-[15px]">
            Welcome back to your AI mentor
          </p>
 
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <FormInput
              id="email"
              label="Email"
              type="email"
              icon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@university.edu"
            />
 
            <FormInput
              id="password"
              label="Password"
              type="password"
              icon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
 
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none text-gray-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Remember me
              </label>
              <a href="#" className="text-gray-500 hover:text-gray-800 transition">
                Forgot password?
              </a>
            </div>
 
            <PrimaryButton type="submit" loading={submitting} loadingText="Signing in...">
              Sign in
            </PrimaryButton>
 
            <p className="text-center text-xs text-gray-400">
              Demo mode · use any email + password
            </p>
          </form>
 
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs tracking-wide text-gray-400">
              OR CONTINUE WITH
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
 
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 transition"
            >
              <FcGoogle size={18} />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 transition"
            >
              <FaGithub size={18} />
              GitHub
            </button>
          </div>
 
          <p className="mt-6 text-center text-sm text-gray-500">
            No account?{" "}
            <a href="#" className="font-medium text-gray-900 hover:underline">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}