import React from "react";
import { Calendar, MapPin, User } from "lucide-react";

export default function SessionList({ sessions }) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-12 text-center border border-purple-500/20">
        <p className="text-gray-400 text-lg">
          Noch keine Sessions vorhanden. Das Abenteuer beginnt bald!
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {sessions.map((session) => (
        <article
          key={session.id}
          className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all"
        >
          {/* Session Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 font-serif">
                {session.title}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {formatDate(session.date)}
                </div>
                {session.location && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {session.location}
                  </div>
                )}
                {session.author && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <User className="w-4 h-4" />
                    {session.author}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Session Summary */}
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {session.summary}
          </div>

          {/* Session Image */}
          {session.image && (
            <div className="mt-4">
              <img
                src={session.image}
                alt={session.title}
                className="rounded-lg w-full max-h-96 object-cover"
              />
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
