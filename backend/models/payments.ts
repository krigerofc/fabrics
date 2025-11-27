/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class Payment {
  private constructor() {}

  static async create(
    userId: string,
    saleId: string,
    amount: number,
    method: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BANK_TRANSFER',
    status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' = 'PENDING',
    transactionId?: string,
    paidAt?: Date) {
    try {
      return await prisma.payment.create({
        data: {
          amount,
          method,
          status,
          transactionId,
          paidAt,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId,
          saleId
        }
      });
    } catch (err: any) {
      throw new Error(`createPayment failed: ${err?.message ?? String(err)}`);
    }
  }

  static async getById(id: string, userId: string) {
    try {
      return await prisma.payment.findFirst({ where: { id, userId } });
    } catch (err: any) {
      throw new Error(`getPaymentById failed: ${err?.message ?? String(err)}`);
    }
  }

  static async getBySaleId(saleId: string, userId: string) {
    try {
      return await prisma.payment.findFirst({  where: { saleId, userId }})
    } catch (err: any) {
      throw new Error(`getPaymentBySaleId failed: ${err?.message ?? String(err)}`)
    }
  }

  static async update(
    id: string,
    userId: string,
    amount?: number,
    method?: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BANK_TRANSFER',
    status?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED',
    transactionId?: string,
    paidAt?: Date
  ) {
    try {
      return await prisma.payment.updateMany({
        where: { id, userId },
        data: {
          ...(amount !== undefined ? { amount } : {}),
          ...(method ? { method } : {}),
          ...(status ? { status } : {}),
          ...(transactionId ? { transactionId } : {}),
          ...(paidAt ? { paidAt } : {}),
          updatedAt: new Date()
        }
      })
    } catch (err: any) {
      throw new Error(`updatePayment failed: ${err?.message ?? String(err)}`)
    }
  }


  static async delete(id: string, userId: string) {
    try {
      return await prisma.payment.deleteMany({  where: { id, userId } });
    } catch (err: any) {
      throw new Error(`deletePayment failed: ${err?.message ?? String(err)}`)
    }
  }


  static async list(
    userId: string,
    status?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED',
    method?: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BANK_TRANSFER',
    skip?: number,
    take?: number,
    orderBy?: 'asc' | 'desc'
  ) {
    try {
      return await prisma.payment.findMany({
        where: {
          userId,
          ...(status ? { status } : {}),
          ...(method ? { method } : {})
        },
        skip,
        take,
        orderBy: orderBy ? { createdAt: orderBy } : undefined
      })
    } catch (err: any) {
      throw new Error(`listPayments failed: ${err?.message ?? String(err)}`)
    }
  }
}
