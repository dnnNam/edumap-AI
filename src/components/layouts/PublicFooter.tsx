import Logo from "../ui/Logo";
import {
  FaTwitter,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

const SOCIALS = [
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaGithub, href: "https://github.com", label: "GitHub" },
  { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

const COLUMNS: { title: string; links: string[] }[] = [
  { title: "Product", links: ["Features", "Pricing", "Roadmap", "Changelog"] },
  { title: "Company", links: ["About", "Careers", "Blog", "Press"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
];

export default function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#FAFAF9] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12">
          <div>
            <Logo />
            <p className="mt-4 text-[15px] text-gray-500 leading-relaxed max-w-xs">
              Your AI-powered career mentor. Built for the next generation of
              engineers.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-300 transition"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-gray-900">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[15px] text-gray-500 hover:text-gray-900 transition"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-gray-200 text-center text-sm text-gray-400">
          © {year} EduMap AI · Crafted with intent in San Francisco
        </div>
      </div>
    </footer>
  );
}