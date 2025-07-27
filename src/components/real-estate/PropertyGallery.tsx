import { useState } from 'react';

interface PropertyImage {
  url: string;
  alt: string;
  description: string;
}

interface PropertyGalleryProps {
  images?: PropertyImage[];
}

const PropertyGallery = ({ images = [] }: PropertyGalleryProps) => {
  const [current, setCurrent] = useState(0);

  if (!images.length) return null;

  const goTo = (idx: number) => setCurrent(idx);
  const prev = () => setCurrent((current - 1 + images.length) % images.length);
  const next = () => setCurrent((current + 1) % images.length);

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="relative rounded-2xl overflow-hidden shadow-xl group">
        {(() => {
          const { url, alt, description } = images[current];
          return (
            <>
              <img
                src={url}
                alt={alt || ''}
                className="w-full h-96 object-cover object-center transition-all duration-500 group-hover:scale-105"
              />
              {/* Description overlay */}
              {description && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white text-lg font-medium">
                  {description}
                </div>
              )}
            </>
          );
        })()}
        {/* Navigation */}
        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow transition-all z-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow transition-all z-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      {/* Thumbnails */}
      <div className="flex gap-2 mt-4 justify-center">
        {images.map((img, idx) => {
          const { url, alt } = img;
          return (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`rounded-lg overflow-hidden border-2 ${idx === current ? 'border-emerald-500' : 'border-transparent'} focus:outline-none`}
              style={{ width: 64, height: 48 }}
              aria-label={`Go to image ${idx + 1}`}
            >
              <img src={url} alt={alt || ''} className="object-cover w-full h-full" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyGallery; 