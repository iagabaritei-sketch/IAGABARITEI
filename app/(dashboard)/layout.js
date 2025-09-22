// /app/(dashboard)/layout.js
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { FaTachometerAlt, FaVideo, FaRobot, FaSignOutAlt } from 'react-icons/fa';
import { useEffect, useCallback } from 'react'; // <-- useCallback adicionado aqui
import AOS from 'aos';
import 'aos/dist/aos.css'; // Importa o CSS do AOS
import Particles from 'react-tsparticles'; // Importa Particles
import { loadSlim } from 'tsparticles-slim'; // Carrega o preset slim para particles



export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // Inicializa AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true, // Anima apenas uma vez
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/acesso');
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: FaTachometerAlt },
    { name: 'Aulas', href: '/aulas', icon: FaVideo },
    { name: 'Agente IA', href: '/agente-ia', icon: FaRobot },
  ];

  // Configurações das partículas
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // console.log(container); // Opcional: para debug
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans relative">

      {/* Background de Partículas */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#0a192f", // Cor de fundo principal
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: {
                enable: false,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "grab",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              grab: {
                distance: 150,
                links: {
                  opacity: 0.2
                }
              }
            },
          },
          particles: {
            color: {
              value: "#00bcd4", // Cor das partículas (cian)
            },
            links: {
              color: "#00bcd4",
              distance: 150,
              enable: true,
              opacity: 0.1,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.1,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
      
      {/* Container principal do layout para que o conteúdo fique por cima das partículas */}
      <div className="relative z-10 flex flex-grow"> {/* Removemos overflow-hidden daqui */}

        {/* Menu Lateral - Visível apenas em telas médias (md) ou maiores */}
        <aside className="hidden md:flex w-64 bg-gray-950/80 p-6 flex-col justify-between border-r border-cyan-500/10 backdrop-blur-sm">
          <div>
            <h1 className="text-3xl font-extrabold text-cyan-400 mb-10 tracking-wider">IA Gabaritei</h1>
            <nav className="space-y-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.name} href={link.href}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-cyan-400/10 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.1)]'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="font-bold">{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 rounded-lg transition-colors text-gray-400 hover:bg-red-500/10 hover:text-red-400"
          >
            <FaSignOutAlt className="h-5 w-5" />
            <span className="font-bold">Sair</span>
          </button>
        </aside>

        {/* Área de Conteúdo Principal - Com padding ajustado para o menu inferior */}
        <main className="flex-1 p-4 pb-24 md:p-10 overflow-auto custom-scrollbar"> {/* Apenas 'overflow-auto' */}


          {children}
        </main>

        {/* Menu Inferior - Visível apenas em telas pequenas (até md) */}
        <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-950/80 border-t border-cyan-500/10 p-2 flex justify-around items-center backdrop-blur-sm z-50">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.name} href={link.href}
                className={`flex flex-col items-center justify-center w-full p-2 rounded-lg transition-all duration-300 ${
                  isActive ? 'text-cyan-400' : 'text-gray-500'
                }`}
              >
                <link.icon className="h-6 w-6" />
                <span className="text-xs font-bold mt-1">{link.name}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center w-full p-2 rounded-lg text-gray-500"
          >
            <FaSignOutAlt className="h-6 w-6" />
            <span className="text-xs font-bold mt-1">Sair</span>
          </button>
        </footer>
      </div>
    </div>
  );
}