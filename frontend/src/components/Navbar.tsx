'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { WalletConnect } from './WalletConnect';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'HOME', href: '/' },
    { label: 'PROFILE', href: '/profile' },
    { label: 'MINT', href: '/mint' },
    { label: 'DASHBOARD', href: '/dashboard' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 border-b-4 border-black bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-grotesk font-bold text-2xl hover:text-accent-yellow transition-colors">
          SkillNFT
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-grotesk font-bold text-lg border-b-4 border-transparent hover:border-black transition-all"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Wallet Connect */}
        <div className="flex items-center gap-4">
          <WalletConnect />

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden border-4 border-black bg-black text-white p-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-6 h-6 flex flex-col justify-center gap-1">
              <div className={`w-full h-1 bg-white transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-full h-1 bg-white transition-all ${isOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-full h-1 bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t-4 border-black bg-white flex flex-col gap-4 p-6"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-grotesk font-bold text-lg border-b-4 border-transparent hover:border-black transition-all"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
}
