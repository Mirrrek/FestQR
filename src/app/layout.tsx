import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import '@/styles/globals.css';

const font = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'FestQR'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return <html lang='en'>
        <body className={font.className}>{children}</body>
    </html>
}
