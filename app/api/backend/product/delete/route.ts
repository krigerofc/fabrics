import { AuthServer } from "@/backend/auth/auth";
import { Product } from "@/backend/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        const body = await req.json();
        if(!body || !body.productId) return NextResponse.json({message:"Informe o id do produto!", success:false})
        
        const user_Id = await AuthServer.Get_UserId();
        if(!user_Id) return NextResponse.json({message:"Faça login para continuar!", success:false,})

        const existingProduct = await Product.getById(body.productId, user_Id);
        if(!existingProduct) return NextResponse.json({ message:"Erro ao tentar encontrar o produto!", success:false })

        const deleted_product = await Product.delete(body.productId, user_Id);
        if(!deleted_product) return NextResponse.json({  message: "Erro ao tentar deletar o produto!",  success: false });
        return NextResponse.json({ message:"Produto deletado com sucesso!", success:true })
    }catch(error){
        return NextResponse.json({message:"Error", success:false, Error:error})
    }
}