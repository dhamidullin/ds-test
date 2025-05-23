import { Request, Response, NextFunction } from 'express'

export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`)
  next()
}
