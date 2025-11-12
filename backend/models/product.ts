/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class Product {
  private constructor() {}

  static async countByCategory(categoryId: string): Promise<number> {
        try {
            if (!categoryId || typeof categoryId !== 'string')  return 0;
            const productCount = await prisma.product.count({   where: { categoryId: categoryId,} });
            return productCount;
        } catch (error:any) {
            throw new Error(`createProduct failed: ${error?.message ?? String(error)}`)
        }
    }

  static async create( userId: string, name: string, categoryId:string,
    totalQuantity: number, availableQuantity: number,pricePerUnit: number, 
    price: number, batchId: string,
    isUnitBased: boolean = false, isMetre: boolean = false, 
    description?: string) {
    try {
      return await prisma.product.create({
        data: {
          userId:userId,
          name:name,
          description:description,
          totalQuantity:totalQuantity,
          availableQuantity:availableQuantity,
          pricePerUnit:pricePerUnit,
          price:price,
          categoryId:categoryId,
          batchId:batchId,
          IsUnitBased: isUnitBased, // Adicionada
          IsMetre: isMetre // Adicionada
        }
      });
    } catch (err: any) {
      throw new Error(`Erro ao tentar criar produto: ${err?.message ?? String(err)}`)
    }
  }

  static async getById(id: string, userId: string) {
    try {
      return await prisma.product.findUnique({  where: { id: id, userId: userId }  });
    } catch (err: any) {
      throw new Error(`Erro ao tentar pegar produto pelo ID: ${err?.message ?? String(err)}`)
    }
  }

  static async update( id: string, userId: string, name?: string,  categoryId?: string,
    totalQuantity?: number, availableQuantity?: number, pricePerUnit?: number, 
    price?: number, batchId?: string,
    isUnitBased?: boolean, isMetre?: boolean, description?: string ) {
    try {
      return await prisma.product.update({
        where: { 
          id,
          userId,
        },
        data: {
          ...(name ? { name } : {}),
          ...(categoryId ? { categoryId } : {}),
          ...(totalQuantity ? { totalQuantity } : {}),
          ...(availableQuantity ? { availableQuantity } : {}),
          ...(pricePerUnit ? { pricePerUnit } : {}),
          ...(price ? { price } : {}),
          ...(batchId ? { batchId } : {}),
          ...(isUnitBased != null ? { IsUnitBased: isUnitBased } : {}), 
          ...(isMetre != null ? { IsMetre: isMetre } : {}), 
          ...(description ? { description } : {})
        }
      });
    } catch (err: any) {
      throw new Error(`Erro ao tentar atualizar produto: ${err?.message ?? String(err)}`)
    }
  }

  static async delete(id: string, userId: string) {
    try {
      return await prisma.product.delete({ where: { id: id, userId: userId } });
    } catch (err: any) {
      throw new Error(`Erro ao tentar deletar produto: ${err?.message ?? String(err)}`)
    }
  }

  static async getByName( name: string, userId?: string) {
    try {
      if (!name || typeof name !== 'string') return null;

      return await prisma.product.findFirst({
        where: {
          name: {
            equals: name.trim(),
            mode: 'insensitive' as const,
          },
          userId: userId, 
        },
      });
      
    } catch (err: any) {
      throw new Error(`Erro ao tentar pegar produto por nome: ${err?.message ?? String(err)}`);
    }
  }

  static async list( userId?: string) {
    try {
      return await prisma.product.findMany({  
        where: { userId }, 
        orderBy: { createdAt: 'desc' } });
    } catch (err: any) {
      throw new Error(`Erro ao tentar listar produtos: ${err?.message ?? String(err)}`)
    }
  }
}