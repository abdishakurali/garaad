import { Timeline } from "./Timeline";

export function LearnAnimation() {
  return (
    <div className="relative mt-8 mb-4">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20.5 50A29.5 29.5 0 0 1 50 20.5M50 79.5A29.5 29.5 0 0 1 79.5 50' stroke='%23000' fill='none' /%3E%3C/svg%3E")`,
          backgroundSize: '50px 50px'
        }}
      />
      < div
        className="relative"

      >
        <div className="flex flex-col items-center justify-center gap-8">
          < div
            className="relative max-w-3xl mx-auto backdrop-blur-sm p-8 rounded-2xl"

          >
            <Timeline />
          </ div>
        </div>
      </ div>
    </div>
  );
}
