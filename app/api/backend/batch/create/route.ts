import { AuthServer } from "@/backend/auth/auth";
import { BatchModel } from "@/backend/models/Batch";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const user_Id = await AuthServer.Get_UserId();
        if (!user_Id) return NextResponse.json({ message: "Faça login para continuar!", success: false });


        if (!body.name || !body.batchNumber || typeof body.quantityOfProducts === 'undefined') {
            return NextResponse.json({ message: "Nome, Número do Lote e Quantidade de Produtos são obrigatórios!", success: false });
        }

        const { name, batchNumber, quantityOfProducts } = body;

        const parsedQuantity = Number(quantityOfProducts);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return NextResponse.json({ message: "A Quantidade de Produtos deve ser um número válido e positivo.", success: false });
        }
        const trimmedBatchNumber = batchNumber.trim();
        const existing_batch = await BatchModel.getByBatchNumber(trimmedBatchNumber, user_Id);
        if (existing_batch) {
            return NextResponse.json({ message: "Este número de lote já existe para seu usuário.", success: false });
        }
      
        const trimmedName = name.trim();
        if (trimmedName.length < 3) {
            return NextResponse.json({ message: "O nome do lote deve ter no mínimo 3 caracteres.", success: false });
        }

        const new_batch = await BatchModel.create(user_Id, trimmedName, parsedQuantity, trimmedBatchNumber);
        if (!new_batch) {
            return NextResponse.json({ message: "Falha ao criar o lote!", success: false });
        }

        return NextResponse.json({ message: 'Lote criado com sucesso!', success: true, batch: new_batch });
    } catch (error) {
        console.error("Erro ao tentar criar lote:", error);
        return NextResponse.json({ message: "Erro interno ao tentar criar lote!", error: error, success: false });
    }
}