import Link from 'next/link';
import React from 'react';

const Header = () => {
  return (
    <div className="w-full bg-white ">
      <div className="w-[80%] py-5 mx-auto flex justify-between items-center">
        <div>
          <Link href="/">
            <span className="text-3xl font-[500]">Eshop</span>
          </Link>
        </div>

        <div className="w-[50%] relative">
          <input
            type="text"
            placeholder="Search for products"
            className="w-full h-10 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="w-[60px] h-[60px] bg-gray-100 rounded-full flex justify-center items-center cursor-pointer hover:bg-gray-200">
          <div className="flex items-center justify-center gap-4">
            <Link href={'/login'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7.002 7.002 0 00-6.32 4.5A9.003 9.003 0 0112 21a9.003 9.003 0 016.32-2.5A7.002 7.002 0 0012 14z"
                />
              </svg>
            </Link>
            <Link href={'/wishlist'}>
              {/*  heart icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l8.48 8.48a1 1 0 001.42 0l8.48-8.48a5.5 5.5 0 000-7.78z"
                />
              </svg>
            </Link>
            <Link href={'/cart'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-600"
                fill="none"
                viewBox="0 0 20 20"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l1.4-7H5.6L7 13zm0 0a2 2 0 11-4 0m4 0a2 2 0 11-4 0m16-2a2 2 0 11-4 0m4 0a2 2 0 11-4 0m-6-8H5.6L4.2 3H1m18.8 0h-1.6l-.4 2h1.6l1.4-2z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
