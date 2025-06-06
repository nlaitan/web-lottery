import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SortAr – Sorteos en línea',
  description:
    'Realiza sorteos aleatorios de forma simple: agrega participantes, define cuántos ganadores habrá y obtén resultados instantáneos.',
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
