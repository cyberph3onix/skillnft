'use client';

import { MintForm } from '@/components';
import { useFreighterWallet } from '@/hooks/useFreighterWallet';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MintPage() {
  const { isConnected, publicKey } = useFreighterWallet();

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center border-4 border-black p-16 max-w-2xl">
          <h1 className="text-5xl font-grotesk font-black mb-6">Connect Wallet First</h1>
          <p className="text-xl font-inter mb-8">
            You need to connect your Freighter wallet to mint skills as NFTs.
          </p>
          <Link href="/" className="btn-brutal-blue inline-block">
            GO HOME
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 border-4 border-black bg-accent-yellow p-8 text-center"
        >
          <h1 className="text-6xl md:text-7xl font-grotesk font-black mb-4">Mint Your Skill</h1>
          <p className="text-lg font-inter">Brutalist mint flow: IPFS metadata + on-chain verification</p>
        </motion.div>

        <MintForm walletAddress={publicKey || ''} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 border-4 border-black bg-accent-green p-8 text-black"
        >
          <h3 className="font-grotesk font-bold text-2xl mb-4">What happens next?</h3>
          <ul className="space-y-3 font-inter text-lg">
            <li>✓ Metadata uploaded to IPFS from backend API</li>
            <li>✓ Transaction built with Stellar SDK and signed with Freighter</li>
            <li>✓ Mint committed to Soroban contract on testnet</li>
            <li>✓ Skill instantly available in dashboard list</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
