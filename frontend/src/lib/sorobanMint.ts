import { signTransaction } from '@stellar/freighter-api';
import {
  Address,
  BASE_FEE,
  nativeToScVal,
  Networks,
  Operation,
  rpc,
  scValToNative,
  TransactionBuilder,
} from '@stellar/stellar-sdk';
import { CONTRACT_ID, SOROBAN_RPC_URL, STELLAR_NETWORK, TESTNET_PASSPHRASE } from '@/lib/stellarConfig';
import type { MintResult } from '@/types/skill';

interface MintSkillArgs {
  walletAddress: string;
  title: string;
  description: string;
  ipfsHash: string;
  timestamp: number;
  onStatusChange?: (status: 'signing' | 'submitting') => void;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getNetworkPassphrase = () =>
  STELLAR_NETWORK === 'testnet' ? TESTNET_PASSPHRASE : Networks.PUBLIC;

const getExplorerTxUrl = (txHash: string) => {
  const network = STELLAR_NETWORK === 'testnet' ? 'testnet' : 'public';
  return `https://stellar.expert/explorer/${network}/tx/${txHash}`;
};

const toValidSkillId = (value: unknown): number => {
  if (value === null || value === undefined) {
    throw new Error('Invalid contract return value: skillId is null or undefined');
  }

  const numeric = typeof value === 'bigint' ? Number(value) : Number(value);
  if (!Number.isFinite(numeric)) {
    throw new Error(`Invalid contract return value for skillId: ${String(value)}`);
  }

  return numeric;
};

export async function mintSkillOnChain(args: MintSkillArgs): Promise<MintResult> {
  const networkPassphrase = getNetworkPassphrase();

  const server = new rpc.Server(SOROBAN_RPC_URL, {
    allowHttp: SOROBAN_RPC_URL.startsWith('http://'),
  });

  const sourceAccount = await server.getAccount(args.walletAddress);

  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    // Invoke contract mint_skill(user, title, description, ipfs_hash, timestamp).
    .addOperation(
      Operation.invokeContractFunction({
        contract: CONTRACT_ID,
        function: 'mint_skill',
        args: [
          Address.fromString(args.walletAddress).toScVal(),
          nativeToScVal(args.title, { type: 'string' }),
          nativeToScVal(args.description, { type: 'string' }),
          nativeToScVal(args.ipfsHash, { type: 'string' }),
          nativeToScVal(BigInt(args.timestamp), { type: 'u64' }),
        ],
      })
    )
    .setTimeout(60)
    .build();

  const preparedTx = await server.prepareTransaction(transaction);

  args.onStatusChange?.('signing');

  const signed = await signTransaction(preparedTx.toXDR(), {
    networkPassphrase,
    address: args.walletAddress,
  });

  if (signed.error || !signed.signedTxXdr) {
    throw new Error(signed.error?.message || 'Wallet rejected transaction signing');
  }

  const signedTx = TransactionBuilder.fromXDR(signed.signedTxXdr, networkPassphrase);

  args.onStatusChange?.('submitting');
  const sendResponse = await server.sendTransaction(signedTx);

  if (sendResponse.status === 'ERROR' || sendResponse.status === 'TRY_AGAIN_LATER') {
    throw new Error(
      `Transaction submission failed with status ${sendResponse.status}`
    );
  }

  const txHash = sendResponse.hash;
  const explorerUrl = getExplorerTxUrl(txHash);

  for (let attempt = 0; attempt < 25; attempt += 1) {
    const txResult = await server.getTransaction(txHash);

    if (txResult.status === rpc.Api.GetTransactionStatus.SUCCESS) {
      if (txResult.returnValue === undefined || txResult.returnValue === null) {
        throw new Error(
          `Transaction succeeded but return value is missing. Explorer: ${explorerUrl}`
        );
      }

      const rawSkillId = scValToNative(txResult.returnValue);
      const skillId = toValidSkillId(rawSkillId);

      return {
        success: true,
        txHash,
        skillId,
      };
    }

    if (txResult.status === rpc.Api.GetTransactionStatus.FAILED) {
      throw new Error(`Mint transaction failed on-chain. Explorer: ${explorerUrl}`);
    }

    await wait(1500);
  }

  throw new Error(`Transaction timed out before confirmation. Explorer: ${explorerUrl}`);
}
