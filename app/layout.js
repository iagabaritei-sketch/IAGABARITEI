// /app/layout.js
import { Poppins } from 'next/font/google'; // Importa a fonte Poppins
import './globals.css';

// Configura a fonte Poppins com os pesos que vamos usar
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
});

export const metadata = {
  title: 'IA Gabaritei',
  description: 'Sua vantagem competitiva para a aprovação.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      {/* Aplica a classe da fonte no corpo do site */}
      <body className={poppins.className}>{children}</body>
    </html>
  );
}