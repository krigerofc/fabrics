'use client'

import { useState } from "react"
// useSession REMOVIDO
import { signIn, signOut } from "next-auth/react" 
import { useRouter } from "next/navigation"

export default function Home() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState(''); 
    const [isRegisterMode, setIsRegisterMode] = useState(true); 
    const [error, setError] = useState<string | null>(null);

    // useSession e status da sessão removidos

    const router = useRouter(); 
    const API_URL_REGISTER = '/api/backend/user/register'; 

    // --- 1. HANDLER DE REGISTRO (Seu código original) ---
    const HandlerRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirm_password) {
            setError("As senhas não coincidem.");
            return;
        }

        try {
            const res = await fetch(API_URL_REGISTER, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, password, confirm_password })
            });

            const data = await res.json();
            
            if (res.ok) { 
                setIsRegisterMode(false); 
                setEmail(email); 
                setPassword(''); 
                setConfirmPassword('');
                alert("Registro concluído! Por favor, faça login.");
            } else {
                setError(data.error || "Erro ao registrar usuário.");
                console.error("Erro no registro:", data);
            }

        } catch (fetchError) {
            setError("Ocorreu um erro na rede ou servidor.");
            console.error("Erro na chamada de registro:", fetchError);
        }
    } 

    // --- 2. HANDLER DE LOGIN (Usando signIn do NextAuth.js) ---
    const HandlerLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        try {
            // Mantendo o signIn para o NextAuth.js, conforme solicitado
            const result = await signIn('credentials', {
                redirect: false, 
                email,
                password
            });

            if (result?.error) {
                setError("Falha no Login: Verifique seu e-mail e senha.");
            } else {
                // Redireciona para o dashboard após login bem-sucedido
                router.push('/dashboard'); 
            }
        } catch (error) {
            setError("Ocorreu um erro inesperado no login.");
            console.error("Erro no login:", error);
        }
    }
    
    // Removido o código de 'loading' e 'authenticated'
    
    // Se o usuário não está autenticado (e não verificamos o status), exibe o formulário de Login/Registro
    return (
        <div className="flex flex-col items-center mt-10">
            {/* Mensagem de Erro Global */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-80">
                    {error}
                </div>
            )}

            <form 
                className="bg-white flex flex-col p-6 gap-4 rounded-xl shadow-md w-80"
                onSubmit={isRegisterMode ? HandlerRegister : HandlerLogin}
            >
                {/* ... (Seu formulário de login/registro aqui) ... */}
                <h2 className="text-xl font-bold text-center text-black">
                    {isRegisterMode ? "Criar Conta (Registro)" : "Entrar (Login)"}
                </h2>
                
                <input
                    type="email"
                    value={email}
                    placeholder="seuemail@email.com"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 p-2 rounded text-black"
                />
                {isRegisterMode && (
                    <input
                        type="text"
                        value={name}
                        placeholder="seu nome"
                        required
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 p-2 rounded text-black"
                    />
                )}
                <input
                    type="password"
                    value={password}
                    placeholder="sua senha"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 p-2 rounded text-black"
                />
                {isRegisterMode && (
                    <input
                        type="password"
                        value={confirm_password}
                        placeholder="confirme sua senha"
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border border-gray-300 p-2 rounded text-black"
                    />
                )}

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
                >
                    {isRegisterMode ? "Registrar" : "Entrar"}
                </button>
            </form>
            
            {/* Botão de Alternância de Modo */}
            <button
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="mt-4 text-blue-600 hover:underline text-sm"
            >
                {isRegisterMode ? "Já tem conta? Faça Login" : "Não tem conta? Registre-se"}
            </button>
            
            {/* Botão de Sair (Logout) - Mantido caso você queira usá-lo */}
            <button 
                // Chama o signOut do NextAuth.js para limpar a sessão
                onClick={() => signOut({ callbackUrl: '/' })} 
                className="mt-6 bg-red-500 hover:bg-red-600 text-white p-2 rounded transition text-sm"
            >
                Sair (Logout)
            </button>
        </div>
    )
}