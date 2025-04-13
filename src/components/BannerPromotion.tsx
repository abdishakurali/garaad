import { MiniTimeline } from "./MiniTimeline";

export function BannerPromotion() {
  return (
    <div className="bg-[#000000] text-white py-3 px-4">
      <div className="container mx-auto flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-[#34A853] rounded-full px-4 py-1">
            <span className="font-bold">30% OFF</span>
          </div>
          <div
            className="text-lg"
          >
            <span className="text-[#34A853]">
              Qiimo dhimis weyn{" "}
              Waxaad keydisaa 30% inta lagu jiro iibka Cyber Monday
            </span>
          </div>
        </div>
        <div
          className="flex-shrink-0"
        >
          <MiniTimeline />
        </div>
      </div>
    </div>
  );
}
