import type { Metadata } from 'next';
import { Assistant, Frank_Ruhl_Libre } from 'next/font/google';
import '../globals.css';
import './admin.css';

const assistant = Assistant({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-assistant',
  display: 'swap',
});

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  weight: ['500', '700'],
  variable: '--font-frank',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ניהול לידים · אורי',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} ${frankRuhl.variable}`}>
      <body className="admin-body">{children}</body>
    </html>
  );
}
