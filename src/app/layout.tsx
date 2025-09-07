import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { ParticleConnectkit } from '@/lib/particle';
import WagProvider from '@/lib/provider';
import { AuthProvider } from '@/features/auth/components/AuthProvider';
import { FloatingSupportWidget } from '@/components/FloatingSupportWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Digital Sensei - AI Agent Platform',
  description: 'Create, train, and interact with AI agents powered by Sensay AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ParticleConnectkit>
          <WagProvider>
            <AuthProvider apiKey={process.env.NEXT_PUBLIC_SENSAY_API_KEY_SECRET || ''}>
              <div className="min-h-screen bg-gray-50">
                {children}
                <FloatingSupportWidget useDefaultWidget={true} />
              </div>
            </AuthProvider>
          </WagProvider>
        </ParticleConnectkit>
      </body>
    </html>
  );
}