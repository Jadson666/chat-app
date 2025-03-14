import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <div className='w-full fixed bottom-0 bg-amber-300'>
          <Link className={buttonVariants({ variant: 'link' })} href='/chats'>
            Chats
          </Link>
          <Link className={buttonVariants({ variant: 'link' })} href='/profile'>
            Profile
          </Link>
        </div>
      </body>
    </html>
  );
}
