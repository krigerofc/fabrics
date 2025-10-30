/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class Sale {
  private constructor() {}

  static async createSale(userId: string,saleNumber: string,totalAmount: number,customerName?: string, 
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED' = 'PENDING') {
    try {
      return await prisma.sale.create({
        data: {
          userId,
          saleNumber,
          customerName,
          totalAmount,
          status
        }
      })
    } catch (err: any) {
      throw new Error(`createSale failed: ${err?.message ?? String(err)}`)
    }
  }

  static async getById(id: string) {
    try {
      return await prisma.sale.findUnique({
        where: { id },
        include: { items: true, payment: true }
      })
    } catch (err: any) {
      throw new Error(`getSaleById failed: ${err?.message ?? String(err)}`)
    }
  }

  static async getByNumber(saleNumber: string) {
    try {
      return await prisma.sale.findUnique({
        where: { saleNumber },
        include: { items: true, payment: true }
      })
    } catch (err: any) {
      throw new Error(`findSaleByNumber failed: ${err?.message ?? String(err)}`)
    }
  }

  static async update( id: string, customerName?: string, totalAmount?: number,
    status?: 'PENDING' | 'COMPLETED' | 'CANCELLED') {
    try {
      return await prisma.sale.update({
        where: { id },
        data: {
          ...(customerName ? { customerName } : {}),
          ...(totalAmount ? { totalAmount } : {}),
          ...(status ? { status } : {})
        }
      })
    } catch (err: any) {
      throw new Error(`updateSale failed: ${err?.message ?? String(err)}`)
    }
  }

  static async delete(id: string) {
    try {
      return await prisma.sale.delete({ where: { id } })
    } catch (err: any) {
      throw new Error(`deleteSale failed: ${err?.message ?? String(err)}`)
    }
  }

  static async list( userId?: string, 
    status?: 'PENDING' | 'COMPLETED' | 'CANCELLED', 
    skip?: number, take?: number, orderBy?: 'asc' | 'desc' ) {
    try {
      return await prisma.sale.findMany({
        where: {
          ...(userId ? { userId } : {}),
          ...(status ? { status } : {})
        },
        skip,
        take,
        orderBy: orderBy ? { createdAt: orderBy } : undefined,
        include: { items: true }
      })
    } catch (err: any) {
      throw new Error(`listSales failed: ${err?.message ?? String(err)}`)
    }
  }
}


