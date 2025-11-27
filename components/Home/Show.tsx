import { ReactNode } from 'react';
import { Box, ShoppingCart, BarChart3, CheckCircle } from 'lucide-react';

// Sub-component for features, defined locally within About.tsx
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  points: string[];
  reverse?: boolean;
}

const FeatureCard = ({ icon, title, description, points, reverse = false }: FeatureCardProps) => {
  return (
    <div className={`flex flex-col md:flex-row items-center gap-12 ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <div className="flex-shrink-0 md:w-1/3 flex justify-center p-8">
        {icon}
      </div>
      <div className="flex-1 space-y-4">
        <h3 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h3>
        <p className="text-xl text-gray-600 leading-relaxed">
          {description}
        </p>
        <ul className="space-y-3 pt-2">
          {points.map((point, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
              <span className="text-gray-700 text-lg">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default function Show() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                Uma solução completa para sua loja de tecidos
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Desde o controle de estoque até a análise financeira, nossa plataforma foi criada para simplificar sua gestão e impulsionar seu crescimento.
            </p>
        </div>

         <div className="space-y-20">
          <FeatureCard
            icon={<Box size={120} strokeWidth={1.5} className="text-blue-500" />}
            title="Organização de Estoque Inteligente"
            description="Diga adeus às planilhas complicadas. Nosso sistema oferece uma visão clara e organizada de todo o seu inventário de tecidos."
            points={[
              "Cadastro detalhado de produtos com lotes.",
              "Gestão de lotes e produtos atraves de serial.",
              "Alertas de estoque baixo para nunca perder uma venda.",
              "Histórico completo de movimentações por produto.",
            ]}
          />
          <FeatureCard
            icon={<ShoppingCart size={120} strokeWidth={1.5} className="text-blue-500" />}
            title="Processo de Venda Ágil e Integrado"
            description="Facilite o dia a dia do seu time de vendas com um PDV (Ponto de Venda) simples, rápido e diretamente conectado ao seu estoque."
            points={[
              "Vendas rápidas com leitura de código de barras ou busca de produtos.",
              "Cálculo automático de preços e descontos.",
              "Registro de clientes e histórico de compras.",
              "Múltiplas formas de pagamento.",
            ]}
            reverse={true}
          />

        </div>
      </div>
    </section>
  );
}
