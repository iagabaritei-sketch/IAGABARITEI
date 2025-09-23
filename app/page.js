import Link from 'next/link';
import { FaBrain, FaRocket, FaGraduationCap, FaStar } from 'react-icons/fa';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>
        
        {/* Partículas decorativas */}
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Ícones decorativos */}
        <div className="flex justify-center space-x-6 mb-8">
          <div className="p-4 bg-cyan-500/10 rounded-full border border-cyan-500/30">
            <FaBrain className="text-4xl text-cyan-400" />
          </div>
          <div className="p-4 bg-purple-500/10 rounded-full border border-purple-500/30">
            <FaGraduationCap className="text-4xl text-purple-400" />
          </div>
          <div className="p-4 bg-violet-500/10 rounded-full border border-violet-500/30">
            <FaRocket className="text-4xl text-violet-400" />
          </div>
        </div>

        {/* Título principal */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Bem-vindo ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">IA Gabaritei</span>!
        </h1>

        {/* Subtítulo */}
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Sua plataforma de estudos inteligente que usa inteligência artificial para potencializar sua preparação para o ENEM e concursos.
        </p>

        {/* Botão de acesso */}
        <Link href="/acesso">
          <button className="group relative bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-4 px-10 rounded-xl text-lg md:text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30">
            <span className="relative z-10 flex items-center justify-center">
              Acessar Plataforma
              <FaStar className="ml-2 group-hover:rotate-12 transition-transform" />
            </span>
            
            {/* Efeito de brilho no hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </button>
        </Link>

        {/* Informações adicionais */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
          <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="text-cyan-400 text-2xl mb-2">🚀</div>
            <p className="font-semibold">Estudo Inteligente</p>
            <p className="text-sm mt-1">Potencialize seus resultados</p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="text-purple-400 text-2xl mb-2">🎯</div>
            <p className="font-semibold">Foco na Aprovação</p>
            <p className="text-sm mt-1">Métodos comprovados</p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="text-violet-400 text-2xl mb-2">💡</div>
            <p className="font-semibold">Tecnologia IA</p>
            <p className="text-sm mt-1">Aprendizado personalizado</p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-12 text-gray-400 text-sm">
          <p>Junte-se a milhares de estudantes que já transformaram seus sonhos em realidade</p>
        </div>
      </div>

      {/* Efeito de brilho sutil */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none"></div>
    </div>
  );
}