// /app/acesso/page.js
'use client';
import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient'; // Importando nossa conexão

export default function AcessoPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Controla se é tela de Login ou Cadastro
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (isLogin) {
        // Lógica de LOGIN
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // O redirecionamento será tratado pelo Supabase
        setMessage('Login bem-sucedido! Redirecionando...');
        window.location.href = '/dashboard'; 
      } else {
        // Lógica de CADASTRO
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg border border-cyan-500/30">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-cyan-400">IA Gabaritei</h1>
          <p className="mt-2 text-gray-400">{isLogin ? 'Acesse sua Vantagem Competitiva' : 'Crie sua Conta de Acesso'}</p>
        </div>
        
        {message && <p className="text-sm text-green-400 text-center">{message}</p>}
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha forte"
              className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-gray-900 bg-cyan-400 rounded-md hover:bg-cyan-300 transition-colors"
          >
            {isLogin ? 'ENTRAR NO COMANDO' : 'CRIAR MINHA CONTA'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          {isLogin ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}
          <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-cyan-400 hover:underline ml-1">
            {isLogin ? 'Cadastre-se' : 'Faça Login'}
          </button>
        </p>
      </div>
    </div>
  );
}