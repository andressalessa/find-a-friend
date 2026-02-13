import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import 'dotenv/config'
import type { Environment } from 'vitest/environments'
import { prisma } from '@/lib/prisma'

/**
 * Gera uma URL de banco temporário com schema único
 */
function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL não está definida. Certifique-se de que:\n' +
      '1. O arquivo .env existe na raiz do projeto\n' +
      '2. A variável DATABASE_URL está definida no .env\n' +
      '3. O formato é: postgresql://usuario:senha@localhost:5432/nome_do_banco\n' +
      '4. O container do banco está rodando (docker compose up -d)'
    )
  }
  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)
  return url.toString()
}

/**
 * Ambiente de testes para Vitest + Prisma
 * Compatível com Vitest v4 e Node v22
 */
export default <Environment>{
  name: 'prisma',
  viteEnvironment: 'ssr',

  async setup() {
    const schema = randomUUID()
    const databaseUrl = generateDatabaseUrl(schema)
    process.env.DATABASE_URL = databaseUrl

    console.log(`🧪 Criando schema de teste: ${schema}`)

    execSync(`npx prisma db push --force-reset`, {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
        PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION: 'yes',
      },
    })

    return {
      async teardown() {
        console.log(`🧹 Removendo schema: ${schema}`)
        try {
          await prisma.$executeRawUnsafe(
            `DROP SCHEMA IF EXISTS "${schema}" CASCADE;`,
          )
        } catch (err) {
          console.error('Erro ao apagar schema:', err)
        } finally {
          await prisma.$disconnect()
        }
      },
    }
  },
}
