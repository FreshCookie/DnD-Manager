import React, { useState, forwardRef, useImperativeHandle } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageSelector = forwardRef(({ images, alt, className, theme }, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    getCurrentIndex: () => currentIndex,
    getCurrentImage: () => validImages[currentIndex],
  }));

  if (!images || images.length === 0) return null;

  const validImages = images.filter((img) => img && img.trim() !== "");

  if (validImages.length === 0) return null;

  const goToPrevious = (e) => {
    e.stopPropagation();
    const newIndex =
      currentIndex === 0 ? validImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = (e) => {
    e.stopPropagation();
    const newIndex =
      currentIndex === validImages.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="relative group">
      <div className="flex items-center justify-center">
        <img
          src={validImages[currentIndex]}
          alt={alt}
          className={className}
          onError={(e) => (e.target.style.display = "none")}
        />
      </div>

      {validImages.length > 1 && (
        <>
          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className={`absolute left-2 top-1/2 -translate-y-1/2 ${theme.button} p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg`}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button
            onClick={goToNext}
            className={`absolute right-2 top-1/2 -translate-y-1/2 ${theme.button} p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg`}
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          {/* Image Counter */}
          <div
            className={`absolute bottom-2 right-2 ${theme.cardBg} backdrop-blur-sm px-3 py-1 rounded-full text-xs ${theme.text} opacity-0 group-hover:opacity-100 transition-opacity`}
          >
            {currentIndex + 1} / {validImages.length}
          </div>
        </>
      )}
    </div>
  );
});

export default ImageSelector;
