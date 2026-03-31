export interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  isInstalled: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ConnectWalletResponse {
  publicKey: string;
}
