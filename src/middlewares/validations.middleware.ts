import { Request, Response, NextFunction } from 'express';
import { failureResponse } from '../utils/responses';
import { Schema } from '../validations/schema';

export const validate = (type: string, source?: 'query' | 'params') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = source || 'body';
      const data = req[`${key}`];
      // source == 'query' ? (data = ) : source == 'params' ? (data = req.params) : (data = req.body);
      const value = await Schema[type].validateAsync(data, {
        abortEarly: false
      });
      req[`${key}`] = value;
      // if (!source) {
      //   req.body = value;
      // }
      // source == 'query' && (req.query = value);
      // source == 'params' && (req.params = value);
      next();
    } catch (err) {
      console.log(err);
      delete err._original;
      const errors = err.details.map(
        (e: { message: string; path: string[] }) => {
          return { message: e.message, path: e.path };
        }
      );
      failureResponse('Problem with request body', errors, res);
    }
  };
};
