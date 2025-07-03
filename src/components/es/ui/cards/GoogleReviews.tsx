// Enhanced Testimonials Component with Elegant Animations
import { useState, useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import reviewsDataRaw from '../../../../data/googleReviews.json';

/**
 * Type for a single Google review.
 */
interface Review {
  authorName: string;
  rating: number;
  text: string;
  reviewDate: string;
  url: string;
}

/**
 * Props for GoogleReviews component.
 */
interface GoogleReviewsProps {
  /** Max number of reviews to show in the carousel */
  maxReviews?: number;
  /** Language code for i18n (future use) */
  lang?: string;
}

/**
 * GoogleReviews - Professional carousel for client testimonials.
 */
const GoogleReviews = ({ maxReviews = 10, lang = 'es' }: GoogleReviewsProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Parse and slice reviews
  let reviewsData: Review[] = [];
  try {
    reviewsData = (reviewsDataRaw as Review[]).slice(0, maxReviews);
  } catch (e) {
    setError('No se pudieron cargar las reseñas.');
  }

  useEffect(() => {
    setLoading(false);
    if (reviewsData.length === 0) return;
    intervalRef.current = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % reviewsData.length);
          setIsTransitioning(false);
        }, 350);
      }
    }, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning, reviewsData.length]);

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') goToSlide((currentIndex - 1 + reviewsData.length) % reviewsData.length);
    if (e.key === 'ArrowRight') goToSlide((currentIndex + 1) % reviewsData.length);
  };

  const goToSlide = (index: number) => {
    if (index !== currentIndex && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 350);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando reseñas...</div>;
  }
  if (error || reviewsData.length === 0) {
    return <div className="text-center py-12 text-red-600">{error || 'No hay reseñas disponibles.'}</div>;
  }

  const review = reviewsData[currentIndex];

  return (
    <section
      className="py-12 bg-gradient-to-br from-white to-gray-50"
      aria-label="Testimonios de clientes"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Lo que dicen nuestros clientes</h2>
          <p className="text-lg text-gray-600">Testimonios reales de Google sobre Capital M Law.</p>
        </header>
        <div className="relative flex flex-col items-center">
          {/* Card */}
          <div className="w-full bg-white rounded-xl shadow-lg p-8 transition-all duration-500" aria-live="polite">
            <div className="flex items-center justify-center mb-4">
              {/* Stars */}
              <div className="flex space-x-1" aria-label={`Calificación: ${review.rating} de 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                  </svg>
                ))}
              </div>
            </div>
            <blockquote className="text-gray-800 text-lg italic text-center mb-6">“{review.text}”</blockquote>
            <div className="flex flex-col items-center gap-1">
              <span className="font-semibold text-gray-900">{review.authorName}</span>
              <span className="text-gray-500 text-sm">{review.reviewDate}</span>
              {review.url && (
                <a
                  href={review.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm mt-1"
                  aria-label="Ver reseña original en Google"
                >
                  Ver en Google
                </a>
              )}
            </div>
          </div>
          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => goToSlide((currentIndex - 1 + reviewsData.length) % reviewsData.length)}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Reseña anterior"
              disabled={isTransitioning}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex gap-1">
              {reviewsData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`w-3 h-3 rounded-full ${idx === currentIndex ? 'bg-blue-600' : 'bg-gray-300'} transition-all`}
                  aria-label={`Ir a reseña ${idx + 1}`}
                  aria-current={idx === currentIndex ? 'true' : undefined}
                />
              ))}
            </div>
            <button
              onClick={() => goToSlide((currentIndex + 1) % reviewsData.length)}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Siguiente reseña"
              disabled={isTransitioning}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews; 