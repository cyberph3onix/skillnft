'use client';

import { useFreighterWallet } from '@/hooks/useFreighterWallet';
import { fetchSkillsByWallet } from '@/lib/skillApi';
import type { SkillNFT } from '@/types/skill';
import { SkillCard } from '@/components';
import { shortenAddress } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface MintedEventDetail {
  walletAddress?: string;
  txHash?: string;
  skillId?: number;
}

export default function ProfilePage() {
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
          : 'Unable to load profile skills from contract'
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
      { label: 'Skills', value: String(skills.length) },
      { label: 'Verified', value: String(skills.length) },
      {
        label: 'Latest Mint',
        value: skills.length ? new Date(skills[0].timestamp).toLocaleDateString() : '-',
      },
    ],
    [skills]
  );

  const palette = ['blue', 'yellow', 'red', 'green'] as const;

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center border-4 border-black p-16 max-w-2xl">
          <h1 className="text-5xl font-grotesk font-black mb-6">Connect Wallet</h1>
          <p className="text-xl font-inter mb-8">
            Please connect your Freighter wallet to view your profile and minted skills.
          </p>
          <Link href="/" className="btn-brutal-blue inline-block">
            GO HOME
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-12">
      {/* Profile Header */}
      <section className="py-12 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            {/* Avatar */}
            <div className="border-4 border-black bg-accent-yellow w-40 h-40 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-grotesk font-black">U</div>
                <div className="text-xs font-mono mt-2">Avatar</div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-grotesk font-black mb-4">
                Profile
              </h1>
              <p className="text-lg font-mono mb-4 border-2 border-black p-3 bg-gray-50">
                {publicKey && shortenAddress(publicKey)}
              </p>
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="border-4 border-black p-4 text-center">
                    <div className="font-grotesk font-bold text-3xl">{stat.value}</div>
                    <div className="text-xs font-mono">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-6xl md:text-7xl font-grotesk font-black mb-12">Your Skills</h2>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {skills.map((skill, i) => (
              <SkillCard
                key={skill.id}
                title={skill.title}
                description={skill.description}
                color={palette[i % palette.length]}
                index={i}
                ipfsHash={skill.ipfs_hash}
                verified
                ctaLabel="VIEW METADATA"
              />
            ))}
          </div>

          {!loading && !skills.length && !error && (
            <div className="mb-12 border-4 border-black bg-white p-8 text-center">
              <h3 className="font-grotesk text-3xl font-black">No Skills Minted Yet</h3>
              <p className="mt-3 font-inter text-lg">
                Mint your first skill and it will appear here with on-chain verification.
              </p>
            </div>
          )}

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/mint" className="btn-brutal-yellow text-lg font-bold">
              MINT NEW SKILL
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
