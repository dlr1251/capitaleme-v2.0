// CarouselComponent.jsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import reviewsData from '../../../data/googleReviews.json';

const CarouselComponent = () => {
  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ dynamicBullets: true }}           
      spaceBetween={50}
      slidesPerView={3}
      loop={true}
      // You can add more Swiper options here
    >
      {reviewsData.map((review, index) => (
        <SwiperSlide key={index}>
          <div className="p-6 bg-white rounded-sm border h-full">
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
            <p className="my-2 text-gray-700 text-left text-xl max-h-96 overflow-hidden">
              {`"${review.text}"` || 'No review text available.'}
            </p>
            <a
              href={review.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-secondary hover:underline"
            >
              View Original
            </a>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CarouselComponent;
