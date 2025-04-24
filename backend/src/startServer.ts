import { configureApp } from './config/server'

const PORT = 3001

export function startServer() {
  const app = configureApp()

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })

  return app
}
