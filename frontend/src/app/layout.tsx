import type { Metadata } from 'next';
import { Navbar } from '@/components';
import './globals.css';

export const metadata: Metadata = {
  title: 'SkillNFT Stellar - Your Skills On-Chain Forever',
  description: 'Mint your resume as verifiable NFTs on Stellar blockchain. Build your Web3 identity.',
  keywords: ['NFT', 'Web3', 'Resume', 'Skills', 'Stellar', 'Blockchain'],
  creator: 'SkillNFT Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://skillnft-stellar.com',
    siteName: 'SkillNFT Stellar',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Navbar />
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
