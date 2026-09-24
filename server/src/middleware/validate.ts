import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validate = (schema: z.ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map(i => i.message).join(', ');
        return res.status(400).json({
          success: false,
          message: messages || 'Validation failed',
          errors: error.issues
        });
      }
      next(error);
    }
  };
};
