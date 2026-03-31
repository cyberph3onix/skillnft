'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import Lottie from 'lottie-react';

interface SuccessAnimationProps {
  open: boolean;
  txHash: string | null;
  onClose: () => void;
}

const successLottie = {
  v: '5.7.4',
  fr: 30,
  ip: 0,
  op: 90,
  w: 220,
  h: 220,
  nm: 'success-check',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'circle',
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [110, 110, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [0, 0, 100] }, { t: 20, s: [100, 100, 100] }] },
      },
      shapes: [
        {
          ty: 'el',
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [170, 170] },
          nm: 'ellipse',
        },
        {
          ty: 'fl',
          c: { a: 0, k: [0.0, 1.0, 0.35, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          nm: 'fill',
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
      sr: 1,
    },
  ],
};

export function SuccessAnimation({ open, txHash, onClose }: SuccessAnimationProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const explorerUrl = txHash ? `https://stellar.expert/explorer/testnet/tx/${txHash}` : null;

  useEffect(() => {
    if (!open || !cardRef.current) {
      return;
    }

    const tween = gsap.fromTo(
      cardRef.current,
      { y: 30, rotate: -2, opacity: 0 },
      { y: 0, rotate: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }
    );

    return () => {
      tween.kill();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div ref={cardRef} className="w-full max-w-lg border-4 border-black bg-white p-8 shadow-brutal-lg">
            <div className="mx-auto h-44 w-44">
              <Lottie animationData={successLottie} loop={false} />
            </div>
            <h3 className="mt-2 text-center font-grotesk text-3xl font-black">Skill NFT Minted</h3>
            <p className="mt-3 border-2 border-black bg-accent-yellow p-3 font-mono text-xs">
              TX: {txHash ?? 'Pending hash'}
            </p>
            {explorerUrl && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block border-2 border-black bg-white p-3 text-center font-mono text-xs font-bold"
              >
                VIEW ON STELLAR EXPERT
              </a>
            )}
            <button onClick={onClose} className="mt-5 w-full btn-brutal-blue">
              CLOSE
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
