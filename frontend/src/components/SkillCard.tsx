'use client';

import { motion } from 'framer-motion';
import { VerificationBadge } from '@/components/VerificationBadge';

interface SkillCardProps {
  title: string;
  description: string;
  level?: 'beginner' | 'intermediate' | 'expert';
  color: 'yellow' | 'blue' | 'red' | 'green';
  index?: number;
  ipfsHash?: string;
  verified?: boolean;
  ctaLabel?: string;
}

export function SkillCard({
  title,
  description,
  level = 'intermediate',
  color,
  index = 0,
  ipfsHash,
  verified = false,
  ctaLabel = 'VIEW SKILL',
}: SkillCardProps) {
  const colorClasses = {
    yellow: 'border-accent-yellow bg-accent-yellow',
    blue: 'border-accent-blue bg-accent-blue',
    red: 'border-accent-red bg-accent-red',
    green: 'border-accent-green bg-accent-green',
  };

  const textColorClasses = {
    yellow: 'text-black',
    blue: 'text-white',
    red: 'text-white',
    green: 'text-black',
  };

  const levelColors = {
    beginner: 'bg-accent-green',
    intermediate: 'bg-accent-blue',
    expert: 'bg-accent-red',
  };

  return (
    <motion.div
      className={`card-brutal border-4 border-black ${colorClasses[color]} ${textColorClasses[color]} cursor-pointer`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, translateY: -8 }}
      transition={{
        delay: index * 0.1,
        duration: 0.3,
      }}
      viewport={{ once: true }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-grotesk font-bold text-2xl flex-1">{title}</h3>
        <div className={`${levelColors[level]} text-black px-3 py-1 text-xs font-mono font-bold border-2 border-black`}>
          {level.toUpperCase()}
        </div>
      </div>

      {/* Description */}
      <p className="font-inter text-base mb-6 leading-relaxed">{description}</p>

      {verified && (
        <div className="mb-4">
          <VerificationBadge />
        </div>
      )}

      {ipfsHash && (
        <a
          href={`https://ipfs.io/ipfs/${ipfsHash}`}
          target="_blank"
          rel="noreferrer"
          className="mb-4 inline-block border-2 border-current px-3 py-2 font-mono text-xs"
        >
          IPFS: {ipfsHash.slice(0, 16)}...
        </a>
      )}

      {/* CTA */}
      <motion.button
        className="w-full border-2 border-current bg-transparent px-4 py-3 font-grotesk font-bold text-lg"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {ctaLabel}
      </motion.button>

      {/* Metadata */}
      <div className="mt-4 flex gap-4 text-xs font-mono border-t-2 border-current pt-4 opacity-80">
        <div>ID: #SKL{index}</div>
        <div>Stellar Network</div>
      </div>
    </motion.div>
  );
}
