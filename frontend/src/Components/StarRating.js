import React, {useState} from 'react'

const StarRating = ({setRating, rating}) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-rating text-center">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? "on rating" : "off rating" }
            onClick={() => setRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <span className="star w-16 block text-lg mb-5 p-5">&#9733;</span>
          </button>
        );
      })}
    </div>
  );
};


export default StarRating