import path from 'node:path'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      'generated/prisma/client': path.resolve(__dirname, 'generated/prisma/client'),
    },
  },
  test: {
    include: ['src/**/*.spec.ts'],
    projects: [
      {
        plugins: [tsconfigPaths()],
        test: {
          name: 'unit',
          include: [
            'src/services/**/*.spec.ts',
            'src/dtos/**/*.spec.ts',
          ],
          environment: 'node',
        },
        resolve: {
          alias: {
            'generated/prisma/client': path.resolve(__dirname, 'generated/prisma/client'),
          },
        },
      },
      {
        plugins: [tsconfigPaths()],
        test: {
          name: 'e2e',
          include: ['src/http/controllers/**/*.spec.ts'],
          environment: './prisma/vitest-environment-prisma/prisma-test-environment.ts',
        },
        resolve: {
          alias: {
            'generated/prisma/client': path.resolve(__dirname, 'generated/prisma/client'),
          },
        },
      },
    ],
  },
})
