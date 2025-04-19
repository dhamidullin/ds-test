import express from 'express'
import cors from 'cors'
import apiRouter from './routes'
import { initializeDatabase } from './scripts/db-sync'

const app = express()
const PORT = 3001

app.use(cors()) // TODO: only allow frontend to access the API

// logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.use((req, res, next) => {
  setTimeout(() => {
    next()
  }, 500)
})

app.use(express.json())

app.get('/', (_req, res) => {
  res.send('API is working')
})

app.use('/api', apiRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)

  initializeDatabase()
})
