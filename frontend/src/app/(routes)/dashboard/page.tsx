'use client';

import { useFreighterWallet } from '@/hooks/useFreighterWallet';
import { fetchSkillsByWallet } from '@/lib/skillApi';
import { shortenAddress } from '@/lib/utils';
import type { SkillNFT } from '@/types/skill';
import { SkillCard } from '@/components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface MintedEventDetail {
  walletAddress?: string;
  txHash?: string;
  skillId?: number;
}

export default function DashboardPage() {
  const { isConnected, publicKey } = useFreighterWallet();

  const [skills, setSkills] = useState<SkillNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSkills = useCallback(async () => {
    if (!isConnected || !publicKey) {
      setSkills([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const walletSkills = await fetchSkillsByWallet(publicKey);
      setSkills(walletSkills);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load minted skills from the contract'
      );
    } finally {
      setLoading(false);
    }
  }, [isConnected, publicKey]);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  useEffect(() => {
    const onMinted = (event: Event) => {
      const detail = (event as CustomEvent<MintedEventDetail>).detail;
      if (!publicKey || detail?.walletAddress !== publicKey) {
        return;
      }

      loadSkills();
    };

    window.addEventListener('skillnft:minted', onMinted);
    return () => {
      window.removeEventListener('skillnft:minted', onMinted);
    };
  }, [loadSkills, publicKey]);

  const stats = useMemo(
    () => [
      { label: 'Total Skills Minted', value: String(skills.length), color: 'bg-accent-blue' },
      { label: 'Verified Skills', value: String(skills.length), color: 'bg-accent-green' },
      {
        label: 'Latest Mint',
        value: skills.length ? new Date(skills[0].timestamp).toLocaleDateString() : '-',
        color: 'bg-accent-yellow',
      },
      {
        label: 'Connected Wallet',
        value: publicKey ? shortenAddress(publicKey, 5, 5) : '-',
        color: 'bg-accent-red',
      },
    ],
    [skills, publicKey]
  );

  const palette = ['blue', 'yellow', 'red', 'green'] as const;

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center border-4 border-black p-16 max-w-2xl">
          <h1 className="text-5xl font-grotesk font-black mb-6">Dashboard</h1>
          <p className="text-xl font-inter mb-8">
            Connect your wallet to access your dashboard and track your NFT skills.
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
      {/* Header */}
      <section className="border-b-4 border-black mb-12">
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-6xl md:text-7xl font-grotesk font-black mb-4">Dashboard</h1>
            <p className="text-xl font-inter text-gray-600">
              Track your verified Skill NFTs minted through Soroban
            </p>
            <p className="mt-3 inline-block border-2 border-black bg-white px-3 py-2 font-mono text-xs">
              Wallet: {publicKey ? shortenAddress(publicKey, 6, 6) : 'Not connected'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`${stat.color} border-4 border-black p-8 text-center${
                stat.color === 'bg-accent-green' ? ' text-black' : ''
              }`}
            >
              <div className={`text-4xl font-grotesk font-black mb-2${
                stat.color === 'bg-accent-green' ? '' : ' text-white'
              }`}>
                {stat.value}
              </div>
              <div className={`font-mono text-sm${
                stat.color === 'bg-accent-green' ? '' : ' text-gray-200'
              }`}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Mints */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <h2 className="text-5xl md:text-6xl font-grotesk font-black mb-12">Minted Skills</h2>

        {loading && (
          <div className="mb-8 border-4 border-black bg-accent-yellow p-5 font-mono text-sm">
            Loading skills from contract...
          </div>
        )}

        {error && (
          <div className="mb-8 border-4 border-black bg-accent-red p-5 font-mono text-sm text-white">
            {error}
          </div>
        )}

        {!loading && error && (
          <button onClick={loadSkills} className="mb-8 btn-brutal-yellow">
            RETRY LOAD
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {skills.map((mint, i) => (
            <SkillCard
              key={mint.id}
              title={mint.title}
              description={mint.description}
              color={palette[i % palette.length]}
              index={i}
              ipfsHash={mint.ipfs_hash}
              verified
              ctaLabel="VIEW METADATA"
            />
          ))}
        </div>

        {!loading && !skills.length && !error && (
          <div className="mb-12 border-4 border-black bg-white p-8 text-center">
            <h3 className="font-grotesk text-3xl font-black">No Skills Minted Yet</h3>
            <p className="mt-3 font-inter text-lg">
              Mint your first skill and it will appear here with an on-chain verification badge.
            </p>
          </div>
        )}

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link href="/mint" className="btn-brutal-blue text-lg font-bold">
            MINT NEW SKILL
          </Link>
        </motion.div>
      </section>

      {/* Activity Section */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <h2 className="text-5xl md:text-6xl font-grotesk font-black mb-12">Activity</h2>

        <div className="border-4 border-black">
          <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div>
              <h4 className="font-grotesk font-bold text-lg">Live Contract Sync</h4>
              <p className="text-sm text-gray-600 mt-1">
                Dashboard reads your wallet skills directly from the Soroban contract.
              </p>
            </div>
            <span className="text-xs font-mono bg-accent-green text-black px-3 py-1">Realtime</span>
          </div>
        </div>
      </section>
    </div>
  );
}
