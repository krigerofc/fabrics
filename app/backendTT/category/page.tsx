'use client'; 

import React, { useState, useEffect } from 'react';

// --- Tipos de Dados ---
interface Category {
  id: string; 
  name: string;
}

// --- Componente Principal ---
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Controla a busca inicial
  const [isCreating, setIsCreating] = useState(false); // NOVO: Controla a criação
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // NOVO: ID da categoria sendo deletada
  const [statusMessage, setStatusMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Cores de status (Mantido)
  const statusColors = {
    success: 'bg-green-100 text-green-800 border-green-400',
    error: 'bg-red-100 text-red-800 border-red-400',
    info: 'bg-blue-100 text-blue-800 border-blue-400',
  };

  /**
   * Função que executa a busca de categorias. 
   */
  const fetchCategories = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const response = await fetch('/api/backend/category/get_all'); 
      const data = await response.json(); 

      if (!response.ok || !data.success) {
          const errorMessage = data.message || 'Falha ao buscar categorias.';
          throw new Error(errorMessage);
      }
      
      // 🎯 CORREÇÃO: Mapeia o array corretamente.
      const fetchedCategories: Category[] = data.categories.map((cat: any) => ({
          id: cat.id, 
          name: cat.name 
      }));

      setCategories(fetchedCategories || []); 
      setStatusMessage({ message: data.message || 'Categorias carregadas.', type: 'success' });
      
    } catch (error: any) {
      console.error('Erro ao buscar categorias:', error);
      setStatusMessage({ message: error.message || 'Erro ao carregar categorias. Verifique a API.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);


  /**
   * Função para CRIAR uma nova categoria (INTEGRAÇÃO API)
   */
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) return;

    if(isCreating) return; // Evita envio duplo

    setStatusMessage(null);
    setIsCreating(true);
    
    try {
      const response = await fetch('/api/backend/category/create', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName }) 
      });

      const data = await response.json();
      
      if(!response.ok || data.success == false) {
          throw new Error(data.message || 'Erro desconhecido ao criar.');
      }
      
      // Adiciona o objeto Category completo (id e name)
      setCategories(prev => [...prev, { id: data.category.id, name: data.category.name }]); 
      setNewCategoryName('');
      setStatusMessage({ message: `Categoria "${data.category.name}" criada.`, type: 'success' });
    } catch (error: any) {
      console.error('Erro ao criar categoria:', error);
      setStatusMessage({ message: error.message || 'Erro ao criar categoria.', type: 'error' });
    } finally {
        setIsCreating(false);
    }
  };

  /**
   * Função para DELETAR uma categoria (INTEGRAÇÃO API)
   */
const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja deletar a categoria "${name}"?`)) {
      return;
    }

    setStatusMessage(null);
    setIsDeleting(id); // Bloqueia este item específico

    try {
      // Faz a chamada POST para o backend
      const response = await fetch(`/api/backend/category/delete`, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoryId: id }) // Usando 'categoryId' para corresponder ao backend
      });

      const data = await response.json();
      
      if (!response.ok || data.success === false) {
          // O backend retorna a mensagem de erro (ex: dependências, permissão)
          // É CRUCIAL que o backend envie data.message em caso de falha.
          throw new Error(data.message || 'Falha desconhecida ao deletar.');
      }
      
      // ✅ SUCESSO: Remove do frontend e MOSTRA MENSAGEM DE SUCESSO
      setCategories(prev => prev.filter(cat => cat.id !== id));
      setStatusMessage({ 
          message: data.message || `Categoria "${name}" deletada com sucesso.`, 
          type: 'success' 
      });

    } catch (error: any) {
      console.error('Erro ao deletar categoria:', error);
      // ❌ FALHA: MOSTRA MENSAGEM DE ERRO (incluindo erros de dependência/autenticação)
      setStatusMessage({ 
          message: error.message || 'Erro ao deletar categoria. Verifique o console.', 
          type: 'error' 
      });
    } finally {
        setIsDeleting(null); // Libera o botão
    }
  };

  // Função para ENCONTRAR ID pelo Nome (Mantido)
  const handleSearchByName = () => {
    setStatusMessage(null);
    const foundCategory = categories.find(cat => cat.name.toLowerCase() === searchTerm.trim().toLowerCase());
    
    if (foundCategory) {
      setStatusMessage({ 
        message: `ID para "${foundCategory.name}": **${foundCategory.id}**`, 
        type: 'info' 
      });
    } else {
      setStatusMessage({ 
        message: `Categoria com o nome "${searchTerm}" não encontrada.`, 
        type: 'error' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">⚙️ Gerenciamento de Categorias</h1>
        
        {/* Mensagem de Status */}
        {statusMessage && (
          <div className={`p-3 mb-4 rounded-md border ${statusColors[statusMessage.type]}`} role="alert">
            <span className="font-medium">{statusMessage.message}</span>
          </div>
        )}

        {/* Formulários de Criação e Busca */}
        <section className="mb-8 border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">➕ Criar Nova Categoria</h2>
          <form onSubmit={handleCreateCategory} className="flex space-x-3">
            <input
              type="text"
              placeholder="Nome da Categoria (Ex: Cosméticos)"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              // Desabilita o botão enquanto a criação ou busca inicial está ativa
              disabled={isCreating || isLoading} 
              className={`px-4 py-2 text-white font-medium rounded-md transition duration-150 ${
                (isCreating || isLoading) ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isCreating ? 'Criando...' : 'Criar'}
            </button>
          </form>
        </section>

        <section className="mb-8 border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">🔍 Buscar ID pelo Nome</h2>
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Digite o nome para buscar o ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleSearchByName}
              disabled={isLoading}
              className={`px-4 py-2 text-white font-medium rounded-md transition duration-150 ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              Buscar ID
            </button>
          </div>
        </section>

        {/* --- 3. Mostrar Todas as Categorias (e Deletar) --- */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">📚 Lista de Categorias ({categories.length})</h2>
          
          {/* Indicador de Carregamento */}
          {isLoading && (
            <div className="text-center py-4 text-indigo-600 font-medium">
              Carregando categorias... 
            </div>
          )}

          <ul className="space-y-3">
            {!isLoading && categories.length === 0 ? (
              <p className="text-gray-500 italic">Nenhuma categoria encontrada.</p>
            ) : (
                // 🎯 CORREÇÃO DE SINTAXE APLICADA AQUI (LINHA 239)
                !isLoading && categories.map((category) => (
                <li 
                  key={category.id} 
                  className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-150"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{category.name}</p>
                    <p className="text-sm text-gray-500 mt-1">ID: <code className="bg-gray-200 px-1 rounded">{category.id}</code></p>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    // Desabilita o botão se a página estiver carregando OU se esta categoria estiver sendo deletada
                    disabled={isLoading || isDeleting === category.id} 
                    className={`ml-4 px-3 py-1 text-sm font-medium rounded-md transition duration-150 ${
                        (isLoading || isDeleting === category.id) 
                        ? 'bg-red-300 cursor-not-allowed' 
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    {isDeleting === category.id ? 'Deletando...' : 'Deletar'}
                  </button>
                </li>
              ))
                // O loop termina aqui
            )}
          </ul>
        </section>
      </div>
      
    </div>
  );
}