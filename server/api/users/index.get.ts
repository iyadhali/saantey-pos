import { users } from '../../db/schema'
import { useDatabase } from '../../db'

export default defineEventHandler(async () => {
  try {
    const db = useDatabase()
    const allUsers = await db.select({
      id: users.id,
      username: users.username,
    }).from(users)
    return allUsers
  } catch {
    return []
  }
})
