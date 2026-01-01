import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard | Garaad STEM',
    description: 'Maamul waxbarashadaada, la soco horumarkaaga, oo baro casharo kusub.',
};

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
