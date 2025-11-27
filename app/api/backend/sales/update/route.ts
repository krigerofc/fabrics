
import { NextRequest, NextResponse } from 'next/server'
import { SaleModel } from '@/backend/models/sale'
import { AuthServer } from '@/backend/auth/auth';
import { Product } from '@/backend/models/product';
import { Prisma, SaleStatus } from '@prisma/client';
import { Payment } from '@/backend/models/payments';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const required = ["saleNumber", "totalAmount", "customerName", "quantity", "pricePerUnit", "productId"];
    for (const f of required) {
      if (body[f] === undefined || body[f] === null || String(body[f]).trim() === "") {
        return NextResponse.json({ message: `Campo obrigatório ausente: ${f}`, success: false });
      }
    }

    const saleNumber = String(body.saleNumber).trim();
    const customerName = String(body.customerName).trim();
    const productId = String(body.productId).trim();
    const paymentId = body.paymentId ? String(body.paymentId).trim() : undefined;
    const rawQuantity = body.quantity;
    const rawPricePerUnit = body.pricePerUnit;
    const rawTotalAmount = body.totalAmount;

    const userId = await AuthServer.Get_UserId();
    if (!userId) return NextResponse.json({ message: "Faça login para continuar!", success: false });

    if (saleNumber.length < 3) return NextResponse.json({ message: "O ID da venda deve ter ao menos 3 caracteres", success: false });
    if (customerName.length < 3 || customerName.length > 50) return NextResponse.json({ message: "O nome do cliente deve ter entre 3 e 50 caracteres", success: false });
    if (productId.length === 0) return NextResponse.json({ message: "productId inválido", success: false });
    
    const nameRegex = /^[a-zA-Z0-9À-ÿ\s\-']+$/;
    if (!nameRegex.test(customerName)) {
      return NextResponse.json({ message: "Nome do cliente contém caracteres inválidos", success: false });
    }
    
    const quantityNum = Number(rawQuantity);
    const pricePerUnitNum = Number(rawPricePerUnit);
    const totalNum = Number(rawTotalAmount);
    
    if (!isFinite(quantityNum) || quantityNum <= 0) return NextResponse.json({ message: "Quantity deve ser um número maior que 0", success: false });
    if (!isFinite(pricePerUnitNum) || pricePerUnitNum < 0) return NextResponse.json({ message: "pricePerUnit deve ser um número >= 0", success: false });
    if (!isFinite(totalNum) || totalNum <= 0) return NextResponse.json({ message: "totalAmount deve ser um número maior que 0", success: false });
    
    if (quantityNum > 1_000_000) return NextResponse.json({ message: "Quantity muito alto", success: false });
    if (pricePerUnitNum > 1_000_000) return NextResponse.json({ message: "pricePerUnit muito alto", success: false });
    if (totalNum > 1_000_000_000) return NextResponse.json({ message: "totalAmount muito alto", success: false });
    
    if (String(pricePerUnitNum).includes(".") && String(pricePerUnitNum).split(".")[1].length > 6) {
      return NextResponse.json({ message: "pricePerUnit aceita no máximo 6 casas decimais", success: false });
    }
    
    const calc = quantityNum * pricePerUnitNum;
    const diff = Math.abs(calc - totalNum);
    const tolerance = Math.max(0.0001, Math.abs(calc) * 0.0005);
    if (diff > tolerance) {
      return NextResponse.json({ message: `totalAmount inconsistente: esperado cerca de ${calc} (quantity * pricePerUnit), recebido ${totalNum}`,  success: false });
    }
    
    const productExists = await Product.getById(productId, userId);
    if (!productExists) {
      return NextResponse.json({ message: "Produto não encontrado", success: false });
    }
    
    if (paymentId) {
      const paymentExists = await Payment.getById(paymentId, userId);
      if (!paymentExists) {
        return NextResponse.json({ message: "paymentId inválido", success: false });
      }
    }

    const existingSales = await SaleModel.getSalesBySaleNumber(userId, saleNumber);
    if (!existingSales || existingSales.length === 0) {
      return NextResponse.json({ message: "Não existe uma venda com esse saleNumber", success: false });
    }
    if (existingSales.length > 1) {
      return NextResponse.json({ message: "Múltiplas vendas encontradas com esse saleNumber. A atualização não é possível.", success: false });
    }
    
    const saleToUpdate = existingSales[0];

    const saleData = {
      customerName,
      quantity: new Prisma.Decimal(quantityNum),
      pricePerUnit: new Prisma.Decimal(pricePerUnitNum),
      totalAmount: new Prisma.Decimal(totalNum),
      status: SaleStatus.PENDING,
      productId,
      paymentId: paymentId ?? null,
    };
    
    const sale = await SaleModel.updateSale(saleToUpdate.id, userId, saleData);
    if (!sale) {
      return NextResponse.json({ message: "Erro ao tentar editar venda", success: false });
    }
    
    return NextResponse.json({ message: "Venda editada com sucesso!", success: true, sale });

  } catch (error) {
    console.error('Error updating sale:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
