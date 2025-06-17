import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ChatBubble from '@/components/ChatBubble';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Hashiko | Ajuda e Respostas',
  description: 'Encontre ajuda e respostas para suas perguntas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <div className="flex flex-col h-screen">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8 md:p-12">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
