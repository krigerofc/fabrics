// app/test/page.tsx

// 1. Adicionamos esta diretiva para garantir que a página sempre seja renderizada
// no servidor durante a requisição (Server-Side Rendering - SSR),
// e não estaticamente, o que garante o acesso aos cookies.
export const dynamic = 'force-dynamic'; 

import { AuthServer } from "@/backend/auth/auth";

export default async function AuthTestPage() {
    // 2. Chamamos o método que tenta buscar o ID de forma segura no servidor.
    const userId = await AuthServer.Get_UserId();

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1>🧪 Teste de Autenticação do Servidor</h1>
            <p>Abaixo está o resultado da chamada direta a `AuthServer.getUserId()`:</p>
            
            {/* 3. Exibe o resultado. */}
            {userId ? (
                <div style={{ color: 'green', fontWeight: 'bold', fontSize: '1.2em' }}>
                    ✅ SESSÃO ENCONTRADA! ID de Usuário: {userId}
                </div>
            ) : (
                <div style={{ color: 'red', fontWeight: 'bold', fontSize: '1.2em' }}>
                    ❌ SESSÃO NULA. Verifique `NEXTAUTH_SECRET` e `authOptions`.
                </div>
            )}
        </div>
    );
}