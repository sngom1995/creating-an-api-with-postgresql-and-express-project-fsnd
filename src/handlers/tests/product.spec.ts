import app from "../../server";
import supertest from "supertest";
import client from "../../database";
import { PoolClient } from "pg";
import bcrypt from "bcrypt";


const request = supertest(app);

describe("GET /products", () =>{
    let conn;
    beforeEach(
        async () => {
            conn = await client.connect();
            await conn.query("INSERT INTO products(name, price) VALUES ($1,$2)", ["cafe", 50]);
    })

    afterAll(
        async () => {
            conn = await client.connect();
            await conn.query("DELETE FROM products WHERE id>($1)", [3]);
    })
    it("GET all products", async () => {
        const response = await request.get('/api/v1/products');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(1);
    })
    it("GET  one product", async () => {
        const response = await request.get('/api/v1/products/1');
        expect(response.status).toBe(200);
    })

    it("GET  one product - NotFound", async () => {
        const response = await request.get('/api/v1/products/0');
        expect(response.status).toBe(404);
    })
})

describe("POST /products", () => {
    let conn: PoolClient;
    let token: string
    beforeEach(
        async () => {
            conn = await client.connect();
            const salt = await bcrypt.genSalt(10);
            const hashPassworrd = await bcrypt.hash("tester", salt);
            await conn.query("INSERT INTO users (firstName, lastName, username, password) VALUES ($1, $2, $3,$4)", ["test", "test","testeur",hashPassworrd]);
            const res = await request.post("/api/v1/users/login")
                                .send({
                                    "username": "testeur",
                                    "password":"tester"
                                });
            token = res.body.token;
    })

    afterAll(
        async () => {
            conn = await client.connect();
            await conn.query("DELETE FROM users WHERE username=($1)", ["testeur"]);
    })

    it("POST create product",async () => {
      const response = await request.post("/api/v1/products")
                        .set("Authorization", `Bearer ${token}`)
                        .send({
                            "name": "Jersey",
                            "price": 200.0,
                            "category": "clothes"
                        });
        expect(response.status).toBe(201);              
    })
})