import express, { Request, Response } from "express";
import { Product, ProductStore } from "../models/product";
import { protect } from "../middlewares/protect_routes";
import CustomExpressError from "../models/custom_error";


const create =async (req: Request, res: Response, next: Function) => {
    try {
        const { name, price, category } = req.body;
        const product: Product = { name, price, category};
        const productSaved = await ProductStore.create(product);
        return res.json(productSaved);
    } catch (error) {
        return next(error)
    }
}

const index = async (_req: Request, res: Response, next: Function) => {
    try {
        const products = await ProductStore.index();
        if (!products.length){
            throw new CustomExpressError("Not Found", 404);
        }
        return res.json(products);
    } catch (error) {
        return next(error);
    }
}

const show =async (req:Request, res: Response, next: Function) => {
    try {
        const id = Number(req.params.id);
        const product = await ProductStore.show(id);
        if (!product){
            throw new CustomExpressError("Not Found", 404);
        }
        return res.json(product) 
    } catch (error) {
        return next(error);
    }
}

const topFiveProduct =async (_req: Request, res:Response, next: Function) => {
    try {
        const products = await ProductStore.getTop5Product();
        if (!products.length){
            throw new CustomExpressError("Not Found", 404);
        }
        return res.json(products)
    } catch (error) {
        return next(error);
    }
}

const productByCateghory =async (req: Request, res:Response, next: Function) => {
    try {
        const products = await ProductStore.getProductBycategory(req.params.category);
        if (!products.length){
            throw new CustomExpressError("Not Found", 404);
        }
        return res.json(products)
    } catch (error) {
        return next(error);
    }
}

const prductRoutes = (app: express.Application) => {
    app.get("/api/v1/products", index);
    app.post("/api/v1/products", protect, create);
    app.get("/api/v1/products/:id", show);
    app.get("/api/v1/products/categories/:category", productByCateghory);
    app.get("/api/v1/products/top/orders", topFiveProduct);
}

export default prductRoutes;
