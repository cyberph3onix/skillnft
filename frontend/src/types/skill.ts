export type TransactionPhase =
  | 'idle'
  | 'uploading'
  | 'signing'
  | 'submitting'
  | 'success'
  | 'failed';

export interface SkillMetadata {
  title: string;
  description: string;
  proof: string;
  file: string;
  timestamp: number;
}

export interface SkillNFT {
  id: number;
  owner: string;
  title: string;
  description: string;
  ipfs_hash: string;
  timestamp: number;
  metadata_url?: string;
}

export interface UploadResponse {
  ipfs_hash: string;
  metadata_url: string;
}

export interface MintResult {
  success: true;
  txHash: string;
  skillId: number;
}
