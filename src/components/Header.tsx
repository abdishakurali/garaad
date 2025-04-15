import Link from 'next/link';
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/features/authSlice';
import { ProfileDropdown } from './layout/ProfileDropdown';
import { usePathname } from 'next/navigation';

export function Header() {
  const user = useSelector(selectCurrentUser);
  const pathname = usePathname();

  return (
    <header className="border-b bg-white  ">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="font-bold text-5xl">
            <Link href="/" className="font-[fkGrotesk,Fallback]   font-normal leading-4 text-black tracking-tight">Garaad</Link>
          </div>
          {user && (
            <nav className="hidden ml-5 md:flex items-center space-x-6">
              <Link href="/courses" className={`flex items-center py-3 text-gray-600 hover:text-gray-900 ${pathname === '/courses' ? 'border-b-2 border-primary' : ''}`}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Koorsooyinka
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>

              <ProfileDropdown />
            </>
          ) : (
            <AuthDialog
            />
          )}
        </div>
      </div>

    </header>
  );
}
