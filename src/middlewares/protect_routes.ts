import express from 'express';
import CustomExpressError from '../models/custom_error';
import jwt from  "jsonwebtoken"


export const protect = (req: express.Request, res: express.Response, next: Function) => {
    const bearer = req.headers.authorization;
  
    if (!bearer) {
        throw new CustomExpressError("Not authorized", 401); 
    }
  
    const token = bearer.split(" ")[1];
    if (!token) {
      throw new CustomExpressError("Not authorized, token missing", 401);  
    }
  
    try {
         jwt.verify(token, process.env.JWT_SECRET!);
        return next()
    } catch (e) {
        throw new CustomExpressError(`${(e as Error ).message} of token`, 422); 
    }
  };