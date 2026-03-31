'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface UploadModalProps {
  open: boolean;
  title: string;
  detail: string;
}

export function UploadModal({ open, title, detail }: UploadModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md border-4 border-black bg-white p-6 shadow-brutal"
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, y: 10 }}
          >
            <h3 className="font-grotesk text-2xl font-black">{title}</h3>
            <p className="mt-3 font-inter text-base">{detail}</p>
            <div className="mt-4 h-3 w-full border-2 border-black bg-accent-yellow" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
