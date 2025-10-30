/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class SaleItem {
  private constructor() {}

  static async create( saleId: string, productId: string, quantity: number, pricePerUnit: number, subtotal: number) {
    try {
      return await prisma.saleItem.create({
        data: {
          saleId,
          productId,
          quantity,
          pricePerUnit,
          subtotal
        }
      })
    } catch (err: any) {
      throw new Error(`createSaleItem failed: ${err?.message ?? String(err)}`)
    }
  }

  static async getById(id: string) {
    try {
      return await prisma.saleItem.findUnique({
        where: { id }
      })
    } catch (err: any) {
      throw new Error(`getSaleItemById failed: ${err?.message ?? String(err)}`)
    }
  }

  static async update(id: string, quantity?: number, pricePerUnit?: number, subtotal?: number) {
    try {
      return await prisma.saleItem.update({
        where: { id },
        data: {
          ...(quantity ? { quantity } : {}),
          ...(pricePerUnit ? { pricePerUnit } : {}),
          ...(subtotal ? { subtotal } : {})
        }
      })
    } catch (err: any) {
      throw new Error(`updateSaleItem failed: ${err?.message ?? String(err)}`)
    }
  }

  static async delete(id: string) {
    try {
      return await prisma.saleItem.delete({
        where: { id }
      })
    } catch (err: any) {
      throw new Error(`deleteSaleItem failed: ${err?.message ?? String(err)}`)
    }
  }

  static async listBySale( saleId: string, skip?: number, take?: number, orderBy?: 'asc' | 'desc') {
    try {
      return await prisma.saleItem.findMany({
        where: { saleId },
        skip,
        take,
        orderBy: orderBy ? { createdAt: orderBy } : undefined,
        include: { product: true }
      })
    } catch (err: any) {
      throw new Error(`listSaleItemsBySale failed: ${err?.message ?? String(err)}`)
    }
  }

  static async listByProduct( productId: string, skip?: number, take?: number, orderBy?: 'asc' | 'desc') {
    try {
      return await prisma.saleItem.findMany({
        where: { productId },
        skip,
        take,
        orderBy: orderBy ? { createdAt: orderBy } : undefined,
        include: { sale: true }
      })
    } catch (err: any) {
      throw new Error(`listSaleItemsByProduct failed: ${err?.message ?? String(err)}`)
    }
  }
}
