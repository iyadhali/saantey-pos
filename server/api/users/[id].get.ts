import { eq } from 'drizzle-orm'
import { users } from '../../db/schema'
import { useDatabase } from '../../db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'User ID is required' })
  }

  try {
    const db = useDatabase()
    const [user] = await db.select({
      id: users.id,
      username: users.username,
    }).from(users).where(eq(users.id, id))

    if (!user) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    return user
  } catch (error: unknown) {
    if (error instanceof Error && 'statusCode' in error) throw error
    throw createError({ statusCode: 500, message: 'Failed to fetch user' })
  }
})
