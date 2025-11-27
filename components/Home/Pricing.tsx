"use client";

import { useState } from "react";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Check } from "lucide-react";

const plans = [
  {
    name: "Básico",
    monthlyPrice: 40,
    annualPrice: 400,
    features: [
      "Gestão de até 100 produtos",
      "Controle de estoque básico",
      "Relatórios de vendas mensais",
      "Suporte por e-mail",
    ],
  },
  {
    name: "Profissional",
    monthlyPrice: 65,
    annualPrice: 600,
    features: [
      "Produtos ilimitados",
      "Controle de estoque avançado",
      "Relatórios de vendas detalhados",
      "Integração com e-commerce",
      "Suporte prioritário por chat",
    ],
    isPopular: true,
  },
  {
    name: "Empresarial",
    monthlyPrice: 120,
    annualPrice: 1200,
    features: [
      "Todos os benefícios do plano Profissional",
      "Análise preditiva de vendas",
      "Múltiplos usuários e permissões",
      "Gerente de conta dedicado",
      "Suporte 24/7",
    ],
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Planos e Preços
        </h2>
        <p className="mt-4 text-lg text-gray-500">
          Escolha o plano que melhor se adapta às suas necessidades.
        </p>

        <div className="mt-8 flex items-center justify-center space-x-4">
          <Label htmlFor="billing-cycle">Mensal</Label>
          <Switch
            id="billing-cycle"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
          />
          <Label htmlFor="billing-cycle">Anual</Label>
        </div>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col ${plan.isPopular ? 'border-2 border-primary' : ''}`}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-4xl font-bold">
                  R${isAnnual ? (plan.annualPrice/12).toFixed(0) : plan.monthlyPrice.toFixed(0)}
                </span>
                /mês
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                Começar com {plan.name}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}