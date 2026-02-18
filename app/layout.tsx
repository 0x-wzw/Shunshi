import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
    title: 'Hourly Choice Engine | AI BaZi Analysis',
    description: 'Precision BaZi analysis and decision intelligence engine.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body className="font-sans bg-slate-950 text-slate-50 min-h-screen bg-mesh">
                {children}
            </body>
        </html>
    );
}
