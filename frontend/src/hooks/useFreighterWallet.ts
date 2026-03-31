'use client';

import { useEffect, useCallback } from 'react';
import { useWalletStore } from '@/store/walletStore';
import {
  getAddress,
  isConnected as freighterIsConnected,
  isAllowed,
  requestAccess,
  setAllowed,
  WatchWalletChanges,
} from '@stellar/freighter-api';

const getFreighterErrorMessage = (error: unknown): string => {
  if (!error) {
    return 'Unknown wallet error';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object' && 'message' in error) {
    const msg = (error as { message?: string }).message;
    if (msg) {
      return msg;
    }
  }

  return 'Unknown wallet error';
};

export function useFreighterWallet() {
  const store = useWalletStore();

  useEffect(() => {
    let isMounted = true;

    // Keep local wallet state synchronized with Freighter connection + permissions.
    const refreshWalletState = async () => {
      try {
        const connectedRes = await freighterIsConnected();
        const allowedRes = await isAllowed();

        if (!isMounted) {
          return;
        }

        const missingError = connectedRes.error || allowedRes.error;
        if (missingError) {
          store.setInstalled(false);
          store.setConnected(false);
          return;
        }

        store.setInstalled(true);
        const connected = connectedRes.isConnected || allowedRes.isAllowed;
        store.setConnected(connected);

        if (connected) {
          const addressRes = await getAddress();
          if (!isMounted) {
            return;
          }

          if (addressRes.error) {
            store.setError(addressRes.error.message);
            return;
          }

          store.setPublicKey(addressRes.address);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        store.setInstalled(false);
        store.setConnected(false);
        store.setError(getFreighterErrorMessage(error));
      }
    };

    refreshWalletState();

    // Freighter may change account/permission outside this tab, so poll for changes.
    const watcher = new WatchWalletChanges(2000);
    watcher.watch(() => {
      refreshWalletState();
    });

    return () => {
      isMounted = false;
      watcher.stop();
    };
  }, [store]);

  const connect = useCallback(async () => {
    try {
      store.setLoading(true);
      store.setError(null);

      // Request permission first, then request address for signing/minting flow.
      const allowRes = await setAllowed();
      if (allowRes.error || !allowRes.isAllowed) {
        throw new Error(
          allowRes.error?.message || 'Freighter access was not granted'
        );
      }

      const accessRes = await requestAccess();
      if (accessRes.error || !accessRes.address) {
        throw new Error(
          accessRes.error?.message || 'No wallet address returned from Freighter'
        );
      }

      store.setPublicKey(accessRes.address);
      store.setConnected(true);
      store.setInstalled(true);
      store.setLoading(false);

      return accessRes.address;
    } catch (error) {
      const message = getFreighterErrorMessage(error);
      store.setError(message);
      store.setLoading(false);
      throw error;
    }
  }, [store]);

  const disconnect = useCallback(() => {
    store.reset();
  }, [store]);

  return {
    isConnected: store.isConnected,
    publicKey: store.publicKey,
    isInstalled: store.isInstalled,
    isLoading: store.isLoading,
    error: store.error,
    connect,
    disconnect,
  };
}
