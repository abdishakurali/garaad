'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
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

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md hover:bg-gray-100"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {isOpen && (
                <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg">
                    <nav className="flex flex-col space-y-2 p-4">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                                    pathname === item.href
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-gray-100'
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </div>
    );
} 