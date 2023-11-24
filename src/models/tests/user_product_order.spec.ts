import client from "../../database"
import { Product, ProductStore } from "../product"
import { User, UserStore } from "../user";


describe("TEST CRUD ON PRODUCT MODEL", () =>{
    let id : number;
    let user_id : number;
    let username: string
    beforeAll( async(done)=>{
        username = `sngom${Math.floor(Math.random() * 1000)}`
        const conn = await client.connect();
        const result =await conn.query("INSERT INTO products(name, price, category) VALUES ($1,$2, $3) RETURNING id", ["cafe touba", 50, "Boisson"]);
        id = result.rows[0].id;
        const res = await conn.query("INSERT INTO users (firstName, lastName, username, password) VALUES ($1, $2, $3,$4) RETURNING id",["test_user","test_user",username,"test"]);
        user_id = res.rows[0].id;
        done();
    })
    it("test index() function",async (done) => {
        const products = await ProductStore.index();
        expect(products.length).toBeGreaterThanOrEqual(1);
        done();
    })

    it("test show(id: number) function",async (done) => {
        const product = await ProductStore.show(id);
        expect(product.name).toBe("cafe touba");
        done();
    })

    it("test create(product: Product) function",async (done) => {
        const prod: Product = {
            name: "Jean",
            price: 1000
        } 
        const product = await ProductStore.create(prod);
        expect(product.price).toBe(prod.price);
        done();
    })

    it("test getProductBycategory(category)  function",async (done) => {
        const prod: Product = {
            name: "The",
            price: 1000,
            category: "Boisson"
        } 
        const productDeleted = await ProductStore.getProductBycategory(prod.category!)
        expect(productDeleted.length).toBeGreaterThan(0);
        done();
    })

    it("GET all users",async (done:Function) => {
        const users = await UserStore.index();
        expect(users).toBeTruthy();
        done()
    })

    
    it("test show(id: number) user function",async (done) => {
        const user = await UserStore.show(user_id);
        console.log(user)
        expect(user.username).toBeTruthy();
        done();
    })

    it("test create(user: User) function",async (done) => {
        username = `sngom${Math.floor(Math.random() * 1000)}`
        const user: User = {
            firstName: "Jean",
            lastName: "Paul",
            username: username,
            password: "tester",
        } 
        const userSaved = await UserStore.create(user);
        console.log(userSaved)
        expect(userSaved).toBeTruthy();
        done();
    })

    
})