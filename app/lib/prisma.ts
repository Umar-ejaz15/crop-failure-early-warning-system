import { PrismaClient } from '@prisma/client'

const prismClientSingleton = () => {
    return new PrismaClient()
}

declare global {
    var prisma: undefined | ReturnType<typeof prismClientSingleton>
}

const prisma = globalThis.prisma ?? prismClientSingleton()

export { prisma }

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma