/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); 

export class BatchModel {
    private constructor() {}

    static async create( userId: string, name: string, quantityOfProducts: number, batchNumber: string){
        try {
            return await prisma.batch.create({
                data: {
                    userId:userId,
                    name:name,
                    quantityOfProducts:quantityOfProducts,
                    batchNumber:batchNumber,
                }
            });
        } catch (err: any) {
            throw new Error(`Erro ao tentar criar lote: ${err?.message ?? String(err)}`);
        }
    }
    
    static async getById(id: string, userId: string){
        try {
            return await prisma.batch.findUnique({ where: { id: id, userId: userId } });
        } catch (err: any) {
            throw new Error(`Erro ao tentar pegar lote por ID: ${err?.message ?? String(err)}`);
        }
    }
    
    static async getByBatchNumber(batchNumber: string, userId: string){
        try {
            if (!batchNumber || typeof batchNumber !== 'string') return null;
            return await prisma.batch.findFirst({
                where: {
                    batchNumber: batchNumber.trim(),
                    userId: userId, 
                },
            });
        } catch (err: any) {
            throw new Error(`Erro ao tentar pegar numero de lote: ${err?.message ?? String(err)}`);
        }
    }
    
    static async list(userId: string){
        try {
            return await prisma.batch.findMany({ 
                where: { userId },
                orderBy: { createdAt: 'desc' }
            });
        } catch (err: any) {
            throw new Error(`Erro ao listar lotes: ${err?.message ?? String(err)}`);
        }
    }
    
    static async update( id: string, userId: string, name: string, quantityOfProducts?: number, batchNumber?: string ){
        try {
            return await prisma.batch.update({
                where: { 
                    id,
                    userId,
                },
                data:{
                  name:name,
                  quantityOfProducts:quantityOfProducts,
                  batchNumber:batchNumber,
                },
            });
        } catch (err: any) {
            throw new Error(`Erro ao tentar atualizar lote: ${err?.message ?? String(err)}`);
        }
    }
    
    static async delete(id: string, userId: string){
        try {
            return await prisma.batch.delete({  where: {  id: id,  userId: userId  } });
        } catch (err: any) {
            throw new Error(`Erro ao tentar deletar lote: ${err?.message ?? String(err)}`);
        }
    }

    static async count(userId: string){
        try {
            return await prisma.batch.count({ where: { userId }  });
        } catch (error:any) {
            throw new Error(`Erro ao tentar contar lotes: ${error?.message ?? String(error)}`);
        }
    }

    static async countProductsInBatch(batchId: string, userId: string){
    try {
        if (!batchId) return 0;  
        return await prisma.product.count({  where: { batchId: batchId, userId: userId} });
    } catch (error: any) {
        throw new Error(`countProductsInBatch failed: ${error?.message ?? String(error)}`);
    }
}
}