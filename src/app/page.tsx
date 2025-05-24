"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { LogIn, Mail, Lock } from "lucide-react";

const LandingPage: React.FC = () => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    gsap.fromTo(
      leftRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    );
    gsap.fromTo(
      rightRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can add login validation logic here
    router.push("/onboarding");
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Illustration Section */}
      <div
        ref={leftRef}
        className="w-1/2 flex items-centre justify-centre"
      >
        <img
          src="/hospital-illustration.png"
          alt="Illustration"
          className="w-4/5 h-auto"
        />
      </div>

      {/* Information and Login Form Section */}
      <div
        ref={rightRef}
        className="w-1/2 bg-white flex flex-col justify-center px-12"
      >
        <h1 className="text-4xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
          <LogIn className="w-8 h-8 text-green-600" /> Welcome to Aguken AI
        </h1>
        <p className="text-gray-600 mb-8">
          A powerful platform to streamline your healthcare services and
          appointments.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Mail className="w-4 h-4" /> Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Lock className="w-4 h-4" /> Password
            </label>
            <input
              type="password"
              placeholder="********"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;
