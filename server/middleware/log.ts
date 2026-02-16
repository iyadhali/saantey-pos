export default defineEventHandler((event) => {
  const start = Date.now()

  event.node.res.on('finish', () => {
    const duration = Date.now() - start
    const path = getRequestURL(event).pathname
    if (path.startsWith('/api')) {
      const method = getMethod(event)
      const status = event.node.res.statusCode
      console.log(`${new Date().toLocaleTimeString()} [nitro] ${method} ${path} ${status} in ${duration}ms`)
    }
  })
})
