'use client';
import React, { useState, FormEvent, ChangeEvent } from 'react';
// Ícones externos removidos para garantir a funcionalidade (substituídos por SVG inline)

// URL de exemplo para simulação (ajuste conforme necessário)
//const API_URL_CREATE_PRODUCT = '/api/backend/products/create'; 
const API_URL_CREATE_CATEGORY = '/api/backend/category/create'; 

// --- Interfaces de Dados ---
interface Category {
  id: string;
  name: string;
}

interface ProductData {
  userId: string;
  name: string;
  categoryId: string;
  totalQuantity: number;
  availableQuantity: number;
  pricePerUnit: number;
  description?: string;
}

// --- Mock Data para Categoria ---
const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Eletrónicos' },
  { id: 'cat-2', name: 'Alimentos Secos' },
  { id: 'cat-3', name: 'Vestuário' },
  { id: 'cat-4', name: 'Ferramentas' },
];

// Componente de botão de carregamento (Spinner)
const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Ícone SVG para Categoria (Tag)
const TagIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 13V2h11l7.59 7.59a2 2 0 0 1 0 2.82z"></path>
        <line x1="7" y1="7" x2="7.01" y2="7"></line>
    </svg>
);

// Ícone SVG para Produto (Archive/Box)
const ArchiveIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"></path>
        <path d="M7 16h10"></path>
        <path d="M7 12h10"></path>
        <path d="M12 6V3"></path>
    </svg>
);


// --- 1. Painel para Criar Nova Categoria (Simples: Apenas Nome) ---

interface CreateCategoryPanelProps {
  categories: Category[];
  onCategoryCreated: (newCategory: Category) => void;
}

const CreateCategoryPanel: React.FC<CreateCategoryPanelProps> = ({ categories, onCategoryCreated }) => {
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("O nome da categoria é obrigatório.");
      return;
    }
    setLoading(true);

    const categoryData = { name: trimmedName };

    // Simulação de chamada API
    try {
      // await fetch(API_URL_CREATE_CATEGORY, { ... })
      const req = await fetch("/api/backend/category/create",{
        body:JSON.stringify({name:categoryData.name}),
        method:"POST"
      })

      const data = await req.json();
      if(data.success == false) return setError('falha');
      
      console.log(data.category)
      setSuccess(`Categoria "${data.category.name}" criada com sucesso!`);
      setName('');
      onCategoryCreated(data.category);

    } catch (fetchError) {
      const errorMessage = (fetchError as Error).message || "Falha na comunicação com o servidor.";
      console.error("Erro ao criar categoria:", fetchError);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        {/* Ícone SVG (Tag) */}
        <TagIcon className="w-5 h-5 mr-2 text-indigo-500" /> Criar Categoria
      </h2>

      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded" role="alert"><p>{error}</p></div>}
      {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 rounded" role="alert"><p>{success}</p></div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
            Nome da Categoria <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="categoryName"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            required
            disabled={loading}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center py-2 px-4 rounded-lg shadow-md text-sm font-medium text-white transition ease-in-out duration-150 transform hover:scale-[1.01] ${
            loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {loading ? <LoadingSpinner /> : 'Salvar Categoria'}
        </button>
      </form>
      
      {/* Lista de Categorias Existentes Mockada */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-sm font-semibold text-gray-600 mb-2">Categorias Atuais ({categories.length}):</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span key={cat.id} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium">
              {cat.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- 2. Painel para Criar Novo Produto (Item) - Tipagem adicionada ---

interface CreateProductPanelProps {
    categories: Category[];
}

const CreateProductPanel: React.FC<CreateProductPanelProps> = ({ categories }) => {
  const [name, setName] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>(''); 
  const [totalQuantity, setTotalQuantity] = useState<string>('');
  const [availableQuantity, setAvailableQuantity] = useState<string>('');
  const [pricePerUnit, setPricePerUnit] = useState<string>(''); 
  const [description, setDescription] = useState<string>('');
    
  // Estados de feedback
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Função de limpeza
  const resetForm = () => {
    setName('');
    setCategoryId('');
    setTotalQuantity('');
    setAvailableQuantity('');
    setPricePerUnit('');
    setDescription('');
  };

  // Handler de Submissão
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const mockUserId: string = 'mock-user-id'; // Substitua pelo ID real do usuário logado

    // Validação básica e conversão de tipos
    const total = parseFloat(totalQuantity);
    const available = parseFloat(availableQuantity);
    const price = parseFloat(pricePerUnit);

    if (isNaN(total) || isNaN(available) || isNaN(price) || !name.trim() || !categoryId) {
      setError("Por favor, preencha todos os campos obrigatórios e use números válidos para quantidades e preço.");
      setLoading(false);
      return;
    }

    if (available > total) {
      setError("A quantidade disponível não pode ser maior que a quantidade total.");
      setLoading(false);
      return;
    }

    const productData: ProductData = {
      userId: mockUserId,
      name: name.trim(),
      categoryId,
      totalQuantity: total, 
      availableQuantity: available,
      pricePerUnit: price,
      ...(description.trim() && { description: description.trim() }),
    };

    try {
      // Simulação de chamada API
      // Em um ambiente real, seria fetch(API_URL_CREATE_PRODUCT, { ... })
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      setSuccess(`Produto "${name}" criado com sucesso e associado à categoria ${categories.find(c => c.id === categoryId)?.name}.`);
      resetForm();
    } catch (fetchError) {
      const errorMessage = (fetchError as Error).message || "Falha na comunicação com o servidor.";
      console.error("Erro de rede ao criar produto:", fetchError);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg border border-gray-100 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        {/* Ícone SVG (Archive/Box) */}
        <ArchiveIcon className="w-5 h-5 mr-2 text-indigo-500" /> Criar Novo Produto (Item)
      </h2>

      {/* Mensagens de Feedback */}
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded" role="alert"><p>{error}</p></div>}
      {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 rounded" role="alert"><p>{success}</p></div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Linha 1: Nome do Item */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome do Produto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
        </div>
        
        {/* Linha 2: Categoria e Preço */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campo Categoria (Novo) */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                Categoria <span className="text-red-500">*</span>
              </label>
              <select
                id="categoryId"
                value={categoryId}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategoryId(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 bg-white appearance-none transition duration-150"
              >
                <option value="" disabled>Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Preço por Unidade (Mantido) */}
            <div>
              <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700">
                Preço por Unidade (R$) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="pricePerUnit"
                value={pricePerUnit}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPricePerUnit(e.target.value)}
                required
                min="0.01"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              />
            </div>
        </div>

        {/* Linha 3: Quantidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="totalQuantity" className="block text-sm font-medium text-gray-700">
              Quantidade Total em Estoque <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="totalQuantity"
              value={totalQuantity}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTotalQuantity(e.target.value)}
              required
              min="0"
              step="any"
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>
          <div>
            <label htmlFor="availableQuantity" className="block text-sm font-medium text-gray-700">
              Quantidade Disponível <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="availableQuantity"
              value={availableQuantity}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setAvailableQuantity(e.target.value)}
              required
              min="0"
              step="any"
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>
        </div>

        {/* Linha 4: Descrição (Opcional) */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição (Opcional)
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
        </div>

        {/* Botão de Submissão */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center py-2 px-4 rounded-lg shadow-md text-sm font-medium text-white transition ease-in-out duration-150 transform hover:scale-[1.01] ${
            loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {loading ? <LoadingSpinner /> : 'Salvar Produto'}
        </button>
      </form>
    </div>
  );
};

// --- Componente Principal (App) ---

const App: React.FC = () => {
  // Tipagem para o estado de visualização
  const [currentView, setCurrentView] = useState<'product' | 'category'>('product'); 
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);

  const handleCategoryCreated = (newCategory: Category) => {
    setCategories(prev => [...prev, newCategory]);
  };

  const isProductView = currentView === 'product';

  const tabClass = (view: 'product' | 'category'): string => `
    px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 focus:outline-none 
    ${currentView === view 
      ? 'bg-white border-b-2 border-indigo-600 text-indigo-600 shadow-sm' 
      : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border-b border-gray-300'
    }
  `;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-[Inter]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Gestão de Inventário</h1>

        {/* Navegação por Abas */}
        <div className="flex justify-center mb-6">
          <button 
            onClick={() => setCurrentView('product')} 
            className={tabClass('product')}
          >
            {/* Ícone da aba Produto (SVG Archive/Box) */}
            <ArchiveIcon className="w-4 h-4 inline mr-2" />
            Criar Produto (Item)
          </button>
          <button 
            onClick={() => setCurrentView('category')} 
            className={tabClass('category')}
          >
            {/* Ícone da aba Categoria (SVG Tag) */}
            <TagIcon className="w-4 h-4 inline mr-2" />
            Criar Categoria
          </button>
        </div>

        {/* Conteúdo do Painel */}
        {isProductView 
          ? <CreateProductPanel categories={categories} />
          : <CreateCategoryPanel categories={categories} onCategoryCreated={handleCategoryCreated} />
        }
      </div>
    </div>
  );
};

export default App;