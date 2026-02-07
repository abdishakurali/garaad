import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
    }),
    useSearchParams: () => ({
        get: vi.fn(),
    }),
    usePathname: () => '',
}));

// Mock Sound Manager
vi.mock('@/hooks/use-sound-effects', () => ({
    useSoundManager: () => ({
        playSound: vi.fn(),
    }),
}));
