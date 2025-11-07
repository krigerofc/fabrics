import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try{
        const body = await req.json();
        console.log(body)

        return NextResponse.json({ 
                message: `Dados protegidos para o usuário ID: ${userId}`,
                /email: session.user.email 
            });


    } catch(error){
        NextResponse.json({message:"Error", error:error})
    }
}