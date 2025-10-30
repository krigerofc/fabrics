/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class Product {
  private constructor() {}

  static async create( userId: string, name: string, unit: string,
    totalQuantity: number, availableQuantity: number,pricePerUnit: number, description?: string) {
    try {
      return await prisma.product.create({
        data: {
          userId,
          name,
          unit,
          totalQuantity,
          availableQuantity,
          pricePerUnit,
          description
        }
      })
    } catch (err: any) {
      throw new Error(`createProduct failed: ${err?.message ?? String(err)}`)
    }
  }

  static async getById(id: string) {
    try {
      return await prisma.product.findUnique({
        where: { id },
        include: {
          user: true,
          saleItems: true
        }
      })
    } catch (err: any) {
      throw new Error(`getProductById failed: ${err?.message ?? String(err)}`)
    }
  }

  static async update(  id: string, name?: string, unit?: string,
    totalQuantity?: number, availableQuantity?: number, pricePerUnit?: number, description?: string) {
    try {
      return await prisma.product.update({
        where: { id },
        data: {
          ...(name ? { name } : {}),
          ...(unit ? { unit } : {}),
          ...(totalQuantity ? { totalQuantity } : {}),
          ...(availableQuantity ? { availableQuantity } : {}),
          ...(pricePerUnit ? { pricePerUnit } : {}),
          ...(description ? { description } : {})
        }
      })
    } catch (err: any) {
      throw new Error(`updateProduct failed: ${err?.message ?? String(err)}`)
    }
  }

  static async delete(id: string) {
    try {
      return await prisma.product.delete({
        where: { id }
      })
    } catch (err: any) {
      throw new Error(`deleteProduct failed: ${err?.message ?? String(err)}`)
    }
  }

  static async list( userId?: string, skip?: number, take?: number, orderBy?: 'asc' | 'desc') {
    try {
      return await prisma.product.findMany({
        where: userId ? { userId } : undefined,
        skip,
        take,
        orderBy: orderBy ? { createdAt: orderBy } : undefined,
        include: {
          user: true,
          _count: {
            select: {
              saleItems: true
            }
          }
        }
      })
    } catch (err: any) {
      throw new Error(`listProducts failed: ${err?.message ?? String(err)}`)
    }
  }
}
