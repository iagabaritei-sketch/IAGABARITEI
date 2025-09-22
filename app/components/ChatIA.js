// /app/components/ChatIA.js
'use client';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/utils/supabaseClient';
import { FaPaperPlane, FaSpinner, FaRobot, FaExternalLinkAlt, FaGem, FaComment, FaCode, FaBook } from 'react-icons/fa'; // Adicionados ícones
import Link from 'next/link';

export default function ChatIA() {
  const user = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll para o final das mensagens
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Carregar histórico do chat
  useEffect(() => {
    const loadChatHistory = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('chat_history')
          .select('id, message_content, role, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Erro ao carregar histórico do chat:', error);
        } else {
          setMessages(data.map(msg => ({
            id: msg.id,
            role: msg.role,
            text: msg.message_content,
            timestamp: msg.created_at
          })));
        }
      }
    };
    loadChatHistory();
  }, [user]);

  // Salvar mensagem no histórico
  const saveMessage = async (role, content) => {
    if (user) {
      const { data, error } = await supabase
        .from('chat_history')
        .insert({
          user_id: user.id,
          role: role,
          message_content: content
        });

      if (error) {
        console.error('Erro ao salvar mensagem:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    await saveMessage('user', input);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Falha na resposta da IA: ${errorData.details || res.statusText}`);
      }

      const data = await res.json();
      const updatedMessages = [...newMessages, { role: 'model', text: data.text }];
      setMessages(updatedMessages);
      await saveMessage('model', data.text);

    } catch (error) {
      console.error("Erro na comunicação com a IA:", error);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: `Ops! Houve um erro ao se comunicar com o Agente IA: ${error.message}. Tente novamente mais tarde ou use uma das IAs parceiras abaixo.` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Dados das IAs Parceiras
  const partnerAIs = [
    { name: 'Google Gemini', icon: FaGem, link: 'https://gemini.google.com/' },
    { name: 'ChatGPT', icon: FaComment, link: 'https://chat.openai.com/' },
    { name: 'DeepSeek Chat', icon: FaCode, link: 'https://chat.deepseek.com/' },
    { name: 'Claude AI', icon: FaBook, link: 'https://claude.ai/chats' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg shadow-xl border border-cyan-700/30">



      {/* Cabeçalho do Chat */}
      <div className="flex items-center p-4 bg-gray-950 border-b border-cyan-700/30">
        <FaRobot className="text-cyan-400 text-3xl mr-3" />
        <h2 className="text-2xl font-bold text-white">Agente Estrategista IA</h2>
      </div>

      {/* Área de Mensagens */}
<div className="flex flex-col flex-1 p-4 overflow-y-auto custom-scrollbar min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-lg">
            <FaRobot className="text-6xl mb-4 text-cyan-500 opacity-60" />
            <p className="text-center">
              Seu mentor IA está pronto! Digite sua primeira pergunta para começar.
            </p>
            <p className="text-sm mt-2">
              Ex: "Crie um plano de estudos para [meu objetivo]"
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg shadow-md break-words whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-cyan-600 text-white rounded-br-none'
                    : 'bg-gray-700 text-gray-100 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Formulário de Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-cyan-700/30 bg-gray-950 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte ao seu mentor IA..."
          className="flex-1 p-3 rounded-l-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-cyan-600 text-white p-3 rounded-r-lg hover:bg-cyan-500 transition-colors flex items-center justify-center w-12 h-12"
          disabled={loading}
        >
          {loading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaPaperPlane />
          )}
        </button>
      </form>

      {/* Seção de IAs Parceiras */}
      <div className="p-6 bg-gray-950 border-t border-cyan-700/30">

        <h3 className="text-xl font-bold text-white mb-4 text-center">
          <span className="text-red-400 mr-2">Inconsistência</span> no seu Mentor Estrategista?
        </h3>
        <p className="text-gray-400 text-center mb-6">
          Experimente uma de nossas IAs parceiras para uma perspectiva diferente ou em caso de instabilidade:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {partnerAIs.map((ai) => (
            <Link
              key={ai.name}
              href={ai.link}
              target="_blank" // Abre em nova aba
              rel="noopener noreferrer" // Segurança
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-all transform hover:scale-105 hover:bg-gray-700 hover:border-cyan-500 group"
              data-aos="zoom-in" data-aos-delay="100" // Animação
            >
              <ai.icon className="text-4xl text-cyan-400 mb-3 group-hover:text-cyan-300 transition-colors" />
              <span className="font-semibold text-white text-lg mb-1 group-hover:text-white transition-colors">
                {ai.name}
              </span>
              <FaExternalLinkAlt className="text-gray-500 text-sm group-hover:text-cyan-300 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}