import CardHighlight from "./Cards/CardHighlight";

import { ShieldCheck } from "lucide-react";
import { Archive } from 'lucide-react';
import { ScanSearch } from 'lucide-react';


export default function HighLight() {
    const Card1 = "Nosso sistema oferece uma segurança superior para sua loja ao centralizar e monitorar cada etapa do processo: Com tudo organizado e rastreável, você evita perdas, inconsistências e fraudes, garantindo que cada item tenha seu histórico completo.";
    const Card2 = "um controle de estoque altamente preciso através da gestão por lotes e da identificação individual de cada produto, com essa organização, você sabe exatamente qual item entrou, quando entrou e a qual lote pertence, permitindo rastreabilidade total e evitando erros, misturas ou perdas";
    const Card3 = "Tenha uma visão completa do desempenho da sua loja com nosso painel de análise totalmente personalizado. O dashboard reúne, em um só lugar, os indicadores mais importantes do seu negócio! estoque, vendas, lote, movimentações e muito mais";

    const cards = [
        {Icon: ShieldCheck, Title: "Segurança", Text: Card1, classNameIcon:'text-blue-500'},
        {Icon: Archive, Title: "Controle", Text: Card2, classNameIcon:'text-yellow-500'},
        {Icon: ScanSearch, Title: "Segurança", Text: Card3, classNameIcon:'text-orange-500'},
    ]
    
    return (
        <div className="w-full min-h-[540px] bg-gray-200/75 py-12 px-4">
            <div className="flex flex-wrap justify-center items-stretch gap-8">
                {cards.map((item, i) => (
                    <CardHighlight
                        key={i}
                        Icon={item.Icon}
                        Title={item.Title}
                        Text={item.Text}
                        classNameIcon={item.classNameIcon}
                    />
                ))}
            </div>
        </div>
    );
}