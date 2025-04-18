import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 3001

app.use(express.json())

app.get('/', (_req, res) => {
  res.send('API is working')
})

app.get('/ping', (_req, res) => {
  res.json({ message: 'pong' })
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
