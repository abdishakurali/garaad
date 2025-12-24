"use client";


export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Minimalist G mark or dot */}
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
