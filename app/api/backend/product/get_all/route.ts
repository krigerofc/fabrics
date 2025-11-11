import { AuthServer } from "@/backend/auth/auth";
import { Product } from "@/backend/models/product";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const user_id = await AuthServer.Get_UserId();
        if(!user_id) return NextResponse.json({ message:"Faça login para continuar!", success:false })

        const all_products = await Product.list(user_id);
        if(!all_products) return NextResponse.json({ message:"Nenhum produto encontrado!", success:false })
        return NextResponse.json({success:true, message:"Categorias carregadas", products:all_products})
    }catch(error){
        return NextResponse.json({ message:"Erro interno", error: error, success:false })
    }
}