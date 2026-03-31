'use client';

import { motion } from 'framer-motion';
import type { TransactionPhase } from '@/types/skill';

interface TransactionStatusProps {
  phase: TransactionPhase;
  message: string;
}

const phaseColors: Record<TransactionPhase, string> = {
  idle: 'bg-white',
  uploading: 'bg-accent-yellow',
  signing: 'bg-accent-blue text-white',
  submitting: 'bg-accent-blue text-white',
  success: 'bg-accent-green',
  failed: 'bg-accent-red text-white',
};

export function TransactionStatus({ phase, message }: TransactionStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-6 border-4 border-black p-4 font-mono text-sm ${phaseColors[phase]}`}
    >
      <span className="font-bold">{phase.toUpperCase()}:</span> {message}
    </motion.div>
  );
}
