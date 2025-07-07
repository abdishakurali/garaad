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
    {
        name: 'Horumarinta',
        href: '/progress',
    },
    {
        name: 'Kuwa Horreysa',
        href: '/leaderboard',
    },
    {
        name: 'Abaalmarinta',
        href: '/rewards',
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
                        'text-sm font-medium transition-colors hover:text-primary',
                        pathname === item.href
                            ? 'text-primary'
                            : 'text-muted-foreground'
                    )}
                >
                    {item.name}
                </Link>
            ))}
        </nav>
    );
} 