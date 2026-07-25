import React from "react";
import { Shield } from "lucide-react";

export default function Banner({ siteInfo }) {
  return (
    <div className="relative h-96 overflow-hidden">
      {/* Background Image */}
      {siteInfo.bannerImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${siteInfo.bannerImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-gray-900"></div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
          <div className="absolute inset-0 bg-[url('/images/fantasy-pattern.png')] opacity-10"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <div className="flex items-center justify-center mb-6">
          <Shield className="w-20 h-20 text-amber-500" />
        </div>
        <h1 className="text-7xl font-bold text-white mb-4 font-serif tracking-wide drop-shadow-2xl">
          {siteInfo.title}
        </h1>
        {siteInfo.description && (
          <p className="text-2xl text-amber-300 font-semibold drop-shadow-lg">
            {siteInfo.description}
          </p>
        )}
      </div>

      {/* Decorative Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
    </div>
  );
}
