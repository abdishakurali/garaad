"use client"
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import Image from 'next/image';

const courses = [
  {
    title: "Xisaabta Aasaasiga - Heerka 1",
    image: "/images/math-course.jpg",
    enrolled: "12k+ arday ayaa is diiwaangeliyey",
  },
  {
    title: "Fikradaha Cilmiga - Heerka 2",
    image: "/images/scientific-thinking.jpg",
    enrolled: "12k+ arday ayaa is diiwaangeliyey",
  },
];

const StreakSection = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <h3 className="text-lg font-semibold mb-4">Maalintaada</h3>
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-2xl font-bold text-primary">7</span>
      </div>
      <div>
        <p className="text-gray-600">Maalmo isku xiga</p>
        <p className="text-sm text-gray-500">Ugu badnaan: 14 maalmood</p>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Guriga</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <StreakSection />
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Waxbarashadaada</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Xisaabta Aasaasiga</span>
                      <span className="text-sm text-gray-500">45%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-primary h-full rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Fikradaha Cilmiga</span>
                      <span className="text-sm text-gray-500">30%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-primary h-full rounded-full" style={{ width: '30%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">Koorsooyinka aad diiwaangelisay</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <Link
                  key={index}
                  href="/courses/math/basic-math"
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.enrolled}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

