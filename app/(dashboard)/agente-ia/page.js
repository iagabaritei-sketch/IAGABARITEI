// /app/(dashboard)/agente-ia/page.js
'use client';
import ChatIA from '@/components/ChatIA'; // Importe seu componente ChatIA

export default function AgenteIAPage() {
  return (
    <div className="flex flex-col h-full p-4 sm:p-6 md:p-8">

      <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 tracking-tight">Agente Estrategista IA</h1>
      <p className="text-lg text-gray-400 mb-8">Seu mentor pessoal 24/7 está pronto para te ajudar.</p>

      {/* O ChatIA precisa estar dentro de um contêiner que permite seu flex-grow */}
      <div className="flex-1 min-h-0"> {/* flex-1 e min-h-0 são importantes aqui */}
        <ChatIA />
      </div>
    </div>
  );
}