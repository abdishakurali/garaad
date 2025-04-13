import Link from 'next/link';
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/features/authSlice';
import { Button } from './ui/button';
import { ProfileDropdown } from './layout/ProfileDropdown';
import { usePathname } from 'next/navigation';

export function Header() {
  const user = useSelector(selectCurrentUser);
  const isPremium = user?.subscription_status === 'premium';
  const pathname = usePathname();

  return (
    <header className="border-b bg-white  ">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="font-bold text-xl">
            <Link href="/">Garaad</Link>
          </div>
          {user && (
            <nav className="hidden ml-5 md:flex items-center space-x-6">
              <Link href="/dashboard" className={`flex items-center text-gray-600 hover:text-gray-900 ${pathname === '/dashboard' ? 'border-b-2 border-blue-500' : ''}`}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Guriga
              </Link>
              <Link href="/courses" className={`flex items-center text-gray-600 hover:text-gray-900 ${pathname === '/courses' ? 'border-b-2 border-blue-500' : ''}`}>
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
              {!isPremium && (
                <Link href="/premium">
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    Go Premium
                  </Button>
                </Link>
              )}
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
