// Enhanced Testimonials Component with Elegant Animations
import { useState, useEffect, useRef } from 'react';
import reviewsData from '/src/data/googleReviews.json';

interface GoogleReview {
  rating: number;
  text: string;
  authorName: string;
  reviewDate: string;
  url?: string;
}

const GoogleReviews = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<GoogleReview | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance with smooth transitions
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % reviewsData.length);
          setIsTransitioning(false);
        }, 300); // Transition duration
      }
    }, 6000); // Slower auto-advance for better readability

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTransitioning]);

  // Pause auto-advance on hover
  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    intervalRef.current = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % reviewsData.length);
          setIsTransitioning(false);
        }, 300);
      }
    }, 6000);
  };

  const goToSlide = (index: number) => {
    if (index !== currentIndex && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const openModal = (review: GoogleReview) => {
    setSelectedReview(review);
  };

  const closeModal = () => {
    setSelectedReview(null);
  };

  // Calculate which reviews to show (current, next, previous)
  const getVisibleReviews = () => {
    const total = reviewsData.length;
    const prev = (currentIndex - 1 + total) % total;
    const next = (currentIndex + 1) % total;
    
    return [
      { review: reviewsData[prev], position: 'prev', index: prev },
      { review: reviewsData[currentIndex], position: 'current', index: currentIndex },
      { review: reviewsData[next], position: 'next', index: next }
    ];
  };

  return (
    <div className="p-12 bg-white rounded-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-2xl font-bold text-secondary mb-4 max-w-3xl mx-auto">
            What our clients say
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about their experience with Capital M Law. 
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div 
          className="relative max-w-6xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main Carousel Container */}
          <div className="relative h-[400px] md:h-[350px] overflow-hidden rounded-2xl">
            {getVisibleReviews().map(({ review, position, index }: { review: GoogleReview; position: string; index: number }) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                  position === 'current' 
                    ? 'translate-x-0 opacity-100 scale-100 z-20' 
                    : position === 'prev'
                    ? '-translate-x-full opacity-40 scale-95 z-10'
                    : 'translate-x-full opacity-40 scale-95 z-10'
                } ${isTransitioning ? 'transition-all duration-300' : ''}`}
              >
                <div className="h-full flex items-center justify-center px-4">
                  <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full h-full flex flex-col justify-between transform transition-all duration-500 hover:shadow-2xl testimonial-card">
                    {/* Rating */}
                    <div className="flex justify-center mb-4">
                      <div className="flex space-x-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <svg
                            key={i}
                            className="w-6 h-6 text-yellow-400 fill-current testimonial-transition"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    {/* Review Text with Gradient Fade */}
                    <div className="flex-1 relative overflow-hidden">
                      <div className="relative">
                        <p className="text-gray-700 text-lg leading-relaxed text-center italic text-gradient-fade">
                          "{review.text}"
                        </p>
                        {/* Gradient overlay for long text */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                      </div>
                    </div>

                    {/* Author Info */}
                    <div className="mt-3 text-center">
                      <h4 className="font-semibold text-gray-900 text-lg testimonial-transition">
                        {review.authorName || 'Anonymous'}
                      </h4>
                      <p className="text-gray-500 text-sm mt-1 testimonial-transition">
                        {review.reviewDate}
                      </p>
                    </div>

                    {/* Read More Button */}
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => openModal(review)}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 text-sm testimonial-transition testimonial-focus"
                      >
                        Read Full Review →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {reviewsData.map((_: GoogleReview, index: number) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 nav-dot-hover testimonial-focus ${
                  index === currentIndex
                    ? 'bg-blue-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => goToSlide((currentIndex - 1 + reviewsData.length) % reviewsData.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-30 testimonial-transition testimonial-focus"
            disabled={isTransitioning}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => goToSlide((currentIndex + 1) % reviewsData.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-30 testimonial-transition testimonial-focus"
            disabled={isTransitioning}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-blue-600 h-1 rounded-full transition-all duration-300 ease-out progress-bar-fill"
                style={{ 
                  width: `${((currentIndex + 1) / reviewsData.length) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>

        {/* View All Reviews Link */}
        <div className="text-center mt-8">
          <a
            href="https://www.google.com/search?q=Capital+M+Law+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            View All Google Reviews
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Modal for Full Review */}
      {selectedReview && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-backdrop"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Rating */}
              <div className="flex justify-center mb-6">
                <div className="flex space-x-1">
                  {Array.from({ length: selectedReview.rating }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-8 h-8 text-yellow-400 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* Full Review Text */}
              <div className="mb-6">
                <p className="text-gray-700 text-lg leading-relaxed italic">
                  "{selectedReview.text}"
                </p>
              </div>

              {/* Author Info */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 text-xl mb-2">
                  {selectedReview.authorName || 'Anonymous'}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {selectedReview.reviewDate}
                </p>
                {selectedReview.url && (
                  <a
                    href={selectedReview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  >
                    View Original Review
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleReviews;
