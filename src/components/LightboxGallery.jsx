import { useState, useEffect, useRef } from "react";

export default function LightboxGallery({
  images = [],
  mode = "gallery",
  fullList = null,
  fullIndex = 0,
  showCaptions = true, // ← nova prop com valor padrão
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [activeList, setActiveList] = useState(images);
  const [zoomLevel, setZoomLevel] = useState(1);
  const imageWrapperRef = useRef(null);

  const open = (index) => {
    setCurrent(index);
    setActiveList(fullList?.length ? fullList : images);
    setIsOpen(true);
    setZoomLevel(1);
  };

  const close = () => setIsOpen(false);

  const next = () => setCurrent((prev) => (prev + 1) % activeList.length);
  const prev = () => setCurrent((prev) => (prev - 1 + activeList.length) % activeList.length);

  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, activeList]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (!isOpen) return;
      e.preventDefault();
      setZoomLevel((z) => Math.max(0.5, Math.min(z + e.deltaY * -0.001, 3)));
    };
    const wrapper = imageWrapperRef.current;
    if (wrapper) wrapper.addEventListener("wheel", handleWheel, { passive: false });
    return () => wrapper?.removeEventListener("wheel", handleWheel);
  }, [isOpen]);

  return (
    <>
      <div
        className={`${
          mode === "single"
            ? "flex justify-center mt-6"
            : "grid grid-cols-1 md:grid-cols-2 gap-6"
        }`}
      >
        {images.map((img, index) => (
          <figure
            key={index}
            className={`cursor-pointer mx-auto ${mode === "single" ? "max-w-4xl" : ""}`}
            onClick={() => open(fullList ? fullIndex : index)}
          >
            <img
              src={img.url}
              alt={img.alt || ""}
              className={`rounded object-contain mx-auto ${
                mode === "single"
                  ? "max-w-full max-h-[600px]"
                  : "w-full object-cover max-h-64"
              }`}
            />
            {showCaptions && img.caption && (
              <figcaption
                className="text-sm text-center mt-2"
                style={{
                  color: "var(--color-texto)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 text-white overflow-y-auto"
          onClick={close}
        >
          <div
            ref={imageWrapperRef}
            className="flex flex-col items-center justify-center min-h-screen pt-20 pb-20 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-6 right-8 text-5xl font-bold hover:text-gray-300 transition"
              onClick={close}
              aria-label="Fechar"
            >
              ×
            </button>

            <img
              src={activeList[current].url}
              alt={activeList[current].alt || ""}
              className="rounded shadow-lg transition-transform duration-200"
              style={{
                transform: `scale(${zoomLevel})`,
                maxWidth: "90vw",
                maxHeight: "80vh",
                minWidth: "300px",
                objectFit: "contain",
              }}
            />

            {activeList[current].caption && (
              <figcaption
                className="mt-6 mb-6 text-sm text-center max-w-2xl"
                style={{
                  color: "var(--color-admin)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {activeList[current].caption}
              </figcaption>
            )}
          </div>

          {activeList.length > 1 && (
            <>
              <button
                className="absolute left-6 top-1/2 transform -translate-y-1/2 text-5xl font-bold hover:text-gray-300 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-5xl font-bold hover:text-gray-300 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Seguinte"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
