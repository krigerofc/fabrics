/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Category {
  private constructor() {}

  static async Verification_name(name: string, userId: string) {
    try {
      if (!name || !userId) { 
        return null;
      }
      return await prisma.category.findFirst({
        where: { 
          name: name.trim(),
          userId: userId 
        } 
      });
    } catch (err: any) {
      throw new Error(`Busca de categoria por nome e ID do usuário falhou: ${err?.message ?? String(err)}`);
    }
  }


  static async create(name: string, userId: string) {
    try {
      if (!name || !userId) { throw new Error("Nome e ID do usuário são obrigatórios."); }
      return await prisma.category.create({  data: { name: name, userId: userId } });
    } catch (error: any) {
      throw new Error(`Criação de categoria falhou: ${error.message}`);
    }
  }

  static async getById(id: string, userId: string) {
    try {
      if (!id || !userId) { throw new Error("ID da categoria e ID do usuário são obrigatórios."); }
      return await prisma.category.findUnique({  where: { id: id, userId: userId }  });
    } catch (err: any) {
      throw new Error(`Busca de categoria por ID falhou: ${err?.message ?? String(err)}`);
    }
  }

  static async update(id: string, userId: string, name: string) {
    try {
      if (!id || !userId || !name) { throw new Error("ID da categoria, ID do usuário e novo nome são obrigatórios."); }
      return await prisma.category.update({
        where: { id: id, userId: userId },
        data: { name: name } 
      });
    } catch (err: any) {
      throw new Error(`Atualização de categoria falhou: ${err?.message ?? String(err)}`);
    }
  }

  // 4. DELETAR: Requer userId para garantir que o usuário é o dono
  static async delete(id: string, userId: string) {
    try {
      if (!id || !userId) { throw new Error("ID da categoria e ID do usuário são obrigatórios."); }
      return await prisma.category.delete({  where: { id: id, userId: userId }   });
    } catch (err: any) {
      throw new Error(`Deleção de categoria falhou: ${err?.message ?? String(err)}`);
    }
  }

  static async list(userId: string) {
    try {
      if (!userId) {  throw new Error("O ID do usuário é obrigatório para listar categorias."); }
      return await prisma.category.findMany({  where: { userId }  });
    } catch (err: any) {
      throw new Error(`Listagem de categorias falhou: ${err?.message ?? String(err)}`);
    }
  }
}