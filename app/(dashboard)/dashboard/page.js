// /app/(dashboard)/dashboard/page.js
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Garante que o CSS do AOS seja carregado aqui também, se necessário
import StudyStreak from '@/components/StudyStreak'; // Adicione esta linha

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });

    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        
        // Calcula o progresso
        const { count: totalLessons, error: lessonsError } = await supabase
          .from('lessons')
          .select('*', { count: 'exact', head: true });

        const { count: completedLessons, error: completionsError } = await supabase
          .from('lesson_completions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id);
        
        if (totalLessons > 0) {
          const percentage = Math.round((completedLessons / totalLessons) * 100);
          setProgress(percentage);
        }
      }
    };
    fetchData();
  }, []);

  const userName = user?.email.split('@')[0] || 'Aluno(a)';

  return (
    <div className="min-h-full relative"> {/* Adicione 'relative' aqui */}
  <StudyStreak /> {/* Adicione o componente StudyStreak aqui */}

  <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight" data-aos="fade-up"/>
      
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight" data-aos="fade-up">
        Olá, <span className="text-cyan-400">{userName}</span>!
      </h1>
      <p className="text-xl text-gray-300 mb-12" data-aos="fade-up" data-aos-delay="150">Pronto para gabaritar hoje?</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card Principal - Agente IA */}
        <div 
          className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden transform hover:scale-[1.01] transition-all duration-300 group" 
          data-aos="fade-right" data-aos-delay="300"
        >
          {/* Efeito de brilho de fundo */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-cyan-400 mb-4">Seu Mentor Pessoal está Online</h2>
            <p className="mt-2 text-gray-300 text-lg leading-relaxed">Acesse o Agente Estrategista IA para criar seu plano de estudos, gerar questões e tirar todas as suas dúvidas. Ele está pronto para te impulsionar!</p>
          </div>
          <Link href="/agente-ia" className="mt-8 inline-block w-full text-center bg-cyan-500 text-gray-900 font-extrabold py-4 px-8 rounded-full hover:bg-cyan-400 hover:shadow-lg transition-all transform hover:scale-105 relative z-10">
            ATIVAR MEU ESTRATEGISTA
          </Link>
        </div>

        {/* Card Secundário - Aulas */}
        <div 
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-2xl p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden transform hover:scale-[1.01] transition-all duration-300 group"
          data-aos="fade-left" data-aos-delay="450"
        >
          {/* Efeito de brilho de fundo */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow delay-200"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">Arsenal de Conhecimento</h2>
            <p className="mt-2 text-gray-300 text-lg leading-relaxed">Acesse as aulas em vídeo e aprenda o método completo para dominar qualquer conteúdo.</p>
            
            <div className="w-full bg-gray-700 rounded-full h-3 mt-8">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-700 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-lg text-gray-400 font-semibold mt-3">Seu progresso no curso: <span className="text-emerald-400">{progress}%</span></p>
          </div>
          <Link href="/aulas" className="mt-8 inline-block w-full text-center bg-gray-700 text-white font-extrabold py-4 px-8 rounded-full hover:bg-gray-600 hover:shadow-lg transition-all transform hover:scale-105 relative z-10">
            CONTINUAR AULAS
          </Link>
        </div>
      </div>
    </div>
  );
}