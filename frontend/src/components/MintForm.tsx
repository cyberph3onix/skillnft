'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { uploadSkillMetadata } from '@/lib/skillApi';
import { mintSkillOnChain } from '@/lib/sorobanMint';
import type { MintResult, TransactionPhase } from '@/types/skill';
import { TransactionStatus } from '@/components/TransactionStatus';
import { UploadModal } from '@/components/UploadModal';
import { SuccessAnimation } from '@/components/SuccessAnimation';

interface MintFormProps {
  walletAddress: string;
}

interface FormState {
  title: string;
  description: string;
  proof: string;
  file: File | null;
}

const initialFormState: FormState = {
  title: '',
  description: '',
  proof: '',
  file: null,
};

const statusText: Record<TransactionPhase, string> = {
  idle: 'Ready to mint your Skill NFT.',
  uploading: 'Uploading metadata to IPFS...',
  signing: 'Please approve the transaction in Freighter...',
  submitting: 'Submitting signed transaction to Stellar testnet...',
  success: 'Skill NFT minted successfully.',
  failed: 'Mint failed. Please retry.',
};

const toReadableMessage = (error: unknown): string => {
  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  if (error instanceof Error) {
    if (error.message && error.message !== '[object Object]') {
      return error.message;
    }

    const maybePayload = error.cause;
    if (maybePayload && typeof maybePayload === 'object') {
      const nested = (maybePayload as Record<string, unknown>).message;
      if (typeof nested === 'string' && nested.trim()) {
        return nested;
      }
    }
  }

  if (error && typeof error === 'object') {
    const payload = error as Record<string, unknown>;
    const candidates = [payload.reason, payload.error, payload.message];

    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate;
      }

      if (candidate && typeof candidate === 'object') {
        const nested = (candidate as Record<string, unknown>).message;
        if (typeof nested === 'string' && nested.trim()) {
          return nested;
        }

        try {
          const serialized = JSON.stringify(candidate);
          if (serialized && serialized !== '{}') {
            return serialized;
          }
        } catch {
          // Ignore and keep searching for a readable error value.
        }
      }
    }

    try {
      const serialized = JSON.stringify(payload);
      if (serialized && serialized !== '{}') {
        return serialized;
      }
    } catch {
      // Ignore and fall back to generic message.
    }
  }

  return 'Unexpected mint error';
};

const toMintErrorMessage = (error: unknown): string => {
  const message = toReadableMessage(error);
  const lowered = message.toLowerCase();

  if (lowered.includes('ipfs')) {
    return `IPFS upload failed: ${message}`;
  }

  if (lowered.includes('timed out')) {
    return `Transaction timeout: ${message}`;
  }

  if (lowered.includes('return value') || lowered.includes('skillid')) {
    return `Invalid contract return value: ${message}`;
  }

  if (lowered.includes('failed on-chain') || lowered.includes('submission failed')) {
    return `Contract execution failed: ${message}`;
  }

  return message;
};

export function MintForm({ walletAddress }: MintFormProps) {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [phase, setPhase] = useState<TransactionPhase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [mintResult, setMintResult] = useState<MintResult | null>(null);

  const isWorking = phase === 'uploading' || phase === 'signing' || phase === 'submitting';

  const uploadModalOpen = useMemo(
    () => phase === 'uploading' || phase === 'signing' || phase === 'submitting',
    [phase]
  );

  const resetStatus = () => {
    setPhase('idle');
    setError(null);
    setMintResult(null);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!walletAddress) {
      setPhase('failed');
      setError('Wallet not connected. Connect Freighter to continue.');
      return;
    }

    try {
      // Mint flow: upload metadata to IPFS first, then submit Soroban mint transaction.
      setPhase('uploading');
      const mintedAt = Date.now();

      const upload = await uploadSkillMetadata({
        title: form.title,
        description: form.description,
        proof: form.proof,
        file: form.file,
      });

      const chain = await mintSkillOnChain({
        walletAddress,
        title: form.title,
        description: form.description,
        ipfsHash: upload.ipfs_hash,
        timestamp: mintedAt,
        onStatusChange: (status) => {
          setPhase(status);
        },
      });

      setMintResult(chain);
      window.dispatchEvent(
        new CustomEvent('skillnft:minted', {
          detail: {
            walletAddress,
            txHash: chain.txHash,
            skillId: chain.skillId,
          },
        })
      );
      setPhase('success');
      setForm(initialFormState);
    } catch (mintError) {
      setPhase('failed');
      setError(toMintErrorMessage(mintError));
    }
  };

  return (
    <>
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-4 border-black bg-white p-8"
      >
        <div className="mb-6">
          <label className="mb-2 block font-grotesk text-xl font-black">Skill Title</label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            required
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            className="w-full border-4 border-black p-4 text-lg font-inter focus:bg-accent-yellow focus:outline-none"
            placeholder="e.g. Soroban Smart Contracts"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block font-grotesk text-xl font-black">Description</label>
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            required
            rows={5}
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            className="w-full resize-none border-4 border-black p-4 text-lg font-inter focus:bg-accent-yellow focus:outline-none"
            placeholder="What was built, achieved, or shipped?"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block font-grotesk text-xl font-black">Proof Link</label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="url"
            required
            value={form.proof}
            onChange={(event) => setForm((prev) => ({ ...prev, proof: event.target.value }))}
            className="w-full border-4 border-black p-4 text-lg font-inter focus:bg-accent-yellow focus:outline-none"
            placeholder="https://github.com/username/repository"
          />
        </div>

        <div className="mb-8">
          <label className="mb-2 block font-grotesk text-xl font-black">Optional File (image/pdf)</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                file: event.target.files && event.target.files.length ? event.target.files[0] : null,
              }))
            }
            className="w-full border-4 border-black p-3 font-mono text-sm"
          />
        </div>

        <motion.button
          type="submit"
          disabled={isWorking}
          className="w-full btn-brutal-blue text-xl font-black disabled:cursor-not-allowed disabled:opacity-70"
          animate={isWorking ? { scale: [1, 1.01, 1] } : { scale: 1 }}
          transition={{ repeat: isWorking ? Infinity : 0, duration: 1.1 }}
        >
          {isWorking ? 'PROCESSING...' : 'MINT SKILL NFT'}
        </motion.button>

        <TransactionStatus phase={phase} message={error || statusText[phase]} />
      </motion.form>

      <UploadModal
        open={uploadModalOpen}
        title={phase === 'signing' ? 'Sign In Freighter' : 'Processing Mint'}
        detail={statusText[phase]}
      />

      <SuccessAnimation
        open={phase === 'success'}
        txHash={mintResult?.txHash || null}
        onClose={resetStatus}
      />
    </>
  );
}
