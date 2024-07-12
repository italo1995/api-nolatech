import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppConfig from '../config/AppConfig';

export const expressAuthentication = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.includes(' ') ? authHeader.split(' ')[1] : authHeader
    jwt.verify(token, AppConfig.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.auth = user;
      next();
      return
    });
  } else {
    next();
    return
  }
};

