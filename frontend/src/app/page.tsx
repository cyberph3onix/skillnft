'use client';

import { AnimatedHero, SkillCard } from '@/components';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      title: 'Blockchain Verified',
      description: 'Your skills are permanently recorded on the Stellar blockchain',
      color: 'blue' as const,
    },
    {
      title: 'Portable Credentials',
      description: 'Take your NFT resume anywhere in the Web3 ecosystem',
      color: 'yellow' as const,
    },
    {
      title: 'Transparent Portfolio',
      description: 'Let your achievements speak through verified on-chain data',
      color: 'red' as const,
    },
    {
      title: 'Community Powered',
      description: 'Get endorsements and validations from your professional network',
      color: 'green' as const,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <AnimatedHero />

      {/* Features Section */}
      <section className="py-20 bg-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-6xl md:text-7xl font-grotesk font-black mb-16 text-center">
            Why SkillNFT?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <SkillCard
                key={i}
                title={feature.title}
                description={feature.description}
                level="expert"
                color={feature.color}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white border-t-4 border-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-6xl md:text-7xl font-grotesk font-black mb-8">
            Ready to Go On-Chain?
          </h2>

          <p className="text-xl md:text-2xl font-inter mb-12 max-w-2xl mx-auto">
            Connect your Freighter wallet and start minting your skills as NFTs today.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/mint" className="btn-brutal-yellow text-lg font-bold">
              MINT SKILLS
            </Link>
            <Link href="/profile" className="btn-brutal-blue text-lg font-bold">
              VIEW PROFILE
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-grotesk font-bold text-lg mb-4">Product</h4>
              <ul className="space-y-2 font-inter text-sm">
                <li><Link href="/" className="hover:underline">Home</Link></li>
                <li><Link href="/mint" className="hover:underline">Mint</Link></li>
                <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-grotesk font-bold text-lg mb-4">Resources</h4>
              <ul className="space-y-2 font-inter text-sm">
                <li><a href="#" className="hover:underline">Documentation</a></li>
                <li><a href="#" className="hover:underline">Blog</a></li>
                <li><a href="#" className="hover:underline">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-grotesk font-bold text-lg mb-4">Community</h4>
              <ul className="space-y-2 font-inter text-sm">
                <li><a href="#" className="hover:underline">Discord</a></li>
                <li><a href="#" className="hover:underline">Twitter</a></li>
                <li><a href="#" className="hover:underline">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-grotesk font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 font-inter text-sm">
                <li><a href="#" className="hover:underline">Privacy</a></li>
                <li><a href="#" className="hover:underline">Terms</a></li>
                <li><a href="#" className="hover:underline">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t-4 border-black pt-8 text-center font-mono text-sm">
            <p>© 2024 SkillNFT Stellar | Built with 🚀 on Stellar Network</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
