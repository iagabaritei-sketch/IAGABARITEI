// /app/(dashboard)/aulas/page.js
'use client';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { FaCheckCircle, FaCircle } from 'react-icons/fa'; // Ícones para o status da aula

export default function AulasPage() {
    const [lessons, setLessons] = useState([]);
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [activeLessonId, setActiveLessonId] = useState(null); // ID da aula atualmente sendo assistida
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    // Função para carregar os dados
    const fetchData = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setLoading(false);
            return;
        }
        setUserId(user.id);

        // Pega todas as aulas
        const { data: lessonsData, error: lessonsError } = await supabase
            .from('lessons')
            .select('*')
            .order('order', { ascending: true });

        // Pega as aulas que o usuário já completou
        const { data: completionsData, error: completionsError } = await supabase
            .from('lesson_completions')
            .select('lesson_id')
            .eq('user_id', user.id);

        if (lessonsData) {
            setLessons(lessonsData);
            // Define a primeira aula como ativa se nenhuma estiver salva ou se for o primeiro acesso
            if (lessonsData.length > 0 && !activeLessonId) {
                // Tenta encontrar a primeira aula não concluída
                const firstUncompleted = lessonsData.find(lesson => !new Set(completionsData?.map(c => c.lesson_id)).has(lesson.id));
                setActiveLessonId(firstUncompleted ? firstUncompleted.id : lessonsData[0].id);
            }
        }
        if (completionsData) {
            setCompletedLessons(new Set(completionsData.map(c => c.lesson_id)));
        }
        setLoading(false);
    }, [activeLessonId]); // Recarrega se activeLessonId mudar

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCompleteLesson = async (lessonId) => {
        if (userId && !completedLessons.has(lessonId)) {
            const { error } = await supabase
                .from('lesson_completions')
                .insert({ user_id: userId, lesson_id: lessonId });
            
            if (!error) {
                setCompletedLessons(prev => new Set(prev).add(lessonId));
                // Lógica de ir para a próxima aula
                const currentIndex = lessons.findIndex(lesson => lesson.id === lessonId);
                if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
                    setActiveLessonId(lessons[currentIndex + 1].id); // Vai para a próxima aula
                } else {
                    // Se for a última aula, pode redirecionar para o dashboard ou mostrar mensagem
                    alert('Parabéns! Você concluiu todas as aulas!');
                }
            } else {
                console.error("Erro ao marcar aula como concluída:", error);
            }
        }
    };

    const activeLesson = lessons.find(lesson => lesson.id === activeLessonId);

    if (loading) return <p className="text-cyan-400 p-4">Carregando aulas...</p>;
    if (lessons.length === 0) return <p className="text-gray-400 p-4">Nenhuma aula disponível ainda.</p>;

    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-100px)] lg:min-h-0 bg-gray-900 rounded-lg overflow-hidden border border-cyan-500/10 shadow-lg">
            {/* Coluna da Lista de Aulas (à esquerda em desktop, em cima em mobile) */}
            <aside className="lg:w-1/3 p-4 bg-gray-950 border-b lg:border-r border-cyan-500/10 overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Módulos do Curso</h2>
                <nav className="space-y-2">
                    {lessons.map((lesson) => (
                        <button
                            key={lesson.id}
                            onClick={() => setActiveLessonId(lesson.id)}
                            className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-300 group ${
                                activeLessonId === lesson.id
                                    ? 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.1)]'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            {completedLessons.has(lesson.id) ? (
                                <FaCheckCircle className="h-5 w-5 text-green-500 mr-3 group-hover:scale-110 transition-transform" />
                            ) : (
                                <FaCircle className="h-5 w-5 text-gray-600 mr-3 group-hover:text-white transition-colors" />
                            )}
                            <span className="font-bold">Aula {lesson.order}: {lesson.title}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Coluna do Player de Vídeo e Detalhes (à direita em desktop, em baixo em mobile) */}
            <main className="flex-1 p-4 lg:p-8 bg-gray-900">
                {activeLesson ? (
                    <>
                        {/* Player de Vídeo Responsivo */}
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-6 bg-black">
                            <div 
                                className="absolute top-0 left-0 w-full h-full"
                                dangerouslySetInnerHTML={{ __html: activeLesson.video_url }}
                            />
                        </div>

                        <h3 className="font-bold text-3xl text-white mb-2">{activeLesson.title}</h3>
                        <p className="text-lg text-gray-400 mb-6">{activeLesson.description}</p>

                        <button
                            onClick={() => handleCompleteLesson(activeLesson.id)}
                            disabled={completedLessons.has(activeLesson.id)}
                            className="w-full lg:w-auto font-bold py-3 px-8 rounded-lg transition-colors disabled:bg-green-600 disabled:opacity-70 disabled:cursor-not-allowed bg-cyan-500 text-gray-900 hover:bg-cyan-400 hover:scale-105"
                        >
                            {completedLessons.has(activeLesson.id) ? '✓ Aula Concluída!' : 'Marcar como Concluída'}
                        </button>
                    </>
                ) : (
                    <p className="text-gray-400 text-center text-xl mt-10">Selecione uma aula ao lado para começar.</p>
                )}
            </main>
        </div>
    );
}