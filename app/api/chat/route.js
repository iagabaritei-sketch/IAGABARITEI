import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages } = await request.json();

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      console.error("ERRO CRÍTICO: Chave de API GEMINI_API_KEY não encontrada.");
      return NextResponse.json(
        { error: "Chave de API do Google não configurada." },
        { status: 500 }
      );
    }

    const systemInstruction = `Você é o "Mentor de Aprovação IA", um especialista em aprendizado de alta performance e estratégias para concursos públicos e ENEM. Sua única missão é guiar o usuário, partindo do absoluto zero se necessário, até a aprovação. Você é paciente, didático, motivador e, acima de tudo, extremamente metódico. NUNCA aceite respostas vagas do usuário. Sempre peça detalhes e justifique o porquê. Seja proativo e sugira ferramentas como flashcards e questões.`;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    // --- LÓGICA DE HISTÓRICO SIMPLIFICADA ---

    // 1. A última mensagem é a que o usuário acabou de enviar.
    const lastUserMessage = messages[messages.length - 1];

    // 2. O histórico são todas as mensagens ANTERIORES à última.
    // Filtramos a primeira mensagem do modelo, pois ela é apenas uma saudação inicial.
    const historyFromFrontend = messages.slice(0, -1);
    const history = historyFromFrontend
      .filter((msg, index) => !(index === 0 && msg.role === 'model'))
      .map(msg => ({
        // Os papéis 'user' e 'model' já correspondem ao que a API espera.
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

    // -----------------------------------------

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastUserMessage.text);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ text: text });

  } catch (error) {
    console.error("[ERRO NA API DO GEMINI]:", error);
    return NextResponse.json(
      { error: "Erro ao se comunicar com o serviço de IA. Verifique o terminal do servidor." },
      { status: 500 }
    );
  }
}