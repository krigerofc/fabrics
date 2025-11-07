import { AuthServer } from "@/backend/auth/auth";
import { Category } from "@/backend/models/Category";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const User_id = await AuthServer.Get_UserId();
        if(!User_id) return NextResponse.json({ Message:"Você deve estar logado!", success:false })

        const All_category = await Category.list(User_id)
        if(!All_category) return NextResponse.json({message:"Error durante a listagem!", success:false})

        return NextResponse.json({success:true, message:"Categorias carregadas", categories:All_category})
    } catch(error){
        return NextResponse.json({message:"Error", success:false, Error:error})
    }
}