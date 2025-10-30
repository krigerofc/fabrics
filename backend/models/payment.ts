/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class Payment {
  private constructor() {}

  static async create( saleId: string, amount: number,
    method: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BANK_TRANSFER',
    status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' = 'PENDING',
    transactionId?: string, paidAt?: Date) {
    try {
      return await prisma.payment.create({
        data: {
          saleId,
          amount,
          method,
          status,
          transactionId,
          paidAt
        }
      })
    } catch (err: any) {
      throw new Error(`createPayment failed: ${err?.message ?? String(err)}`)
    }
  }

  static async getById(id: string) {
    try {
      return await prisma.payment.findUnique({
        where: { id }
      })
    } catch (err: any) {
      throw new Error(`getPaymentById failed: ${err?.message ?? String(err)}`)
    }
  }

  static async getBySaleId(saleId: string) {
    try {
      return await prisma.payment.findUnique({
        where: { saleId }
      })
    } catch (err: any) {
      throw new Error(`getPaymentBySaleId failed: ${err?.message ?? String(err)}`)
    }
  }

  static async update(id: string, amount?: number,
    method?: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BANK_TRANSFER',
    status?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED',
    transactionId?: string, paidAt?: Date) {
    try {
      return await prisma.payment.update({
        where: { id },
        data: {
          ...(amount ? { amount } : {}),
          ...(method ? { method } : {}),
          ...(status ? { status } : {}),
          ...(transactionId ? { transactionId } : {}),
          ...(paidAt ? { paidAt } : {})
        }
      })
    } catch (err: any) {
      throw new Error(`updatePayment failed: ${err?.message ?? String(err)}`)
    }
  }

  static async delete(id: string) {
    try {
      return await prisma.payment.delete({
        where: { id }
      })
    } catch (err: any) {
      throw new Error(`deletePayment failed: ${err?.message ?? String(err)}`)
    }
  }

  static async list(
    status?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED',
    method?: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BANK_TRANSFER',
    skip?: number, take?: number, orderBy?: 'asc' | 'desc' ) {
    try {
      return await prisma.payment.findMany({
        where: {
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
