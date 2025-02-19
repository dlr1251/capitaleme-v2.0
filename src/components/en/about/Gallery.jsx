import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import { Navigation, Pagination } from "swiper"

// Example photos with descriptions

// console.log(Slider);
const photos = [
  {
    id: 1,
    url: "all-visas.jpeg",
    description: "A breathtaking view of the mountains.",
  },
  {
    id: 2,
    url: "bg_home.jpeg",
    description: "A peaceful lake surrounded by trees.",
  },
  {
    id: 3,
    url: "Team.jpeg",
    description: "A vibrant cityscape at night.",
  },
  {
    id: 4,
    url: "Team.jpeg",
    description: "A calm beach with crystal-clear water.",
  },
];
const Gallery = () => {
  
  const [highlightedPhoto, setHighlightedPhoto] = useState(photos[0]);

  // Settings for the thumbnail carousel
  const thumbnailSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
    focusOnSelect: true,
    afterChange: (index) => setHighlightedPhoto(photos[index]),
    responsive: [
      {
        breakpoint: 768, // Mobile view
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480, // Small mobile
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <div className="photo-gallery-container">
      {/* Highlighted Photo */}
      <div className="highlighted-photo">
        <img src={highlightedPhoto.url} alt={`Photo ${highlightedPhoto.id}`} />
        <p className="photo-description">{highlightedPhoto.description}</p>
      </div>

      {/* Thumbnail Carousel */}
      <Swiper
      // modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={10}
      slidesPerView={3} // Adjust for thumbnail layout
      className="thumbnail-carousel"
    >
      {photos.map((photo, index) => (
        <SwiperSlide key={photo.id} className="thumbnail">
          <img
            src={photo.url}
            alt={`Thumbnail ${photo.id}`}
            // onClick={setHighlightedPhoto(index)}
            className={`thumbnail-image ${
              photo.id === highlightedPhoto.id ? "active" : ""
            }`}
          />
        </SwiperSlide>
      ))}
    </Swiper>
      {/* <Slider {...thumbnailSettings}  className="thumbnail-carousel">
        {photos.map((photo) => (
          <div key={photo.id} className="thumbnail">
            <img
              src={photo.url}
              alt={`Thumbnail ${photo.id}`}
              className={`thumbnail-image ${
                photo.id === highlightedPhoto.id ? "active" : ""
              }`}
            />
          </div>
        ))} 
     </Slider> */}

      {/* Styles */}
      <style >{`

.thumbnail-carousel {
  width: 100%;
  height: auto;
}

.thumbnail-image {
  width: 100%;
  height: auto;
  border-radius: 5px;
  transition: transform 0.3s ease-in-out;
}

.thumbnail-image.active {
  transform: scale(1.1);
  border: 2px solid #007BFF;
}

      
      `}</style>
    </div>
  );
};

export default Gallery;