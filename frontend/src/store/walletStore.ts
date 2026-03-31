import { create } from 'zustand';
import { WalletState } from '@/types/wallet';

interface WalletStore extends WalletState {
  setConnected: (isConnected: boolean) => void;
  setPublicKey: (publicKey: string | null) => void;
  setInstalled: (isInstalled: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: WalletState = {
  isConnected: false,
  publicKey: null,
  isInstalled: false,
  isLoading: false,
  error: null,
};

export const useWalletStore = create<WalletStore>((set) => ({
  ...initialState,
  setConnected: (isConnected) => set({ isConnected }),
  setPublicKey: (publicKey) => set({ publicKey }),
  setInstalled: (isInstalled) => set({ isInstalled }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
