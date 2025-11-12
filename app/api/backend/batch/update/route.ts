import { AuthServer } from "@/backend/auth/auth";
import { BatchModel } from "@/backend/models/Batch";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user_Id = await AuthServer.Get_UserId();
        if (!user_Id) return NextResponse.json({ message: "Faça login para continuar!", success: false });

        const body = await req.json();
        const { name, quantityOfProducts, batchNumber, batchId } = body;
        if (!name || !quantityOfProducts || !batchNumber || !batchId) {
          return NextResponse.json({ message: "Preencha todos os campos!", success: false });
        }


        const existing_batch = await BatchModel.getById(batchId, user_Id);
        if (!existing_batch) {
            return NextResponse.json({ message: "Lote não encontrado ou acesso negado!", success: false });
        }
        
        const products_in_batch_count = await BatchModel.countProductsInBatch(body.batchId, user_Id);
        if(products_in_batch_count > 0 ) return NextResponse.json({message:'Não é possível atualizar este lote, existem produtos!', success:false})
          


        const trimmedName = String(body.name).trim();
        if (trimmedName.length < 3) {
            return NextResponse.json({ message: "O nome do lote deve ter no mínimo 3 caracteres.", success: false });
        }
    

        const parsedQuantity = Number(body.quantityOfProducts);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return NextResponse.json({ message: "A Quantidade de Produtos deve ser um número válido e positivo.", success: false });
        }
        
        const trimmedBatchNumber = String(body.batchNumber).trim();
          if (trimmedBatchNumber.length === 0) {
            return NextResponse.json({ message: "O número do lote não pode ser vazio.", success: false });
        }

        const batch_with_same_number = await BatchModel.getByBatchNumber(trimmedBatchNumber, user_Id);
        if (batch_with_same_number && batch_with_same_number.id !== batchId) {
            return NextResponse.json({ message: "Este número de lote já está em uso por outro lote.", success: false });
        }
        

        const updated_batch = await BatchModel.update(batchId, user_Id, trimmedName, parsedQuantity, trimmedBatchNumber); 
        if (!updated_batch) {
            return NextResponse.json({ message: "Falha ao atualizar o lote!", success: false }, { status: 500 });
        }

        return NextResponse.json({ message: 'Lote atualizado com sucesso!', success: true, batch: updated_batch });
    } catch (error) {
        return NextResponse.json({ message: "Erro interno ao tentar atualizar lote!", error: error, success: false });
    }
}