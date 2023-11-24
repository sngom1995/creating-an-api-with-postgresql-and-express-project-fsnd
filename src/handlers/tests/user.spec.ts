import supertest from "supertest";
import app from "../../server";
import client from "../../database";
import { PoolClient } from "pg";
import bcrypt from "bcrypt";

const request = supertest(app);

describe("GET */users", () =>{
    let conn: PoolClient;
    let token: string;
    let id: number;
    let username: string;
    let order_id: number;
    beforeAll(async(done) =>{
        conn = await client.connect();
        conn = await client.connect();
            const salt = await bcrypt.genSalt(10);
            const hashPassworrd = await bcrypt.hash("tester", salt);
            const result = await conn.query("INSERT INTO users (firstName, lastName, username, password) VALUES ($1, $2, $3,$4) RETURNING id",["test_user","test_user","test_user",hashPassworrd]);
            id = result.rows[0].id;
            const resul = await conn.query("INSERT INTO orders(user_id, status) VALUES ($1, $2) RETURNING id",[id, "active"]);
            order_id = resul.rows[0].id;
            console.log("id:", id)
            const res = await request.post("/api/v1/users/login")
                                .send({
                                    "username": "test_user",
                                    "password":"tester"
                                });
            token = res.body.token;
            username = `sngom${Math.random() * 1000}`;
            done();
    })

    it("GET all users", async (done) => {
        const response = await request.get('/api/v1/users')
                                .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        done()
    })
    it("GET  one user", async (done) => {
        const response = await request.get(`/api/v1/users/${id}`)
                    .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        done()
    })

    it("GET  one user - NotFound", async (done) => {
        const response = await request.get('/api/v1/users/0')
                .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(404);
        done();
    })

    it("POST create user",async (done) => {
        const response = await request.post("/api/v1/users/register")
                          .set("Authorization", `Bearer ${token}`)
                          .send({
                              "firstName": "samba",
                              "lastName": "ngom",
                              "username": username,
                              "password": "passer"
                          });
          expect(response.status).toBe(201); 
          done();             
      })
      it("POST create order",async (done) => {
        const response = await request.post("/api/v1/orders")
                          .set("Authorization", `Bearer ${token}`)
                          .send({
                             "user_id": id
                          });
          expect(response.status).toBe(201);    
          done();          
      })


      it("GET all orders", async (done) => {
        const response = await request.get('/api/v1/orders')
                                .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        done()
    })
    it("GET  one order", async (done) => {
        const response = await request.get(`/api/v1/orders/${order_id}`)
                    .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        done()
    })

    it("GET  one user - NotFound", async (done) => {
        const response = await request.get('/api/v1/orders/0')
                .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(404);
        done()
    })

})





