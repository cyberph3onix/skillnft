import type { SkillNFT, UploadResponse } from '@/types/skill';
import { toReadableErrorMessage } from '@/lib/errorUtils';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4000';

interface UploadPayload {
  title: string;
  description: string;
  proof: string;
  file: File | null;
}

function toSkillNFT(rawSkill: unknown): SkillNFT | null {
  if (!rawSkill || typeof rawSkill !== 'object') {
    return null;
  }

  const skill = rawSkill as Record<string, unknown>;
  const id = Number(skill.id ?? 0);
  const owner = String(skill.owner ?? '');

  if (!id || !owner) {
    return null;
  }

  return {
    id,
    owner,
    title: String(skill.title ?? ''),
    description: String(skill.description ?? ''),
    ipfs_hash: String(skill.ipfs_hash ?? ''),
    timestamp: Number(skill.timestamp ?? 0),
  };
}

export async function uploadSkillMetadata(payload: UploadPayload): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('description', payload.description);
  formData.append('proof', payload.proof);

  if (payload.file) {
    formData.append('file', payload.file);
  }

  const response = await fetch(`${BACKEND_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(toReadableErrorMessage(error, 'Upload failed'));
  }

  return (await response.json()) as UploadResponse;
}

export async function fetchSkillsByWallet(wallet: string): Promise<SkillNFT[]> {
  const response = await fetch(`${BACKEND_URL}/skills/${wallet}`);

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(toReadableErrorMessage(error, 'Failed to fetch wallet skills'));
  }

  const data = (await response.json()) as { wallet: string; skills: unknown[] };
  return (data.skills || []).map(toSkillNFT).filter((skill): skill is SkillNFT => skill !== null);
}
