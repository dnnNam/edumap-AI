import Logo from "../ui/Logo";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" }
];

interface HeaderProps {
  onSignIn?: () => void;
  onGetStarted?: () => void;
}

export default function PublicHeader({ onSignIn, onGetStarted }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF9]/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[15px] text-gray-500 hover:text-gray-900 transition"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={onSignIn}
            className="text-[15px] text-gray-900 hover:text-gray-600 transition"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={onGetStarted}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[15px] font-medium px-4 py-2 transition"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  );
}