import express from 'express'
import { requestLogger } from '../middleware/logger'
import { corsMiddleware } from '../middleware/cors'
import apiRouter from '../routes'

export function configureApp() {
  const app = express()

  // Basic middleware
  app.use(corsMiddleware)
  app.use(express.json())

  // Custom middleware
  app.use(requestLogger)

  // Routes
  app.get('/', (_req, res) => {
    res.send('API is working')
  })

  app.use('/api', apiRouter)

  return app
} 