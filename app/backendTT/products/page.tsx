'use client';
import React, { useEffect, useState } from 'react';

const API_URL_PRODUCTS = '/api/backend/product/get_all';
const API_URL_CATEGORIES = '/api/backend/category/get_all';
const API_URL_UPDATE = '/api/backend/product/update';
const API_URL_DELETE = '/api/backend/product/delete';

interface Product {
  id: string;
  name: string;
  categoryId: string;
  totalQuantity: number;
  availableQuantity: number;
  pricePerUnit: number;
  description: string | null;
  isMetre?: boolean;
  isUnitBased?: boolean;
}

interface Category {
  id: string;
  name: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(API_URL_PRODUCTS),
        fetch(API_URL_CATEGORIES),
      ]);

      const productsData = await productsRes.json();
      if (!productsRes.ok || productsData.success === false) {
        throw new Error(productsData.message || 'Falha ao buscar produtos.');
      }
      setProducts(productsData.products || []);

      const categoriesData = await categoriesRes.json();
      if (!categoriesRes.ok || categoriesData.success === false) {
        throw new Error(categoriesData.message || 'Falha ao buscar categorias.');
      }
      setCategories(categoriesData.categories || []);

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;
    try {
      const res = await fetch(`${API_URL_DELETE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) throw new Error(data.message);
      alert('Produto deletado com sucesso!');
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert('Erro ao deletar produto: ' + (err as Error).message);
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API_URL_UPDATE}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) throw new Error(data.message);
      alert('Produto atualizado com sucesso!');
      setEditing(null);
      fetchData(); // Re-fetch all data to ensure consistency
    } catch (err) {
      alert('Erro ao atualizar: ' + (err as Error).message);
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editing) return;
    const { name, value } = e.target;
    setEditing({ ...editing, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editing) return;
    const { name, value } = e.target;
    // Garante que o valor seja um número, ou 0 se for inválido
    setEditing({ ...editing, [name]: parseFloat(value) || 0 });
  };

  const handleMeasurementChange = (type: 'isUnitBased' | 'isMetre') => {
    if (!editing) return;
    if (type === 'isUnitBased') {
      setEditing({ ...editing, isUnitBased: true, isMetre: false });
    } else {
      setEditing({ ...editing, isUnitBased: false, isMetre: true });
    }
  }; // <--- CORREÇÃO: A função handleMeasurementChange deve fechar aqui.

  // --- O COMPONENTE ProductsPage COMEÇA O SEU RETORNO AQUI ---

  if (loading) return <div className="p-10 text-center text-gray-500 bg-white rounded-lg shadow">Carregando...</div>;
  if (error) return <div className="p-10 text-center text-red-600 bg-white rounded-lg shadow">Erro: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-[Inter] text-black">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">🛒 Lista de Produtos</h1>
        {products.length === 0 ? (
          <div className="p-10 text-center text-gray-500 bg-white rounded-lg shadow">Nenhum produto encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Nome</th>
                  <th className="py-3 px-4 text-left">Categoria</th>
                  <th className="py-3 px-4 text-left">Preço</th>
                  <th className="py-3 px-4 text-left">Qtd Total</th>
                  <th className="py-3 px-4 text-left">Qtd Disponível</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{p.name}</td>
                    <td className="py-3 px-4">{categories.find(c => c.id === p.categoryId)?.name || 'N/A'}</td>
                    <td className="py-3 px-4"> R$ {parseFloat(p.pricePerUnit as unknown as string).toFixed(2)}</td>
                    <td className="py-3 px-4">{p.totalQuantity}</td>
                    <td className="py-3 px-4">{p.availableQuantity}</td>
                    <td className="py-3 px-4 text-right space-x-3">
                      <button onClick={() => setEditing(p)} className="text-blue-600 hover:text-blue-800 font-medium">Editar</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800 font-medium">Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
              <h2 className="text-2xl font-bold mb-6">Editar Produto</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coluna 1 */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Nome</label>
                  <input name="name" className="w-full border p-2 rounded mb-4" value={editing.name} onChange={handleInputChange} />

                  <label className="block mb-2 text-sm font-medium text-gray-700">Categoria</label>
                  <select name="categoryId" className="w-full border p-2 rounded mb-4" value={editing.categoryId} onChange={handleInputChange}>
                    <option value="">Selecione uma categoria</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>

                  <label className="block mb-2 text-sm font-medium text-gray-700">Descrição</label>
                  <textarea name="description" className="w-full border p-2 rounded mb-4 h-24" value={editing.description || ''} onChange={handleInputChange}></textarea>
                </div>

                {/* Coluna 2 */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Preço por Unidade/Metro (R$)</label>
                  <input name="pricePerUnit" type="number" className="w-full border p-2 rounded mb-4" value={editing.pricePerUnit} onChange={handleNumberChange} />

                  <label className="block mb-2 text-sm font-medium text-gray-700">Quantidade Total</label>
                  <input name="totalQuantity" type="number" className="w-full border p-2 rounded mb-4" value={editing.totalQuantity} onChange={handleNumberChange} />

                  <label className="block mb-2 text-sm font-medium text-gray-700">Quantidade Disponível</label>
                  <input name="availableQuantity" type="number" className="w-full border p-2 rounded mb-4" value={editing.availableQuantity} onChange={handleNumberChange} />

                  <label className="block mb-2 text-sm font-medium text-gray-700">Tipo de Medida</label>
                  <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                          <input type="radio" name="measurement" checked={editing.isUnitBased} onChange={() => handleMeasurementChange('isUnitBased')} className="mr-2"/>
                          Unidade
                      </label>
                      <label className="flex items-center">
                          <input type="radio" name="measurement" checked={editing.isMetre} onChange={() => handleMeasurementChange('isMetre')} className="mr-2"/>
                          Metro
                      </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button onClick={() => setEditing(null)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium">Cancelar</button>
                <button onClick={handleSave} disabled={updating} className={`px-6 py-2 rounded-lg text-white font-medium ${updating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {updating ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; // <--- CORREÇÃO: A função ProductsPage fecha aqui.

export default ProductsPage;