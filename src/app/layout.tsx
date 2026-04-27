import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import ServiceWorkerRegistration from '@/components/shared/ServiceWorkerRegistration';

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Track your daily habits and build consistency',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased">
        <ServiceWorkerRegistration />
        <Toaster
          position="bottom-right"
          richColors
          duration={3000}
          toastOptions={{
            style: {
              borderRadius: '14px',
              fontSize: '13px',
              boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
