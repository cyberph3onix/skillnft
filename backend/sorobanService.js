const {
  Account,
  Address,
  BASE_FEE,
  Keypair,
  Networks,
  Operation,
  rpc,
  scValToNative,
  TransactionBuilder,
  xdr,
} = require('@stellar/stellar-sdk');

const CONTRACT_ID = process.env.SOROBAN_CONTRACT_ID || process.env.CONTRACT_ID;
const NETWORK = process.env.SOROBAN_NETWORK || 'testnet';
const SOROBAN_RPC_URL =
  process.env.SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';

function getNetworkPassphrase() {
  if (NETWORK === 'public') {
    return Networks.PUBLIC;
  }

  return 'Test SDF Network ; September 2015';
}

function createSimulationAccount() {
  return new Account(Keypair.random().publicKey(), '0');
}

function decodeScVal(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    const fromXdr = xdr.ScVal.fromXDR(value, 'base64');
    return scValToNative(fromXdr);
  }

  return scValToNative(value);
}

function fromMapOrObject(input) {
  if (input instanceof Map) {
    return Object.fromEntries(input.entries());
  }

  if (input && typeof input === 'object' && !Array.isArray(input)) {
    return input;
  }

  return null;
}

function readObjectField(objectLike, keys, fallback = null) {
  const parsed = fromMapOrObject(objectLike);
  if (!parsed) {
    return fallback;
  }

  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(parsed, key)) {
      return parsed[key];
    }
  }

  return fallback;
}

function toNumberish(value, fallback = 0) {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === 'bigint') {
    return Number(value);
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeSkill(raw, index, wallet) {
  if (Array.isArray(raw)) {
    return {
      id: toNumberish(raw[0], index + 1),
      owner: String(raw[1] || wallet),
      title: String(raw[2] || ''),
      description: String(raw[3] || ''),
      ipfs_hash: String(raw[4] || ''),
      timestamp: toNumberish(raw[5], 0),
    };
  }

  const id = toNumberish(readObjectField(raw, ['id', 'skill_id']), index + 1);
  const owner = String(readObjectField(raw, ['owner', 'user'], wallet) || wallet);
  const title = String(readObjectField(raw, ['title', 'name'], '') || '');
  const description = String(readObjectField(raw, ['description', 'details'], '') || '');
  const ipfsHash = String(
    readObjectField(raw, ['ipfs_hash', 'ipfsHash', 'cid', 'hash'], '') || ''
  );
  const timestamp = toNumberish(readObjectField(raw, ['timestamp', 'created_at']), 0);

  return {
    id,
    owner,
    title,
    description,
    ipfs_hash: ipfsHash,
    timestamp,
  };
}

async function getSkillsByUser(wallet) {
  if (!CONTRACT_ID) {
    throw new Error('SOROBAN_CONTRACT_ID is missing');
  }

  if (!wallet) {
    throw new Error('wallet is required');
  }

  const networkPassphrase = getNetworkPassphrase();
  const server = new rpc.Server(SOROBAN_RPC_URL, {
    allowHttp: SOROBAN_RPC_URL.startsWith('http://'),
  });

  const tx = new TransactionBuilder(createSimulationAccount(), {
    fee: BASE_FEE,
    networkPassphrase,
  })
    // Read-only contract call via simulation: get_skills_by_user(wallet).
    .addOperation(
      Operation.invokeContractFunction({
        contract: CONTRACT_ID,
        function: 'get_skills_by_user',
        args: [Address.fromString(wallet).toScVal()],
      })
    )
    .setTimeout(30)
    .build();

  const simulation = await server.simulateTransaction(tx);

  const isSimulationError =
    typeof rpc.Api.isSimulationError === 'function'
      ? rpc.Api.isSimulationError(simulation)
      : Boolean(simulation.error);

  if (isSimulationError) {
    throw new Error(`Contract simulation failed: ${simulation.error}`);
  }

  const rawReturnValue = simulation.result?.retval ?? simulation.results?.[0]?.retval;
  if (rawReturnValue === undefined || rawReturnValue === null) {
    return [];
  }

  const decoded = decodeScVal(rawReturnValue);
  const list = Array.isArray(decoded) ? decoded : [];
  const skills = list.map((entry, index) => normalizeSkill(entry, index, wallet));

  return skills;
}

async function fetchSkillsByWallet(wallet) {
  return getSkillsByUser(wallet);
}

module.exports = {
  getSkillsByUser,
  fetchSkillsByWallet,
};
