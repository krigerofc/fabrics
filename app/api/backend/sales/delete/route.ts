import { AuthServer } from "@/backend/auth/auth";
import { SaleModel } from "@/backend/models/sale";
import { Product } from "@/backend/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userId = await AuthServer.Get_UserId();
    if (!userId) return NextResponse.json({ message: "Faça login para continuar!", success: false });

    const body = await req.json();
    const saleId = body.saleId ? String(body.saleId).trim() : undefined;

    if (!saleId) return NextResponse.json({ message: "O campo saleId é obrigatório", success: false });

    if (saleId.length < 3) return NextResponse.json({ message: "O ID da venda deve ter ao menos 3 caracteres", success: false });

    const sale = await SaleModel.getSaleById(saleId, userId);
    if (!sale) return NextResponse.json({ message: "Venda não encontrada ou não pertence a este usuário", success: false });

    const product = await Product.getById(sale.productId, userId); 
    if(!product) return NextResponse.json({ message: "Produto não encontrado", success: false });

    const deleted_sale = await SaleModel.deleteSale(saleId, userId);
    if (!deleted_sale) return NextResponse.json({ message: "Erro ao tentar deletar venda", success: false });

    return NextResponse.json({ message: "Venda deletada com sucesso!", success: true });
  } catch (error) {
    console.error("Erro ao deletar venda:", error);
    return NextResponse.json({ message: "Erro interno ao tentar deletar venda", success: false, error: String(error) });
  }
}
