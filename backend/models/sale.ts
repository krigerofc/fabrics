/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, PrismaClient, Sale, SaleStatus } from '@prisma/client'

const prisma = new PrismaClient();

export class SaleModel {
  private constructor() {}

  static async createSale(data: {
    userId: string
    saleNumber: string
    customerName?: string
    quantity: Prisma.Decimal
    pricePerUnit: Prisma.Decimal
    totalAmount: Prisma.Decimal
    status?: SaleStatus
    productId: string
    paymentId?: string
  }) {
    try {
      return await prisma.sale.create({ data })
    } catch (err: any) {
      throw new Error(`Erro ao tentar criar venda: ${err?.message ?? String(err)}`);
    }
  }


  static async getSaleById(id: string, userId: string) {
    try {
      return await prisma.sale.findUnique({ where: { id, userId } });
    } catch (err: any) {
      throw new Error(`Erro ao tentar pegar venda pelo ID: ${err?.message ?? String(err)}`);
    }
  }



  static async getAllSales(userId: string) {
    try {
      return await prisma.sale.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (err: any) {
      throw new Error(`Erro ao tentar listar vendas: ${err?.message ?? String(err)}`);
    }
  }



  static async getSalesBySaleNumber(userId: string, saleNumber: string) {
    try {
      return await prisma.sale.findMany({  where: { userId, saleNumber }, });
    } catch (err: any) {
      throw new Error(`Erro ao tentar pegar vendas pelo número da venda: ${err?.message ?? String(err)}`);
    }
  }



  static async updateSale(id: string, userId:string, data: Partial<Sale>) {
    try {

      return await prisma.sale.update({
        where: { id, userId },
        data, 
      });

    } catch (err: any) {
      throw new Error(`Erro ao tentar atualizar venda: ${err?.message ?? String(err)}`);
    }
  }




  static async deleteSale(id:string, userId: string) {
    try {
      return await prisma.sale.delete({ where: { id, userId },  });
    } catch (err: any) {
      throw new Error(`Erro ao tentar deletar venda: ${err?.message ?? String(err)}`);
    }
  }
}
