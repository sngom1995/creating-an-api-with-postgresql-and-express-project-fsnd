import express, { Request, Response } from "express";
import CustomExpressError from "../models/custom_error";

const globalErrorHandler = (err: CustomExpressError, req: Request, res: Response, next: Function) => {
    const status = err.status || 500;
    const message = err.message;
    return res.status(status).json({status: status, message: message})
}

const golbalErrorMiddleware = (app: express.Application) => {
    app.use(globalErrorHandler)
}

export default golbalErrorMiddleware;