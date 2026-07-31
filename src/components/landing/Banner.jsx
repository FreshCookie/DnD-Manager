import React from "react";

export default function Banner({ siteInfo }) {
  const bannerSrc = siteInfo.bannerImage || "/images/wietzendorf_landnerds_banner_panorama.png";

  return (
    <div className="relative overflow-hidden h-[26vh] min-h-[220px] max-h-[420px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bannerSrc})`, backgroundColor: '#111827' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-gray-900"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <div className="flex items-center justify-center mb-3 md:mb-6">
          <img
            src="/images/wietzendorf_landnerds_icon.png"
            alt="Wietzendorf Landnerds"
            className="w-12 h-12 md:w-20 md:h-20"
            style={{ background: "transparent", mixBlendMode: "multiply", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.8))" }}
          />
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-2 md:mb-4 font-serif tracking-wide drop-shadow-2xl">
          {siteInfo.title}
        </h1>
        {siteInfo.description && (
          <p className="text-xs sm:text-base md:text-2xl text-amber-300 font-semibold drop-shadow-lg">
            {siteInfo.description}
          </p>
        )}
      </div>

      {/* Decorative Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
    </div>
  );
}
