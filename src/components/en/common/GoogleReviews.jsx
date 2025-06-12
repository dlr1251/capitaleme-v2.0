// CarouselComponent.jsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { useState } from 'react';

import 'swiper/css';
import 'swiper/css/pagination';
import reviewsData from '../../../data/googleReviews.json';

const CarouselComponent = () => {
  const [selectedReview, setSelectedReview] = useState(null);

  const openModal = (review) => {
    setSelectedReview(review);
  };

  const closeModal = () => {
    setSelectedReview(null);
  };

  return (
    <>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ dynamicBullets: true }}
        loop={true}
        autoplay={{
          delay: 2500, // Time in milliseconds between slides (e.g., 2.5 seconds)
          disableOnInteraction: true, // Stops autoplay after user interaction (optional)
        }}
        breakpoints={{
          // when window width is >= 320px
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          // when window width is >= 1024px
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
      >
        {reviewsData.map((review, index) => (
          <SwiperSlide key={index}>
            <div className="p-6 bg-white rounded-lg border shadow-md h-full flex flex-col">
              <p className="mt-2 text-yellow-500 text-center">{review.rating}/5</p>
              <div className="mt-2 flex justify-center text-yellow-500">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 17.75l-5.5 3.25 1.062-6.188L3.5 9.313l6.25-.938L12 3.25l2.25 5.125 6.25.938-4.062 5.5L17.5 21z"
                    />
                  </svg>
                ))}
              </div>
              <h3 className="text-lg font-semibold text-primary text-center">
                {review.authorName || 'Anonymous'}
              </h3>
              <p className="mt-2 text-gray-500 text-center">{review.reviewDate}</p>
              <p className="my-2 text-gray-700 text-left text-sm md:text-lg max-h-96 overflow-hidden">
                {`"${review.text}"` || 'No review text available.'}
              </p>
              <button
                onClick={() => openModal(review)}
                className="mt-auto text-sm md:text-lg font-bold text-secondary hover:underline"
              >
                Read More
              </button>
              <a
                href={review.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm md:text-lg font-bold text-secondary hover:underline"
              >
                View Original
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-xl font-bold text-primary">{selectedReview.authorName || 'Anonymous'}</h2>
            <p className="mt-2 text-gray-500">{selectedReview.reviewDate}</p>
            <p className="my-4 text-gray-700">{`"${selectedReview.text}"` || 'No review text available.'}</p>
            <button onClick={closeModal} className="text-secondary font-bold hover:underline">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CarouselComponent;
