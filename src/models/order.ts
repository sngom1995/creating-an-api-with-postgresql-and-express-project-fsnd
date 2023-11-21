import client from "../database";
import CustomExpressError from "./custom_error";

export type Order = {
    id?: number;
    user_id: number;
    staus: string;
}

export type OrderProduct = {
    id?: number;
    product_id: number;
    order_id: number;
    quantity: number;
}

export class OrderStore {
    static async index(): Promise<Order[]>{
        try {
            const conn = await client.connect();
            const sql = "SELECT * FROM orders";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new CustomExpressError(`Cannot find orders. Error : ${error}`, 404);
        }
    }

    static async show(id: number): Promise<Order>{
        try {
            const conn = await client.connect();
            const sql = "SELECT * FROM orders WHERE id=($1)";
            const result = await conn.query(sql,[id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new CustomExpressError(`Cannot find order with ${id}. Error : ${error}`, 404);
        }
    }


    static async getOrdersByUser(user_id: number): Promise<Order[]>{
        try {
            const conn = await client.connect();
            const sql = "SELECT * FROM orders WHERE user_id=($1)";
            const result = await conn.query(sql,[user_id]);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new CustomExpressError(`Cannot find order with usetr id ${user_id}. Error : ${error}`, 404);
        }
    }


    static async create(order: Order): Promise<Order>{
        try {
            const conn = await client.connect();
            const sql = "INSERT INTO orders(user_id, status) VALUES ($1, $2) RETURNING *";
            const result = await conn.query(sql,[order.user_id, order.staus]);
            return result.rows[0];
        } catch (error) {
            throw new CustomExpressError(`Cannot create order. Error : ${error}`, 422);
        }
    }

    static async addProductToOrder(order_product: OrderProduct): Promise<OrderProduct>{
        try {
            const conn = await client.connect();
            const sql = "INSERT INTO orders_products(order_id, product_id, quantity) VALUES ($1,$2, $3) RETURNING *";
            const result = await conn.query(sql, [order_product.order_id, order_product.product_id, order_product.quantity]);
            conn.release();
            return result.rows[0]
        } catch (error) {
            throw new CustomExpressError(`Cannot add product to order with ${order_product.order_id}. Error : ${error}`, 422)
        }
    }

}