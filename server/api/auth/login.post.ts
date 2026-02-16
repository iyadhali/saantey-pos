export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.username || !body?.password) {
    throw createError({ statusCode: 400, message: 'Username and password are required' })
  }

  // Placeholder - implement real auth with session/JWT
  return {
    success: true,
    user: { id: '1', username: body.username },
  }
})
