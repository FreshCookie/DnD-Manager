import React, { useState } from "react";
import {
  BookOpen,
  Clock,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";
import { getStatusColor, getStatusLabel, formatTime } from "../utils/helpers";

const StoryCard = ({ story, theme, onClick, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusColor = getStatusColor(story.status);
  const statusLabel = getStatusLabel(story.status);

  const handleCardClick = () => {
    if (story.description) {
      setIsExpanded(!isExpanded);
    }
    onClick();
  };

  // Dynamische Schriftgröße basierend auf Titellänge
  const getTitleClass = () => {
    if (story.title.length > 30) return "text-lg";
    if (story.title.length > 20) return "text-xl";
    return "text-2xl";
  };

  return (
    <div
      onClick={handleCardClick}
      className={`${theme.cardBg} ${theme.border} border-2 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer hover:scale-105 group relative overflow-hidden w-full`}
    >
      {/* Story Bild wenn vorhanden */}
      {story.image && (
        <img
          src={story.image}
          alt={story.title}
          className="w-full h-32 object-cover rounded-lg mb-4"
          onError={(e) => (e.target.style.display = "none")}
        />
      )}

      <div className="flex items-start justify-between mb-4 gap-2 flex-wrap">
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          <BookOpen
            className={`${theme.accent} w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-1`}
          />
          <h3
            className={`${theme.text} ${getTitleClass()} font-bold break-words`}
          >
            {story.title}
          </h3>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(story);
            }}
            className={`${theme.button} p-2 rounded-lg transition-all hover:scale-110`}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(story.id);
            }}
            className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-all hover:scale-110"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Creator */}
      {story.creator && (
        <div
          className={`${theme.text} flex items-center gap-2 text-sm opacity-70 mb-3`}
        >
          <User className="w-4 h-4" />
          <span>GM: {story.creator}</span>
        </div>
      )}

      <div
        className={`${statusColor} border-2 rounded-lg px-4 py-2 inline-block mb-4 font-semibold text-sm`}
      >
        {statusLabel}
      </div>

      {story.description && (
        <div>
          <p
            className={`${theme.text} opacity-70 text-sm mb-2 ${
              !isExpanded ? "line-clamp-3" : ""
            }`}
          >
            {story.description}
          </p>
          {story.description.length > 150 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className={`${theme.accent} text-xs flex items-center gap-1 hover:underline`}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3" /> Weniger anzeigen
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" /> Mehr anzeigen
                </>
              )}
            </button>
          )}
        </div>
      )}

      {story.status === "completed" &&
        story.completionTime &&
        story.completionTime > 0 && (
          <div
            className={`${theme.text} flex items-center gap-2 text-sm opacity-70 mt-4`}
          >
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>Abgeschlossen in: {formatTime(story.completionTime)}</span>
          </div>
        )}
    </div>
  );
};

export default StoryCard;
