import React from "react";
import { ArrowLeft, Calendar, MapPin, User, Sword } from "lucide-react";
import SessionList from "./SessionList";

export default function CampaignDetailView({ campaign, onBack }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Zurück zur Übersicht</span>
        </button>
      </div>

      {/* Campaign Header */}
      <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg p-8 mb-8 border border-purple-500/20">
        <h1 className="text-5xl font-bold text-white mb-4 font-serif">
          {campaign.title}
        </h1>

        <div className="flex flex-wrap gap-6 text-gray-300 mb-6">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <span>
              <span className="text-gray-400">GM:</span>{" "}
              <span className="font-semibold text-amber-400">
                {campaign.gmName}
              </span>
            </span>
          </div>
          {campaign.setting && (
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-400" />
              <span>{campaign.setting}</span>
            </div>
          )}
          {campaign.startDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-400" />
              <span>Seit {formatDate(campaign.startDate)}</span>
            </div>
          )}
          {campaign.status === "active" && (
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
              Aktiv
            </span>
          )}
        </div>

        {campaign.description && (
          <p className="text-gray-300 text-lg leading-relaxed">
            {campaign.description}
          </p>
        )}

        {/* Session Manager Button - nur für MasterCookie */}
        {campaign.gmName === "MasterCookie" && (
          <div className="mt-6">
            <a
              href="/session"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl"
            >
              <Sword className="w-5 h-5" />
              Zum Session Manager
            </a>
          </div>
        )}
      </div>

      {/* Session List */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-6 font-serif">
          Session-Chronik
        </h2>
        <SessionList sessions={campaign.sessions || []} />
      </div>
    </div>
  );
}
