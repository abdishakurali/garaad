'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigationItems = [
    {
        name: 'Bandhiga',
        href: '/dashboard',
    },
    {
        name: 'Koorsooyinka',
        href: '/courses',
    },
];

export function MainNav() {
    const pathname = usePathname();

    return (
        <nav className="flex items-center space-x-4 lg:space-x-6">
            {navigationItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        'inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary',
                        pathname === item.href
                            ? 'text-primary'
                            : 'text-muted-foreground'
                    )}
                >
                    {item.name}
                    {item.href === '/courses' && (
                        <span
                            className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400"
                            title="Bilaash"
                        >
                            Bilaash
                        </span>
                    )}
                </Link>
            ))}
        </nav>
    );
} 