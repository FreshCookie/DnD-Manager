import React from "react";
import { BookOpen, Users, Info } from "lucide-react";

export default function AboutSection({ about }) {
  if (!about || (!about.story && !about.playStyle && !about.schedule)) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Story */}
        {about.story && (
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl font-bold text-white">Die Geschichte</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">{about.story}</p>
          </div>
        )}

        {/* Play Style */}
        {about.playStyle && (
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Spielstil</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">{about.playStyle}</p>
          </div>
        )}

        {/* Schedule */}
        {about.schedule && (
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">Spielzeiten</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">{about.schedule}</p>
          </div>
        )}
      </div>
    </section>
  );
}
