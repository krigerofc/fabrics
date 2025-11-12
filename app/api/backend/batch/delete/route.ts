import { AuthServer } from "@/backend/auth/auth";
import { BatchModel } from "@/backend/models/Batch";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user_Id = await AuthServer.Get_UserId();
        if (!user_Id) return NextResponse.json({ message: "Faça login para continuar!", success: false });

        const body = await req.json();
        if(!body || !body.batchId ) return NextResponse.json({message:"Informe o ID do lote!", success:false})

        const existing_batch = await BatchModel.getById(body.batchId, user_Id);
        if (!existing_batch) {
            return NextResponse.json({ message: "Lote não encontrado ou acesso negado!", success: false }, { status: 404 });
        }

        const products_in_batch_count = await BatchModel.countProductsInBatch(body.batchId, user_Id);
        if(products_in_batch_count > 0 ) return NextResponse.json({message:'Não é possível deletar este lote, existem produtos!', success:false})

        const Deleted_batch = await BatchModel.delete(body.batchId, user_Id);
        if(!Deleted_batch) return NextResponse.json({ message: "Falha ao deletar o lote!", success: false });

        return NextResponse.json({ message: 'Lote deletado com sucesso!', success: true });
    } catch (error) {
        return NextResponse.json({ message: "Erro interno ao tentar deletar lote!", error: error, success: false });
    }
}