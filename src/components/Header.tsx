"use client";

import Link from "next/link";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/features/authSlice";
import { ProfileDropdown } from "./layout/ProfileDropdown";
import { usePathname } from "next/navigation";
import { FolderDot } from "lucide-react";
import clsx from "clsx";

export function Header() {
  const user = useSelector(selectCurrentUser);
  const pathname = usePathname();

  const navLinks = [
    { name: "Koorsooyinka", href: "/courses", icon: FolderDot },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="items-center gap-6 flex">
          <Link
            href="/"
            className="text-2xl font-semibold tracking-tight text-black font-[fkGrotesk,Fallback] md:text-3xl md:flex"
          >
            Garaad
          </Link>

          {user && (
            <nav className="flex items-center gap-6">
              {navLinks.map(({ name, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "text-gray-600 hover:text-black transition-all font-medium flex items-center gap-2 py-1",
                    (pathname === href || pathname.startsWith(`${href}/`)) &&
                      "text-primary border-b-2 border-primary"
                  )}
                >
                  {/* icon */}
                  <span className="w-4 h-4">
                    {Icon && <Icon className="w-4 h-4" />}
                  </span>
                  {name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? <ProfileDropdown /> : <AuthDialog />}
        </div>
      </div>
    </header>
  );
}
