import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sfinksas.albertborkovski.chatgpt.site'),
  title: 'Sfinksas — profesionali plaukų priežiūra',
  description: 'Atrinktos profesionalios plaukų priežiūros priemonės jūsų kasdieniam grožio ritualui.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sfinksas — grožio ritualas, sukurtas jums',
    description: 'Atrinkta profesionali plaukų priežiūra: šampūnai, kondicionieriai, aliejukai, priedai ir rinkiniai.',
    locale: 'lt_LT',
    type: 'website',
    url: '/',
    images: [{ url: '/og.png', width: 1672, height: 941, alt: 'Sfinksas — grožio ritualas, sukurtas jums' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sfinksas — grožio ritualas, sukurtas jums',
    description: 'Atrinkta profesionali plaukų priežiūra.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt">
      <head>
        <link rel="preload" as="image" href="/sfinksas-luxury-interior.webp" fetchPriority="high" />
        <link rel="preload" as="image" href="/home-category-products.webp" fetchPriority="high" />
      </head>
      <body>{children}</body>
    </html>
  );
}
