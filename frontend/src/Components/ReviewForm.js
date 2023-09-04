import React, {useState} from 'react'
import { axiosInstance } from '../axios'
import StarRating from "./StarRating"
const ReviewForm = ({product_id, product_name}) => {

    const [comment, setComment] = useState('')
  const [rating, setRating] = useState('')
  const [message, setMessage] = useState('')
  const [messageError, setMessageError] = useState(false)

    const handleReviewCreate = async (e) => {
      e.preventDefault()
      try {
        const response = await axiosInstance
          .post("/product_review/", {
            product_id: product_id,
            rating: rating,
            comment: comment,
          })
        if (response.status === 201) {
          setMessage('Your review was added successfully.')

      }
      } catch (error) {
        setMessageError(true);
        setMessage(error.response.data.detail);
      }
        }


  return (
    <div>
      <h1 className="text-lg mb-5">Rate the product: {product_name}</h1>
      <form className="w-full h-auto" onSubmit={handleReviewCreate}>
        <div className="flex flex-wrap -mx-3 justify-center align-middle md:mb-6">
          <div className="w-full px-3 mb-2">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="comment"
            >
              Comment
            </label>
            <textarea
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="comment"
              rows={5}
              value={comment}
              required
              name="comment"
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="w-full px-3 mb-2">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="stars"
            >
              Rate
            </label>
            <StarRating setRating={setRating} rating={rating} />
          </div>
          <div className="w-full px-3 mb-2">
            <button
              className="shadow bg-pink-400 hover:bg-pink-500 focus:shadow-outline focus:outline-none text-white text-sm font-bold py-2 px-2 rounded w-full"
              type="submit"
            >
              Rate the product
            </button>
          </div>
        </div>
      </form>
      <h1 className={`text-center ${messageError ? 'text-red-400': 'text-green-400'}`}>{message}</h1>
    </div>
  );
}

export default ReviewForm