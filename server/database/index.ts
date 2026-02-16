import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../../shared/schema'

let _db: ReturnType<typeof drizzle> | null = null

export function useDatabase() {
  if (!_db) {
    const config = useRuntimeConfig()
    if (!config.databaseUrl) {
      throw new Error('DATABASE_URL is not configured')
    }
    _db = drizzle(config.databaseUrl, { schema })
  }
  return _db
}
