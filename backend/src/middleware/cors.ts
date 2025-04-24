import cors from 'cors'
import { CorsOptions } from 'cors'

const getCorsOrigin = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return '*'
  }

  if (!process.env.CORS_ORIGIN) {
    throw new Error('CORS_ORIGIN environment variable is required in production')
  }

  return process.env.CORS_ORIGIN
}

const corsOptions: CorsOptions = {
  origin: getCorsOrigin(),
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}

export const corsMiddleware = cors(corsOptions) 