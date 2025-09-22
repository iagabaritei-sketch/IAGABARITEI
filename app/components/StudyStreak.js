'use client';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { FaFire } from 'react-icons/fa';

export default function StudyStreak() {
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);

    const updateStreak = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setLoading(false);
            setStreak(0);
            return;
        }

        // 1. Tenta buscar o streak do usuário.
        const { data: userStreakData, error: fetchError } = await supabase
            .from('user_streaks')
            .select('last_active_date, streak_days')
            .eq('user_id', user.id)
            .single();

        // Verifica se houve um erro real (diferente de "nenhum registro encontrado").
        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error("Erro ao buscar streak do usuário:", fetchError);
            setLoading(false);
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data.

        const currentStreak = userStreakData?.streak_days || 0;
        const lastActiveDateStr = userStreakData?.last_active_date;

        let newStreak = 0;
        let shouldUpdateDB = false;

        if (!lastActiveDateStr) { // Se não há data, é o primeiro acesso.
            newStreak = 1;
            shouldUpdateDB = true;
        } else {
            const lastActive = new Date(lastActiveDateStr);
            // Corrige o problema de fuso horário ao converter a data do Supabase
            lastActive.setUTCHours(0, 0, 0, 0); 

            const diffTime = today.getTime() - lastActive.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) { // Acessou no dia seguinte -> incrementa.
                newStreak = currentStreak + 1;
                shouldUpdateDB = true;
            } else if (diffDays > 1) { // Quebrou a sequência -> reseta.
                newStreak = 1;
                shouldUpdateDB = true;
            } else { // Acessou no mesmo dia -> mantém.
                newStreak = currentStreak;
                shouldUpdateDB = false; // Não precisa atualizar o DB.
            }
        }

        setStreak(newStreak);

        // 2. Se for necessário, salva no banco de dados usando .upsert().
        if (shouldUpdateDB) {
            const newLastActiveDate = today.toISOString().split('T')[0];
            
            const { error: upsertError } = await supabase
                .from('user_streaks')
                .upsert({
                    user_id: user.id, // Chave do conflito.
                    last_active_date: newLastActiveDate,
                    streak_days: newStreak,
                }, { onConflict: 'user_id' }); // Diz ao Supabase para usar 'user_id' para decidir se insere ou atualiza.

            if (upsertError) {
    // Vamos forçar a exibição de todos os detalhes do erro
    console.error("--- INÍCIO DO ERRO DETALHADO ---");
    console.error("Erro em formato JSON:", JSON.stringify(upsertError, null, 2));
    console.error("Objeto de erro completo:", upsertError);
    console.error("--- FIM DO ERRO DETALHADO ---");
}
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        updateStreak();
    }, [updateStreak]);
    
    if (loading) {
        // Mostra um placeholder sutil enquanto carrega.
        return <div className="absolute top-4 right-4 h-10 w-24 bg-gray-800/70 rounded-full animate-pulse"></div>;
    }

    return (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2 border border-orange-500/30 shadow-lg text-white">
            <FaFire className="text-orange-500 text-xl animate-pulse" />
            <span className="font-bold text-lg">{streak} Dias</span>
        </div>
    );
}