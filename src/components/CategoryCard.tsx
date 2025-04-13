import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryCardProps {
    id: string;
    title: string;
    description: string;
    image: string;
    progress: boolean;
    courseCount: number;
}

const ProgressBadge = () => (
    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
        IN PROGRESS
    </span>
);

export const CategoryCard = ({ id, title, description, image, progress, courseCount }: CategoryCardProps) => {
    return (
        <Link href={`/categories/${id}/courses`}>
            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <div className="relative w-full h-48 mb-4">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover rounded"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-gray-600 mt-2 line-clamp-2">{description}</p>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">{courseCount} courses</span>
                    {progress && <ProgressBadge />}
                </div>
            </div>
        </Link>
    );
}; 