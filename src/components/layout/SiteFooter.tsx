import Link from "next/link";

const footerLinks = [
  { href: "/courses", label: "Koorsooyinka" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/feedback", label: "Aragtida ardayda" },
  { href: "/about", label: "Ku saabsan" },
  { href: "/privacy", label: "Arrimaha Khaaska ah" },
  { href: "/terms", label: "Shuruudaha" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Garaad</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              STEM iyo Full-Stack — ku baro af Somali.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 border-t border-border pt-8 text-center text-xs text-muted-foreground md:text-left">
          © {year} Garaad. Xuquuqda oo dhan waa dhowran tahay.
        </p>
      </div>
    </footer>
  );
}
