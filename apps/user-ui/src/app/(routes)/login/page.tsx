'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {};

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1] ">
      <h1 className="text-3xl font-poppins font-bold text-center mb-6">
        Login
      </h1>
      <p className="text-center font-medium py-3">Home.login</p>

      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          <h3 className="text-2xl font-poppins font-bold text-center mb-2">
            Login to your account
          </h3>
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                className={`w-full p-2 border rounded ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Invalid email address',
                  },
                })}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {String(errors.email.message)}
                </p>
              )}

              <label className="block text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  className={`w-full p-2 border rounded ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  type={passwordVisible ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {passwordVisible ? 'hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {String(errors.password.message)}
                </p>
              )}

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="rememberMe" className="text-gray-700 ">
                  Remember me
                </label>
                <div className="flex items-center ml-auto">
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-blue-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
              {serverError && (
                <p className="text-red-500 text-sm mt-2">{serverError}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
