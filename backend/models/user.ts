/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class User {
  private constructor() {}

  static async create( email: string, name: string, password: string) {
    try {
      return await prisma.user.create({
        data: {
          email,
          name,
          password
        }
      })
    } catch (err: any) {
      throw new Error(`createUser failed: ${err?.message ?? String(err)}`)
    }
  }

  static async getById(id: string) {
    try {
      return await prisma.user.findUnique({
        where: { id },
        include: {
          products: true,
          sales: true
        }
      })
    } catch (err: any) {
      throw new Error(`getUserById failed: ${err?.message ?? String(err)}`)
    }
  }

  static async getByEmail(email: string) {
    try {
      return await prisma.user.findUnique({
        where: { email }
      })
    } catch (err: any) {
      throw new Error(`getUserByEmail failed: ${err?.message ?? String(err)}`)
    }
  }

  static async update(id: string, name?: string, email?: string, password?: string) {
    try {
      return await prisma.user.update({
        where: { id },
        data: {
          ...(name ? { name } : {}),
          ...(email ? { email } : {}),
          ...(password ? { password } : {}) 
        }
      })
    } catch (err: any) {
      throw new Error(`updateUser failed: ${err?.message ?? String(err)}`)
    }
  }

  static async delete(id: string) {
    try {
      return await prisma.user.delete({
        where: { id }
      })
    } catch (err: any) {
      throw new Error(`deleteUser failed: ${err?.message ?? String(err)}`)
    }
  }

  static async list(skip?: number, take?: number,orderBy?: 'asc' | 'desc') {
    try {
      return await prisma.user.findMany({
        skip, // items a pular
        take, // quantos items retornar
        orderBy: orderBy ? { createdAt: orderBy } : undefined,
        include: {
          _count: {
            select: {
              products: true,
              sales: true
            }
          }
        }
      })
    } catch (err: any) {
      throw new Error(`listUsers failed: ${err?.message ?? String(err)}`)
    }
  }
}
