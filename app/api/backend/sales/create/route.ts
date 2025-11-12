import { AuthServer } from "@/backend/auth/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        const body = await req.json();
        if(!body.salenumber || !body.totalAmount || !body.customerName) return NextResponse.json({  message:"Preencha todoso os campos!", success:false });

        const userId = await AuthServer.Get_UserId();
        if(!userId) return NextResponse.json({ message:"Faça login para continuar!", success:false });

        // validation 
        const trimmmedSaleNumber = body.saleNumber.trim();
        if(trimmmedSaleNumber.length < 3) return NextResponse.json({ message:"O ID da venda deve ser maior que 3 caracteres", success:false});

        const trimmmedTotalAmount = Number(body.totalAmount)
        if(isNaN(trimmmedTotalAmount) || trimmmedTotalAmount <= 0) return NextResponse.json({ message:"O valor total da venda deve ser maior que 0", success:false});

        const trimmmedCustomerName = body.customerName.trim();
        if(trimmmedCustomerName.length <= 3 || trimmmedCustomerName.length >= 50 || !trimmmedCustomerName) return NextResponse.json({message:"O nome do cliente deve ser maior que 3 caracteres e menor que 50 caracteres", success:false});

        
    } catch(error){
        NextResponse.json({ message:'Erro ao tentar criar venda', success:false, error:error});
    }
}