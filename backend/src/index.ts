import express from 'express'
import cors from 'cors'
import apiRouter from './routes'

const app = express()
const PORT = 3001

app.use(cors())

// logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.use(express.json())

app.get('/', (_req, res) => {
  res.send('API is working')
})

app.use('/api', apiRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
