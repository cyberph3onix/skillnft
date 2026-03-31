'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function AnimatedHero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const floatingBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title with GSAP
      gsap.from(titleRef.current, {
        duration: 1,
        opacity: 0,
        y: 40,
        ease: 'power3.out',
      });

      // Animate subtitle with delay
      gsap.from(subtitleRef.current, {
        duration: 1,
        opacity: 0,
        y: 40,
        ease: 'power3.out',
        delay: 0.2,
      });

      // Animate CTA button
      gsap.from('[data-cta]', {
        duration: 1,
        opacity: 0,
        y: 40,
        ease: 'power3.out',
        delay: 0.4,
      });

      // Floating animation
      gsap.to(floatingBoxRef.current, {
        duration: 3,
        y: -20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    return () => ctx.revert();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-12">
        {/* Left Content */}
        <motion.div
          className="flex-1 z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1
            ref={titleRef}
            className="text-7xl md:text-8xl font-grotesk font-black leading-tight mb-6 text-black"
          >
            Your Skills.<br />
            <span className="text-accent-yellow border-4 border-black inline-block px-4 py-2 mt-2">
              On-Chain
            </span>
            <br />
            Forever.
          </h1>

          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl font-inter font-normal mb-8 text-black max-w-lg"
          >
            Mint your resume as verifiable NFTs on Stellar blockchain. Build your Web3 identity and showcase your skills to the world.
          </p>

          <motion.div
            data-cta
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/mint"
              className="btn-brutal-blue inline-block text-lg md:text-xl font-bold"
            >
              START BUILDING →
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            className="mt-16 flex gap-8 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="border-4 border-black p-4">
              <div className="font-grotesk font-bold text-2xl">50K+</div>
              <div className="text-sm text-gray-600">Skills Minted</div>
            </div>
            <div className="border-4 border-black p-4">
              <div className="font-grotesk font-bold text-2xl">10K+</div>
              <div className="text-sm text-gray-600">Users</div>
            </div>
            <div className="border-4 border-black p-4">
              <div className="font-grotesk font-bold text-2xl">$2M</div>
              <div className="text-sm text-gray-600">Volume</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Floating Elements */}
        <motion.div
          className="hidden lg:flex flex-1 relative h-screen max-h-96 items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Main floating box */}
          <div
            ref={floatingBoxRef}
            className="absolute border-4 border-black bg-accent-yellow p-8 w-64 h-64 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="font-grotesk font-bold text-4xl mb-2">NFT</div>
              <div className="text-sm font-mono">Blockchain Verified</div>
            </div>
          </div>

          {/* Orbiting elements */}
          <motion.div
            className="absolute border-4 border-accent-blue bg-accent-blue text-white p-4 w-32 h-32 flex items-center justify-center"
            animate={{
              x: [0, 80, 80, 0],
              y: [0, 0, 80, 80],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div className="text-center font-mono text-sm font-bold">Skill</div>
          </motion.div>

          <motion.div
            className="absolute border-4 border-accent-red bg-accent-red text-white p-4 w-32 h-32 flex items-center justify-center"
            animate={{
              x: [0, -80, -80, 0],
              y: [0, 0, 80, 80],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div className="text-center font-mono text-sm font-bold">Project</div>
          </motion.div>

          <motion.div
            className="absolute border-4 border-accent-green bg-accent-green text-black p-4 w-32 h-32 flex items-center justify-center"
            animate={{
              x: [0, 80, 80, 0],
              y: [0, 0, -80, -80],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div className="text-center font-mono text-sm font-bold">Award</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
