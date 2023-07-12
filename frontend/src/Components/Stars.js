import React from 'react'

const Stars = ({rating, num_reviews, isList, showNumReviews}) => {
    const renderStars = () => {
      const stars = [];

      for (let i = 1; i <= 5; i++) {
        const starClassName =
          i <= rating ? "text-yellow-300" : "text-gray-200";

        const starSvg = (
          <svg
            key={i}
            className={`w-4 h-4 ${starClassName} mr-1`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        );

        stars.push(starSvg);
      }

      return stars;
    };
  return (
    <div className={`flex items-center mt-2.5 mb-5 ${isList && "px-5"}`}>
      {renderStars()}
      {showNumReviews && <span className="italic">({num_reviews})</span>}
    </div>
  );
}

export default Stars