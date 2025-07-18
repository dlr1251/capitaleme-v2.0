import { useState, useEffect } from 'react';

interface GoogleReview {
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  author_name: string;
  text: string;
}

function ReviewsSection() {
  const [data, setData] = useState<GoogleReview[]>([]);

  useEffect(() => {
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:4321/api/google/reviews' // Use your local dev server URL
      : 'https://capitaleme.com/api/google/reviews';

    async function fetchReviews() {
      try {
        const response = await fetch(baseUrl);
        const rawData = await response.json();
        const isReviewArray = Array.isArray(rawData) && rawData.every(item => typeof item === 'object' && 'rating' in item);
        setData(isReviewArray ? rawData : []);
      } catch (error) {
        setData([]); // Handle error or set to empty array if fetch fails
      }
    }

    fetchReviews();
  }, []);

  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-lg sm:py-16 lg:px-6">
        <div className="text-3xl font-bold text-primary mb-3">
          Nuestra Experiencia
        </div>
        <div id="experiences" className="grid grid-cols-1 md:grid-cols-2">
          {data.map((r: GoogleReview, index: number) => (
            <div key={index} id="experience" className="flex flex-col md:flex-row p-0 md:p-5 mb-6 md: mb-1">
              <div className="w-64 hidden md:flex flex-col items-center p-3 mx-auto mb-4">
                <img src={r.profile_photo_url} className='rounded-full w-16 h-16' alt="Profile pic" width={64} height={64} />
                <div id="star-rating">{'⭐️'.repeat(r.rating)}</div>
                <div id="date-posted" className="text-xs text-center">{r.relative_time_description}</div>
              </div>
              <div id="review-text" className="flex flex-col justify-center md:mx-3 text-gray-500">
                <div id="reviewer-name" className="font-bold text-primary">{r.author_name}</div>
                <p>{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ReviewsSection;
