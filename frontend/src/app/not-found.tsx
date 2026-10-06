import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#0F0F12] flex items-center justify-center px-5">
      <div className="max-w-md text-center">
        <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#8F6E38] block mb-4">
          ✦ 404 &bull; SPATIAL EXCEPTION ✦
        </span>
        <h1 className="font-display font-light text-4xl sm:text-5xl uppercase tracking-tight text-[#0F0F12] mb-2">
          Page Not Located
        </h1>
        <p className="font-serif italic text-xl text-[#8F6E38] mb-6">
          The requested coordinate does not exist.
        </p>
        <p className="text-sm text-stone-600 font-light leading-relaxed mb-8">
          The page or architectural portfolio piece you are looking for has been relocated or archived.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] bg-[#0F0F12] text-white hover:bg-[#8F6E38] transition-all duration-300 shadow-md"
        >
          Return to Studio Home
        </Link>
      </div>
    </div>
  );
}
