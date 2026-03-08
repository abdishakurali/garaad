
import React from 'react';
import StackIcon from 'tech-stack-icons';
import { Cpu } from 'lucide-react';

interface TechIconProps {
    name: string;
    className?: string;
}

/**
 * Mapping of common names to tech-stack-icons keys
 * tech-stack-icons uses lowercase names usually
 */
const techToIconKey = (name: string): string => {
    const map: Record<string, string> = {
        'Next.js': 'nextjs',
        'React': 'react',

        'Tailwind CSS': 'tailwindcss',
        'Node.js': 'nodejs',
        'PostgreSQL': 'postgresql',
        'MongoDB': 'mongodb',
        'Python': 'python',
        'Django': 'django',
        'TypeScript': 'typescript',
        'JavaScript': 'js',
        'AWS': 'aws',
        'Vercel': 'vercel',
        'Docker': 'docker',
        'Firebase': 'firebase',
        'Supabase': 'supabase',
        'Stripe': 'stripe',
        'Notion': 'notion',
        'Flutter': 'flutter',
        'Swift': 'swift',
        'Kotlin': 'kotlin',
        'GraphQL': 'graphql',
        'Redis': 'redis',
        'Material UI': 'materialui',
        'Redux': 'redux',
    };
    return map[name] || name.toLowerCase().replace(/[\s.]/g, '');
};

// List of known available icons to prevent crashes
// In a real scenario, this would ideally come from the library types
const VALID_ICONS = [
    'react', 'nextjs', 'tailwindcss', 'nodejs', 'postgresql', 'mongodb',
    'python', 'django', 'typescript', 'js', 'aws', 'vercel', 'docker',
    'firebase', 'supabase', 'stripe', 'notion', 'flutter', 'swift', 'kotlin', 'graphql',
    'redis', 'materialui', 'redux', 'mysql', 'php', 'java', 'ruby',
    'rails', 'csharp', 'cpp', 'c', 'go', 'rust', 'docker', 'kubernetes'
];


export const TechIcon: React.FC<TechIconProps> = ({ name, className = "w-4 h-4" }) => {
    const iconName = techToIconKey(name);

    // Safeguard: check if icon exists in our known list or use fallback
    if (iconName && !VALID_ICONS.includes(iconName)) {
        return <Cpu className={className} />;
    }

    try {
        return (
            <div className={`${className} inline-flex items-center justify-center`} title={name}>
                <StackIcon name={iconName} className="w-full h-full" />
            </div>
        );
    } catch (e) {
        return <Cpu className={className} />;
    }

};

