import { NextResponse } from "next/server";
import { BatchModel } from "@/backend/models/Batch";
import { AuthServer } from "@/backend/auth/auth";

export async function GET() {
    try {
        const user_Id = await AuthServer.Get_UserId();
        if (!user_Id) {
            return NextResponse.json({ message: "Faça login para continuar!", success: false }, { status: 401 });
        }

        const batches = await BatchModel.list(user_Id); 

        return NextResponse.json({ message:'Lotes obtidos com sucesso!', batches: batches, success: true });
    } catch (error) {
        console.error("Erro ao tentar obter lotes:", error);
        return NextResponse.json({ message: "Erro interno ao tentar obter lotes!", success: false }, { status: 500 });
    }
}