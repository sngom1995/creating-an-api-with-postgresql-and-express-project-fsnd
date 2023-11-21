import client from "../database";
import CustomExpressError from "./custom_error";

export type Product = {
    id?: number;
    name: string;
    price: number;
    category?: string;
}

export class ProductStore {
    static async index(): Promise<Product[]>{
        try {
            const conn = await client.connect();
            const sql = "SELECT * FROM products";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new CustomExpressError(`Cannot find products. Error: ${(error as Error).message}`, 404);
        }
    }

    static async show(id: number): Promise<Product>{
        try {
            const conn = await client.connect();
            const sql = "SELECT * FROM products WHERE id=($1)";
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0]
        } catch (error) {
            throw new CustomExpressError(`Cannot find product with id: ${id}. Error: ${(error as Error).message}`, 404);
        }
    }

    static async getProductBycategory(category: string): Promise<Product[]>{
        try {
            const conn = await client.connect();
            const sql = "SELECT * FROM products WHERE category=($1)";
            const result = await conn.query(sql, [category]);
            conn.release();
            return result.rows
        } catch (error) {
            throw new CustomExpressError(`Cannot find product with category: ${category}. Error: ${(error as Error).message}`, 404);
        }
    }

    static async create(product: Product): Promise<Product>{
        try {
            const conn = await client.connect();
            const sql = "INSERT INTO products(name, price, category) VALUES ($1, $2, $3) RETURNING *";
            const result = await conn.query(sql, [product.name, product.price, product.category]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new CustomExpressError(`Cannot find products. Error: ${(error as Error).message}`, 422);
        }
    }

    static async getTop5Product():Promise<any[]>{
        try {
            const conn = await client.connect();
            const sql = "SELECT product_id, SUM(quantity) FROM orders_products GROUP BY product_id ORDER BY SUM(quantity) limit 5"
            const result = await conn.query(sql);
            conn.release();
            return result.rows
        } catch (error) {
            throw new CustomExpressError(`Cannot find products. Error: ${(error as Error).message}`, 422);
        }
    }
    
}