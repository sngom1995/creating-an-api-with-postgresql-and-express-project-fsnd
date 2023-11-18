import client from "../database";
import bcrypt from "bcrypt";
import CustomExpressError from "./custom_error";


export type User = {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

export class UserStore {
    static async index(): Promise<User[]> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT * FROM users'
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Cannot get users ${(error as Error).message}`)
        }
    }
    static async show(id: number): Promise<User>{
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM users WHERE id = $1';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new CustomExpressError(`Cannot get user with id ${id}. Error: ${(error as Error).message}`, 404);
        }
    }

    static async create(user: User):  Promise<User>{
            try {
                const conn = await client.connect();
                const sql = "INSERT INTO users (firstName, lastName, username, password) VALUES ($1, $2, $3,$4) RETURNING *";
                const result = await conn.query(sql, [user.firstName, user.lastName, user.username, user.password]);
                conn.release();
                return result.rows[0]
            } catch (error) {
                throw new CustomExpressError(`Cannot create user. Error: ${error}`, 400)
            }
        }
    
    static async update(id: number, user:User): Promise<User>{
        try {
            const conn = await client.connect();
            const sql = "UPDATE users SET firstName=($2), lastName=($3), username=($4) WHERE id=($1) RETURNING *";
            const result = await conn.query(sql, [id, user.firstName, user.lastName, user.username]);
            return result.rows[0];
        } catch (error) {
            throw new CustomExpressError(`Cannot update user. Error: ${error}`, 400)
        }
    }

    static async findByUsername (username: string): Promise<User>{
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM users WHERE username=($1)';
            const result = await conn.query(sql, [username]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new CustomExpressError(`Cannot get user with username ${username}. Error: ${(error as Error).message}`, 500);
        }
    }

    static async delete(id: number): Promise<User>{
        try {
            const conn = await client.connect();
            const sql = "DELETE FROM users WHERE id = ($1)";
            const result = await conn.query(sql, [id]);
            return  result.rows[0];
        } catch (error) {
            throw new Error(`Cannot delete user. Error: ${error}`)
        }
    }
}
