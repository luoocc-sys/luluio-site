import { useState, useEffect, useCallback, useRef, type DragEvent } from 'react';
import { Upload, X, Image, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

const STORAGE_KEY = 'luluio-gallery-photos';

/** Load persisted photo data URLs from localStorage */
const loadPhotos = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** Persist photos to localStorage */
const savePhotos = (photos: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
};

/**
 * Read a File as a data URL (base64).
 * Falls back to a small placeholder if the file can't be read.
 */
const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const PhotoGallery = () => {
  const [photos, setPhotos] = useState<string[]>(loadPhotos);
  const [dragOver, setDragOver] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0); // handles nested drag-enter/leave events

  // ── Persist on every change ──────────────────────────────────────────
  useEffect(() => {
    savePhotos(photos);
  }, [photos]);

  // ── Process files (from drop or file input) ──────────────────────────
  const processFiles = useCallback(async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) =>
      f.type.startsWith('image/')
    );
    if (imageFiles.length === 0) return;

    try {
      const newUrls = await Promise.all(imageFiles.map(fileToDataUrl));
      setPhotos((prev) => [...prev, ...newUrls]);
    } catch {
      // At least one file failed — add whatever succeeded
    }
  }, []);

  // ── Drag & drop handlers ─────────────────────────────────────────────
  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setDragOver(false);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      dragCounter.current = 0;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  // ── File input change handler ────────────────────────────────────────
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
        // Reset so the same file can be selected again
        e.target.value = '';
      }
    },
    [processFiles]
  );

  // ── Delete a photo ───────────────────────────────────────────────────
  const handleDelete = useCallback((index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ── Lightbox navigation ──────────────────────────────────────────────
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev > 0 ? prev - 1 : photos.length - 1;
    });
  }, [photos.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev < photos.length - 1 ? prev + 1 : 0;
    });
  }, [photos.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, goPrev, goNext]);

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <section className="bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        {/* Subtle radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)] pointer-events-none" />

        {/* ── Header ────────────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-12 md:mb-16 relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl text-white tracking-tight mb-4">
            Our Photo Gallery
          </h2>
          <p className="text-white/40 text-sm md:text-base">
            Capture every beautiful moment
          </p>
        </motion.div>

        {/* ── Upload zone ───────────────────────────────────────────── */}
        <motion.div
          className="relative mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          viewport={{ once: true }}
        >
          <div
            className={`liquid-glass rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer ${
              dragOver
                ? 'border-rose-400/50 bg-rose-400/5'
                : 'border-white/10'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                fileInputRef.current?.click();
              }
            }}
          >
            {/* Camera icon */}
            <div className="mb-4 flex justify-center">
              <Camera size={48} className="text-white/30" />
            </div>

            <p className="text-white text-lg font-medium mb-1">
              Drop your photos here
            </p>
            <p className="text-white/40 text-sm">or click to browse</p>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        </motion.div>

        {/* ── Photo grid ────────────────────────────────────────────── */}
        {photos.length > 0 && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {photos.map((url, index) => (
              <motion.div
                key={`${url.slice(-20)}-${index}`}
                className="liquid-glass rounded-2xl overflow-hidden aspect-square group relative cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                onClick={() => openLightbox(index)}
              >
                <img
                  src={url}
                  alt={`Gallery photo ${index + 1}`}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Delete button — appears on hover */}
                <button
                  type="button"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-black/60 rounded-full p-1.5 text-white transition-opacity duration-200 hover:bg-black/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(index);
                  }}
                  aria-label={`Delete photo ${index + 1}`}
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {photos.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Image size={40} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/30 text-sm">
              No photos yet. Drop some above to get started!
            </p>
          </motion.div>
        )}
      </div>

      {/* ── Lightbox ────────────────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Photo preview"
        >
          {/* Close button */}
          <button
            type="button"
            className="absolute top-6 right-6 z-10 liquid-glass rounded-full p-3 text-white hover:bg-white/10 transition-colors"
            onClick={closeLightbox}
            aria-label="Close preview"
          >
            <X size={24} />
          </button>

          {/* Previous button */}
          {photos.length > 1 && (
            <button
              type="button"
              className="absolute left-4 md:left-8 z-10 liquid-glass rounded-full p-3 text-white hover:bg-white/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous photo"
            >
              <Upload size={24} className="rotate-[-90deg]" />
            </button>
          )}

          {/* Image */}
          <img
            src={photos[lightboxIndex]}
            alt={`Gallery photo ${lightboxIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain select-none"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />

          {/* Next button */}
          {photos.length > 1 && (
            <button
              type="button"
              className="absolute right-4 md:right-8 z-10 liquid-glass rounded-full p-3 text-white hover:bg-white/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next photo"
            >
              <Upload size={24} className="rotate-90" />
            </button>
          )}

          {/* Counter */}
          {photos.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm">
              {lightboxIndex + 1} / {photos.length}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default PhotoGallery;
