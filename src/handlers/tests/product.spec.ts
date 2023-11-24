import app from "../../server";
import supertest from "supertest";
import client from "../../database";
import { PoolClient } from "pg";
import bcrypt from "bcrypt";


const request = supertest(app);

describe("GET /products", () =>{
    let conn: PoolClient;
    let token: string;
    beforeEach(
        async (done) => {
            conn = await client.connect();
            await conn.query("INSERT INTO products(name, price) VALUES ($1,$2)", ["cafe", 50]);
            const salt = await bcrypt.genSalt(10);
            const hashPassworrd = await bcrypt.hash("tester", salt);
            await conn.query("INSERT INTO users (firstName, lastName, username, password) VALUES ($1, $2, $3,$4)", ["test", "test","testeur",hashPassworrd]);
            const res = await request.post("/api/v1/users/login")
                                .send({
                                    "username": "testeur",
                                    "password":"tester"
                                });
            token = res.body.token;
            done();
        })

    afterAll(
        async (done) => {
            conn = await client.connect();
            await conn.query("DELETE FROM products WHERE id>($1)", [3]);
            done();
    })
    it("GET all products", async (done) => {
        const response = await request.get('/api/v1/products');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(1);
        done();
    })
    it("GET  one product", async (done) => {
        const response = await request.get('/api/v1/products/1');
        expect(response.status).toBe(200);
        done();
    })

    it("GET  one product - NotFound", async (done) => {
        const response = await request.get('/api/v1/products/0');
        expect(response.status).toBe(404);
        done();
    })
    it("POST create product",async (done) => {
        const response = await request.post("/api/v1/products")
                          .set("Authorization", `Bearer ${token}`)
                          .send({
                              "name": "Jersey",
                              "price": 200.0,
                              "category": "clothes"
                          });
          expect(response.status).toBe(201);   
          done();           
      })
})