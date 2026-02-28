import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import User from '../models/User'

export const protect = async (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Não autorizado' })
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string)
    req.user = await User.findById(decoded.id).select('-password')
    next()
  } catch {
    res.status(401).json({ message: 'Token inválido' })
  }
}

export const adminOnly = (req: any, res: Response, next: NextFunction) => {
  if (req.user?.isAdmin) return next()
  res.status(403).json({ message: 'Acesso negado' })
}
