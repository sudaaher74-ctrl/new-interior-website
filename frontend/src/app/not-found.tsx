import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex items-center justify-center px-5">
      <div className="max-w-md text-center">
        <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#C5A880] block mb-4">
          ✦ 404 &bull; SPATIAL EXCEPTION ✦
        </span>
        <h1 className="font-display font-light text-4xl sm:text-5xl uppercase tracking-tight text-white mb-2">
          Page Not Located
        </h1>
        <p className="font-serif italic text-xl text-[#C5A880] mb-6">
          The requested coordinate does not exist.
        </p>
        <p className="text-sm text-[#A1A1AA] font-light leading-relaxed mb-8">
          The page or architectural portfolio piece you are looking for has been relocated or archived.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] bg-white text-black hover:bg-[#C5A880] transition-all duration-300 shadow-xl"
        >
          Return to Studio Home
        </Link>
      </div>
    </div>
  );
}
