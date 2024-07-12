import { Request, Response, NextFunction } from 'express';
export declare function errorHandler(err: {
    message: string;
    stack: string;
}, req: Request, res: Response, _next: NextFunction): Response<any, Record<string, any>>;
