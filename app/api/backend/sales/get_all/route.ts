
import { NextResponse } from 'next/server'
import { SaleModel } from '@/backend/models/sale'
import { AuthServer } from '@/backend/auth/auth'

export async function GET() {
  try {
    const userId = await AuthServer.Get_UserId();
    if (!userId) return NextResponse.json({ message: "Faça login para continuar!", success: false });

    const sales = await SaleModel.getAllSales(userId);
    if(!sales) return NextResponse.json({ message: "Nenhuma venda encontrada!", success: false });

    return NextResponse.json({message:'Vendas encontradas', success:true, sales:sales})
  } catch (error) {
    return NextResponse.json({message:"Error", success:false, Error:error})
  }
}
