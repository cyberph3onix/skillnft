'use client';

import { useState, useEffect } from 'react';
import { useFreighterWallet } from '@/hooks/useFreighterWallet';
import { shortenAddress } from '@/lib/utils';
import { motion } from 'framer-motion';

export function WalletConnect() {
  const {
    isConnected,
    publicKey,
    isInstalled,
    isLoading,
    error,
    connect,
    disconnect,
  } = useFreighterWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const [checkingWallet, setCheckingWallet] = useState(true);

  // Wait for wallet to be checked
  useEffect(() => {
    const timer = setTimeout(() => {
      setCheckingWallet(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleConnect = async () => {
    try {
      await connect();
    } catch {
      // Errors are managed by the wallet store and rendered below.
    }
  };

  // Show checking state
  if (checkingWallet) {
    return (
      <motion.button
        disabled
        className="btn-brutal opacity-50 cursor-wait"
        whileHover={{ scale: 1 }}
      >
        CHECKING...
      </motion.button>
    );
  }

  // Show connected state - HIGHEST PRIORITY
  if (isConnected && publicKey) {
    return (
      <div className="relative">
        <motion.button
          onClick={() => setShowDropdown(!showDropdown)}
          className="btn-brutal-blue text-white"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          title={publicKey}
        >
          {shortenAddress(publicKey)}
        </motion.button>

        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 border-4 border-black bg-white shadow-brutal z-50"
          >
            <div className="px-4 py-3 border-b-2 border-black text-xs font-mono text-gray-600">
              {publicKey}
            </div>
            <button
              onClick={() => {
                disconnect();
                setShowDropdown(false);
              }}
              className="block w-full px-4 py-3 text-left font-grotesk font-bold hover:bg-accent-yellow transition-colors text-black"
            >
              DISCONNECT
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  // FORCE CONNECTION UI - Direct connection button
  return (
    <div className="flex flex-col gap-2">
      {/* MAIN CONNECT BUTTON */}
      <motion.button
        onClick={handleConnect}
        disabled={isLoading}
        className={
          isLoading
            ? 'btn-brutal-blue opacity-70 text-white cursor-wait'
            : 'btn-brutal-blue text-white animate-pulse-brutal'
        }
        whileHover={{ scale: isLoading ? 1 : 1.05 }}
        whileTap={{ scale: isLoading ? 1 : 0.95 }}
        title="Connect Freighter Wallet"
      >
        {isLoading ? 'CONNECTING...' : 'CONNECT WALLET NOW'}
      </motion.button>

      {/* ERROR MESSAGE */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-200 border-4 border-red-500 text-red-900 p-3 font-mono text-sm font-bold"
        >
          {error}
        </motion.div>
      )}

      {/* FALLBACK INSTALL BUTTON */}
      {!isInstalled && (
        <motion.a
          href="https://freighter.app"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brutal-yellow text-black text-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          📥 INSTALL FREIGHTER
        </motion.a>
      )}

      {/* DEBUG INFO */}
      <div className="text-xs font-mono text-gray-600 text-center p-2 border-2 border-gray-300">
        Status: {isLoading ? 'Connecting' : isConnected ? 'Connected' : isInstalled ? 'Ready to Connect' : 'Not Installed'}
      </div>
    </div>
  );
}
