import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Koorsooyinka | Garaad STEM',
    description: 'Baadh koorsooyinkayaga xisaabta, fiisigiska, iyo coding-ka oo ku baro afkaaga hooyo.',
};

export default function CoursesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
