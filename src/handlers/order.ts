import express, { Request, Response } from "express";
import { Order, OrderProduct, OrderStore } from "../models/order";
import CustomExpressError from "../models/custom_error";
import { protect } from "../middlewares/protect_routes";

const index = async (_req:Request, res: Response, next: Function) => {
    try {
        const orders = await OrderStore.index();
        if(!orders.length){
            throw new CustomExpressError("Orders Not Found", 404);
        }
        return res.json(orders)
    } catch (error) {
        return next(error);
    }
}

const show = async (req:Request, res: Response, next: Function) => {
    try {
        const id = Number.parseInt(req.params.id);
        const order = await OrderStore.show(id);
        if(!order){
            throw new CustomExpressError(`Order with id: ${id} Not Found`, 404);
        }
        return res.json(order);
    } catch (error) {
        return next(error);
    }
}

const create = async (req:Request, res: Response, next: Function) => {
    try {
        const order: Order = {
            user_id: req.body.user_id,
            staus: "active"
        }
        const orderSaved =  await OrderStore.create(order);
        return res.status(201).json(orderSaved) 
    } catch (error) {
        return next(error);
    }
}

const addProductToOrder = async (req:Request, res: Response, next: Function) => {
    try {
        const orderId = Number.parseInt(req.params.id);
        const orderProduct: OrderProduct = {
            order_id: orderId,
            product_id: req.body.product_id,
            quantity: req.body.quantity
        }
        const orderProductSaved = await OrderStore.addProductToOrder(orderProduct);
        return res.status(201).json(orderProductSaved);
    } catch (error) {
        return next(error);
    }
}

const getUsersOrder = async (req: Request, res: Response, next: Function) =>{
    try {
        const userId = Number.parseInt(req.params.user_id);
        const orders = await OrderStore.getUserCurrentOrder(userId);
        if (!orders.length){
            throw new CustomExpressError(`No Orders Found for user with id: ${userId}`, 404);
        }
        return res.json(orders);
    } catch (error) {
        
    }
}

const completeOrder = async (req:Request, res: Response, next: Function) => {
    try {
        const userId = Number.parseInt(req.params.user_id);
        const orderComplete = await OrderStore.completeOrder(userId)
        return res.json(orderComplete);
    } catch (error) {
        return next(error);
    }
}

const ordersRoutes = (app: express.Application) => {
    app.get("/api/v1/orders",protect, index);
    app.post("/api/v1/orders", protect, create);
    app.get("/api/v1/orders/:id",protect, show);
    app.post("/api/v1/orders/:id/add", protect, addProductToOrder);
    app.get("/api/v1/orders/user/:user_id", protect, getUsersOrder);
    app.put("/api/v1/orders/complete/:user_id", protect,completeOrder)
}

export default ordersRoutes;