import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <h1 className="text-8xl font-grotesk font-bold text-black border-4 border-black p-8 mb-6 inline-block">
          404
        </h1>
        <h2 className="text-4xl font-grotesk font-bold text-black mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-700 mb-8 font-mono">
          Sorry, the page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block btn-brutal-blue text-white font-bold py-3 px-6"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
