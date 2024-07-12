/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { ValidateError } from "tsoa";
import errorService from '../services/errorService';

export function errorHandler(err: { message: string, stack: string }, req: Request, res: Response, _next: NextFunction): Response<any, Record<string, any>> {

  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  // if (err instanceof Error) {
    const errorDetails = {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      request: req.body,
      time: new Date().toISOString()
    };
    errorService.create(errorDetails)
    return res.status(500).json({
      message: errorDetails.message,
    });
  // }
}