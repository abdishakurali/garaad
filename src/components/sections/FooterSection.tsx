import Link from "next/link";
import Logo from "@/components/ui/Logo";

export function FooterSection() {
  const navigation = {
    product: [
      { name: "Koorsooyin", href: "/courses" },
      { name: "Wargeys", href: "/wargeys" },
    ],
    company: [
      { name: "Nagu saabsan", href: "/about" },
      { name: "Shaqo", href: "#" },
    ],
    legal: [
      { name: "Shuruudaha Isticmaalka", href: "/terms" },
      { name: "Siyaasadda Sirta", href: "/privacy" },
    ],
    contact: [
      { name: "Info@garaad.org", href: "mailto:Info@garaad.org" },
      { name: "garaad.org", href: "http://garaad.org" },
    ],
  };

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo */}
          <div className="md:col-span-2 lg:col-span-1">
            <Logo
              width={160}
              height={48}
              className="h-10 w-auto sm:h-12 md:h-14 max-w-[120px] sm:max-w-[140px] md:max-w-[160px] brightness-0 invert"
              priority={false}
              loading="lazy"
            />
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:col-span-2 lg:col-span-3">
            <div>
              <h3 className="text-sm font-semibold">Alaabta</h3>
              <ul className="mt-6 flex flex-col gap-4 list-none p-0">
                {navigation.product.map((item) => (
                  <Link
                    href={item.href}
                    key={item.name}
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    {item.name}
                  </Link>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Shirkadda</h3>
              <ul className="mt-6 space-y-4 list-none p-0">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-300 hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Xiriir</h3>
              <ul className="mt-6 space-y-4 list-none p-0">
                {navigation.contact.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-300 hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className="mt-16 border-t border-gray-800 pt-10">
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-xs text-gray-400 hover:text-gray-300"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex gap-6 justify-center sm:justify-start">
              {/* Facebook */}
              <Link
                href="http://facebook.com/Garaadstem"
                className="text-gray-400 hover:text-gray-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>

              {/* Twitter/X */}
              <Link
                href="https://x.com/Garaadstem"
                className="text-gray-400 hover:text-gray-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>

              {/* LinkedIn */}
              <Link
                href="https://www.linkedin.com/company/garaad"
                className="text-gray-400 hover:text-gray-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
              </Link>

              {/* GitHub */}
              <Link
                href="https://github.com/Garaadorg"
                className="text-gray-400 hover:text-gray-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
            <p className="text-center sm:text-left">
              © Garaad, Org. Barnaamijku waa mid loogu talagalay dadka
              Soomaaliyeed, isagoo diiradda saaraya STEM.
            </p>
            <p className="font-medium text-gray-300">
              Made with love in somalia 😊
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
