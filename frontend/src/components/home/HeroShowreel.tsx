'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, ArrowDown } from 'lucide-react';

export default function HeroShowreel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  return (
    <section id="home" className="relative h-screen min-h-[640px] w-full overflow-hidden bg-[#0A0A0B] flex items-center justify-center">
      {/* Background Media Container */}
      <div className="absolute inset-0 z-0">
        {/* Architectural Background Media */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          poster="/images/bombayB1.webp"
          className={`h-full w-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-70' : 'opacity-0'
          }`}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-design-34204-large.mp4" type="video/mp4" />
        </video>

        {/* High-Resolution Architectural Fallback Image if video is buffering */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-80'
          }`}
        >
          <Image
            src="/images/bombayB1.webp"
            alt="OS Interiors architectural showreel"
            fill
            priority
            sizes="100vw"
            className="object-cover scale-105 filter brightness-[0.75] contrast-[1.1]"
          />
        </div>

        {/* Cinematic Edge Overlays: Top navbar fade, bottom canvas transition, side vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B]/60 via-transparent to-[#0A0A0B]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
      </div>

      {/* Hero Center Editorial Content */}
      <div className="relative z-10 container-px text-center flex flex-col items-center">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
        >
          <span className="text-[#C5A880] text-xs">✦</span>
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-medium text-[#C5A880]">
            Architecture &bull; Turnkey Fit-Out &bull; Atelier Joinery
          </span>
          <span className="text-[#C5A880] text-xs">✦</span>
        </motion.div>

        {/* Master Heading Pairing */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl"
        >
          <span className="font-display font-light text-[38px] sm:text-[56px] md:text-[72px] lg:text-[86px] tracking-tight uppercase text-white block leading-[1.02]">
            SHAPING SPATIAL
          </span>
          <span className="font-serif italic font-normal text-[44px] sm:text-[64px] md:text-[80px] lg:text-[98px] text-[#C5A880] block -mt-1 sm:-mt-3">
            Grandeur.
          </span>
        </motion.h1>

        {/* Supporting description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-sm sm:text-base text-[#D4D4D8] font-light leading-relaxed"
        >
          We orchestrate obsidian brutalism, Italian tactile marbles, and micro-tolerance turnkey craftsmanship for discerning enterprise leaders and luxury proprietors.
        </motion.p>

        {/* Hero Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/projects"
            className="rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] bg-white text-black hover:bg-[#C5A880] transition-all duration-300 shadow-xl"
          >
            Explore Realizations
          </Link>
          <Link
            href="/contact"
            className="rounded-full px-8 py-3.5 text-xs font-light uppercase tracking-[0.16em] border border-white/20 text-white hover:border-[#C5A880] hover:text-[#C5A880] transition-all duration-300 bg-[#121216]/50 backdrop-blur-sm"
          >
            Schedule Private Audit
          </Link>
        </motion.div>
      </div>

      {/* Floating Bottom HUD Bar */}
      <div className="absolute bottom-6 sm:bottom-10 inset-x-0 z-20 container-px flex items-center justify-between pointer-events-none">
        {/* Left: Status Pill with Pulsing Gold Dot */}
        <div className="pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-full bg-[#0A0A0B]/85 backdrop-blur-md border border-white/10 shadow-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A880] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A880]" />
          </span>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium text-white/90">
            Live Showreel <span className="text-[#A1A1AA] font-light hidden sm:inline">&bull; Interior Portfolio</span>
          </span>
        </div>

        {/* Center: Bounce Scroll Prompt */}
        <div className="hidden md:flex flex-col items-center gap-1 text-center pointer-events-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A1A1AA] font-light">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ArrowDown className="h-3.5 w-3.5 text-[#C5A880]" />
          </motion.div>
        </div>

        {/* Right: Frosted Circular Audio Toggle */}
        <button
          type="button"
          onClick={toggleMute}
          className="pointer-events-auto flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#0A0A0B]/85 backdrop-blur-md border border-white/15 text-white hover:text-[#C5A880] hover:border-[#C5A880]/60 transition-all duration-300 shadow-xl focus:outline-none"
          aria-label={isMuted ? 'Unmute Showreel Audio' : 'Mute Showreel Audio'}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </section>
  );
}
