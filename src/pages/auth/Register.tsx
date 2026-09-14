import { useState } from "react";
import Logo from "../../components/ui/Logo";
import FormInput from "../../components/ui/FormInput";
import FormSelect from "../../components/ui/FormSelect";
import PrimaryButton from "../../components/ui/PrimaryButton";
import StatCard from "../../components/ui/StatCard";

const MAJORS = [
  "Computer Science",
  "Data Science",
  "Business",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Other",
];

const YEARS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("Alex");
  const [lastName, setLastName] = useState("Johnson");
  const [school, setSchool] = useState("MIT");
  const [major, setMajor] = useState("Computer Science");
  const [year, setYear] = useState("Junior");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    // Demo mode
    setTimeout(() => setSubmitting(false), 800);
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left panel: the form */}
      <div className="flex flex-1 md:w-1/2 flex-col px-6 md:px-16 py-12">
        <Logo />

        <div className="w-full max-w-md mt-10">
          <h2 className="text-[26px] font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-1.5 text-gray-500 text-[15px]">
            90-second setup. Free forever for students.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                id="firstName"
                label="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Alex"
              />
              <FormInput
                id="lastName"
                label="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Johnson"
              />
            </div>

            <FormInput
              id="school"
              label="School"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="MIT"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                id="major"
                label="Major"
                options={MAJORS}
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              />
              <FormSelect
                id="year"
                label="Year"
                options={YEARS}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            <FormInput
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <FormInput
                id="confirmPassword"
                label="Confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <PrimaryButton
              type="submit"
              loading={submitting}
              loadingText="Creating account..."
            >
              Create account
            </PrimaryButton>

            <p className="text-center text-xs text-gray-400">
              By signing up you agree to our{" "}
              <a href="#" className="underline hover:text-gray-600">
                Terms
              </a>{" "}
              &{" "}
              <a href="#" className="underline hover:text-gray-600">
                Privacy
              </a>
              .
            </p>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="#" className="font-medium text-gray-900 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>

      {/* Right panel: marketing content */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between bg-[#FAFAF9] px-16 py-12 border-l border-gray-200">
        <div />

        <div className="max-w-lg self-end text-right">
          <h1 className="text-[40px] leading-[1.15] font-bold text-gray-900 tracking-tight">
            Map your career.
            <br />
            In under a minute.
          </h1>
          <p className="mt-5 text-gray-500 text-[15px] leading-relaxed">
            Get a personalized roadmap, skill tree and job matches the moment
            you sign up.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatCard value="120K+" label="Students" className="text-center" />
          <StatCard value="412" label="Schools" className="text-center" />
          <StatCard value="4.9★" label="Rating" className="text-center" />
        </div>
      </div>
    </div>
  );
}