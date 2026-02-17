import { describe, it, expect, vi, beforeAll } from 'vitest'

// Provide Nitro server auto-imports for testing
beforeAll(() => {
  // @ts-expect-error -- mock Nitro global: defineEventHandler
  globalThis.defineEventHandler = (handler: unknown) => handler
  // @ts-expect-error -- mock Nitro global: readBody
  globalThis.readBody = vi.fn()
  // @ts-expect-error -- mock Nitro global: createError
  globalThis.createError = (opts: { message: string }) => new Error(opts.message)
  // @ts-expect-error -- mock Nitro global: getRouterParam
  globalThis.getRouterParam = vi.fn()
  // @ts-expect-error -- mock Nitro global: getMethod
  globalThis.getMethod = vi.fn()
  // @ts-expect-error -- mock Nitro global: getRequestURL
  globalThis.getRequestURL = vi.fn()
  // @ts-expect-error -- mock Nitro global: useRuntimeConfig
  globalThis.useRuntimeConfig = () => ({ databaseUrl: '', sessionSecret: '' })
  // @ts-expect-error -- mock Nitro global: useDatabase
  globalThis.useDatabase = vi.fn()
})

describe('Auth API', () => {
  it('login endpoint module exists and exports a handler', async () => {
    const mod = await import('~~/server/api/auth/login.post')
    expect(mod.default).toBeDefined()
    expect(typeof mod.default).toBe('function')
  })

  it('logout endpoint module exists and exports a handler', async () => {
    const mod = await import('~~/server/api/auth/logout.post')
    expect(mod.default).toBeDefined()
    expect(typeof mod.default).toBe('function')
  })
})

describe('Users API', () => {
  it('users list endpoint module exists', async () => {
    const mod = await import('~~/server/api/users/index.get')
    expect(mod.default).toBeDefined()
    expect(typeof mod.default).toBe('function')
  })

  it('user by id endpoint module exists', async () => {
    const mod = await import('~~/server/api/users/[id].get')
    expect(mod.default).toBeDefined()
    expect(typeof mod.default).toBe('function')
  })
})

describe('Database', () => {
  it('useDatabase export exists', async () => {
    const mod = await import('~~/server/db/index')
    expect(mod.useDatabase).toBeDefined()
    expect(typeof mod.useDatabase).toBe('function')
  })
})

describe('Server Middleware', () => {
  it('log middleware module exists', async () => {
    const mod = await import('~~/server/middleware/log')
    expect(mod.default).toBeDefined()
    expect(typeof mod.default).toBe('function')
  })
})
