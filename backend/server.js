require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');

const { uploadSkillMetadata } = require('./ipfsService');
const { getSkillsByUser } = require('./sorobanService');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const PORT = Number(process.env.PORT || 4000);
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
  })
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Upload metadata to Pinata and return canonical IPFS identifiers.
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, description, proof } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'title and description are required' });
    }

    const timestamp = Date.now();

    const metadata = {
      title,
      description,
      proof: proof || '',
      file: req.file ? req.file.originalname : '',
      timestamp,
    };

    const ipfs = await uploadSkillMetadata(metadata);

    return res.json({
      ipfs_hash: ipfs.ipfs_hash,
      metadata_url: ipfs.metadata_url,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'IPFS upload failed',
      reason: error instanceof Error ? error.message : String(error),
    });
  }
});

// Fetch on-chain skills for a wallet from Soroban contract state.
app.get('/skills/:wallet', async (req, res) => {
  try {
    const wallet = req.params.wallet;
    if (!wallet) {
      return res.status(400).json({ error: 'wallet is required' });
    }

    const skills = await getSkillsByUser(wallet);
    return res.json({ wallet, skills });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch skills from contract',
      reason: error instanceof Error ? error.message : String(error),
    });
  }
});

app.listen(PORT, () => {
  console.log(`SkillNFT backend listening on port ${PORT}`);
});
