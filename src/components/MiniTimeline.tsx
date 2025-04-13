export function MiniTimeline() {
  return (
    <div className="relative w-[400px]">
      <svg
        className="w-full h-16"
        viewBox="0 0 800 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 50 H800"
          stroke="#4B5563"
          strokeWidth="2"
        />

        <circle
          cx="200"
          cy="50"
          r="10"
          fill="#7C3AED"
        />

        <circle
          cx="600"
          cy="50"
          r="10"
          fill="#34A853"
        />
      </svg>
    </div>
  );
}
