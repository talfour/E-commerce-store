import React from 'react'

const Contact = () => {
  return (
    <section className="text-gray-700 body-font overflow-hidden bg-white h-fit mt-20">
      <div className="px-5 py-24 my-auto">
        <ul className='text-center'>
          <li className='py-2 hover:text-blue-500'>
            <a href="#">Facebook</a>
          </li>
          <li className='py-2 hover:text-red-300'>
            <a href="mailto:test@example.com">Email</a>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Contact