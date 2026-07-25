import React from "react";
import { Calendar, User, MapPin, ChevronRight } from "lucide-react";

export default function CampaignCard({ campaign, onClick }) {
  const sessionCount = campaign.sessions?.length || 0;
  const latestSession = campaign.sessions?.[0];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg overflow-hidden border border-purple-500/20 hover:border-amber-500/50 transition-all cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl group"
    >
      {/* Campaign Image/Header */}
      {campaign.image ? (
        <div
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${campaign.image})` }}
        >
          <div className="h-full bg-gradient-to-t from-gray-900 to-transparent flex items-end p-6">
            <h3 className="text-2xl font-bold text-white font-serif">
              {campaign.title}
            </h3>
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-purple-900 to-gray-900 flex items-center justify-center p-6">
          <h3 className="text-3xl font-bold text-white font-serif text-center">
            {campaign.title}
          </h3>
        </div>
      )}

      {/* Campaign Info */}
      <div className="p-6 space-y-4">
        {/* GM Info */}
        <div className="flex items-center gap-2 text-amber-400">
          <User className="w-4 h-4" />
          <span className="font-semibold">{campaign.gmName}</span>
        </div>

        {/* Description */}
        {campaign.description && (
          <p className="text-gray-300 line-clamp-3 leading-relaxed">
            {campaign.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{sessionCount} Sessions</span>
            </div>
            {campaign.setting && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{campaign.setting}</span>
              </div>
            )}
          </div>

          {/* Status Badge */}
          {campaign.status === "active" && (
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
              Aktiv
            </span>
          )}
        </div>

        {/* Latest Session */}
        {latestSession && (
          <div className="pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 mb-1">Letzte Session:</p>
            <p className="text-sm text-gray-300 font-semibold">
              {latestSession.title}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(latestSession.date)}
            </p>
          </div>
        )}

        {/* View Details Button */}
        <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all group-hover:shadow-lg">
          Details anzeigen
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
