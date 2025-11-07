import { AuthServer } from "@/backend/auth/auth";
import { Category } from "@/backend/models/Category";
import { Product } from "@/backend/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        const body = await req.json();
        if(!body.categoryId) return NextResponse.json({message:"Informe o id da categoria!", success:false})
        
        const user_Id = await AuthServer.Get_UserId();
        if(!user_Id) return NextResponse.json({message:"Faça login para continuar!", success:false,})

        const existingCategory = await Category.getById(body.categoryId, user_Id);
        if(!existingCategory) return NextResponse.json({ message:"Erro ao tentar encontrar categoria", success:false })

        const productCount = await Product.countByCategory(body.categoryId); 
        if (productCount > 0) return NextResponse.json({  message: `Esta categoria não pode ser deletada. Possui ${productCount} produto(s) vinculado(s).`,  success: false });

        const delet_category = await Category.delete(body.categoryId, user_Id);
        if(!delet_category) return NextResponse.json({  message: "Erro ao tentar deletar a categoria!",  success: false });
        
        return NextResponse.json({ message:"Categoria deletada com sucesso!", success:true })
    }catch(error){
        return NextResponse.json({message:"Error", success:false, Error:error})
    }
}