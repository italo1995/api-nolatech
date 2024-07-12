/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import AppConfig from "./config/AppConfig";
import { IUserResponse } from "./models/user/userModel";
import { Request } from 'express';
import jwt from 'jsonwebtoken';

export async function expressAuthentication(
  request: Request,
  securityName: string,
  _scopes?: string[]
): Promise<{
  token?: string | null;
  auth?: IUserResponse | null;
}> {
  if (securityName === "bearerAuth") {
    const authHeader = request.headers.authorization;
    if (authHeader) {
      const token = authHeader.includes(' ') ? authHeader.split(' ')[1] : authHeader;
      try {
        const auth = jwt.verify(token, AppConfig.JWT_SECRET_KEY) as IUserResponse;
        request.auth = auth;
        return { token, auth };
      } catch (err) {
        throw new Error('Token inválido o expirado');
      }
    }
    throw new Error('No se proporcionó un token de autenticación');
  } else {
    throw new Error('Método de autenticación no soportado');
  }
}
