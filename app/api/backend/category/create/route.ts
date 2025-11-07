import { AuthServer } from "@/backend/auth/auth";
import { Category } from "@/backend/models/Category";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        const body = await req.json();
        console.log(body)
        if(!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) return NextResponse.json({message:"Informe o nome da categoria!", success:false})
        
        const user_Id = await AuthServer.Get_UserId();
        if(!user_Id) return NextResponse.json({message:"Faça login para continuar!", success:false,})

        const existingCategory = await Category.Verification_name(body.name.trim().toLowerCase(), user_Id);
        if(existingCategory) return NextResponse.json({ message: "Categoria com este nome já existe para este usuário.", success: false});

        const new_category = await Category.create(body.name.trim().toLowerCase(), user_Id)
        if(!new_category)return NextResponse.json({message:"Falha ao criar nova categoria!", success:false,})

        return NextResponse.json({message:"Categoria criada com sucesso!", success:true, category:new_category})
    }catch(error){
        return NextResponse.json({message:"Error", success:false, Error:error})
    }
}