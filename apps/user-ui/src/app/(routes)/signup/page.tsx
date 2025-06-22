'use client';

import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  name: string;
  email: string;
  password: string;
};

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  false;
  const [canResend, setCanResend] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(60);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const signupMutation = useMutation({
    mutationFn: async (data: FormData) => {
      try {
       
      } catch (error) {
        
      }
    },
  });

  const handleOtpChange =(index: number, value: string) => {
    if(!/^[0-9]$/.test(value)) return; // Only allow digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (index && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }



  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpFocus = (index: number) => {
    inputRefs.current[index]?.focus();
  };


  const onSubmit = async (data: FormData) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1] ">
      <h1 className="text-3xl font-poppins font-bold text-center mb-6">
        Signup
      </h1>
      <p className="text-center font-medium py-3">Home.login</p>

      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          <h3 className="text-2xl font-poppins font-bold text-center mb-2">
            Signup to your account
          </h3>
          <div>
            {!showOtp ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="">
                  <label className="block text-gray-700 mb-1">Name</label>
                  <input
                    className={`w-full p-2 border rounded ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    type="text"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                    })}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {String(errors.name.message)}
                    </p>
                  )}
                </div>

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

                <button
                  type="submit"
                  className="w-full bg-black text-white p-2 rounded hover:bg-black transition-colors"
                >
                  Signup
                </button>
                {serverError && (
                  <p className="text-red-500 text-sm mt-2">{serverError}</p>
                )}
              </form>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-poppins font-bold text-center mb-2">
                  Verify your email
                </h3>
                <p className="text-center text-gray-600">
                  We have sent a verification code to your email. Please enter
                  it below.
                </p>
                <div className="flex justify-center space-x-2">
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}

                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onFocus={() => handleOtpFocus(index)}
                      className="w-10 h-10 border rounded text-center text-lg"
                    />
                  ))}
                </div>
               {canResend ? (
                 <button
                 onClick={() => setShowOtp(false)}
                 className="w-full bg-black text-white p-2 rounded hover:bg-black transition-colors"
               >
                 Verify
               </button>
               ) : (
                  <button
                    onClick={() => {
                      setCanResend(false);
                      setResendTimeout(60);
                      const interval = setInterval(() => {
                        setResendTimeout((prev) => {
                          if (prev <= 1) {
                            clearInterval(interval);
                            setCanResend(true);
                            return 60;
                          }
                          return prev - 1;
                        });
                      }, 1000);
                    }}
                    className="w-full bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition-colors"
                    disabled={!canResend}
                  >
                    {canResend ? 'Resend Code' : `Resend in ${resendTimeout}s`}
                  </button>
               )}
               
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
