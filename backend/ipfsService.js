const PinataSDK = require('@pinata/sdk');

function buildClient() {
  const jwt = process.env.PINATA_JWT;
  const apiKey = process.env.PINATA_API_KEY;
  const secretApiKey = process.env.PINATA_SECRET_API_KEY;

  // Prefer scoped JWT in production; keep key/secret fallback for local setups.
  if (jwt && jwt !== 'REPLACE_THIS') {
    return new PinataSDK({ pinataJWTKey: jwt });
  }

  if (!apiKey || !secretApiKey || apiKey === 'REPLACE_THIS' || secretApiKey === 'REPLACE_THIS') {
    throw new Error('Pinata credentials are not configured');
  }

  return new PinataSDK({ pinataApiKey: apiKey, pinataSecretApiKey: secretApiKey });
}

async function uploadSkillMetadata(metadata) {
  const pinata = buildClient();

  // Persist only canonical metadata that contract/indexers need to verify credentials.
  const pinataPayload = {
    name: metadata.title,
    description: metadata.description,
    proof: metadata.proof || '',
    timestamp: metadata.timestamp || Date.now(),
  };

  const result = await pinata.pinJSONToIPFS(pinataPayload);

  return {
    ipfs_hash: result.IpfsHash,
    metadata_url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
  };
}

module.exports = {
  uploadSkillMetadata,
};
