import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const authSchema = z.object({
  authorization: z.string().regex(/^Bearer /),
});

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = authSchema.parse({ authorization: req.headers.authorization });
    const token = authorization.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or missing token' });
  }
};