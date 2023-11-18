import dotenv from 'dotenv';
import { Pool } from "pg";

dotenv.config()
let client: Pool

const { 
    POSTGRES_HOST,
    POSTGRES_USER,
    POSGRES_DB,
    POSTGRES_PASSWORD,
    POSTGRES_TEST_USER,
    POSGRES_DB_TEST,
    ENV,
    } = process.env;
if(ENV=='test'){
    client = new Pool(
        {
            host: POSTGRES_HOST,
            user: POSTGRES_TEST_USER,
            password: POSTGRES_PASSWORD,
            database: POSGRES_DB_TEST
        }
    )
}

if(ENV=='dev'){
    client = new Pool(
        {
            host: POSTGRES_HOST,
            user: POSTGRES_USER,
            password: POSTGRES_PASSWORD,
            database: POSGRES_DB
        }
    )
}
client = new Pool(
    {
        host: POSTGRES_HOST,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        database: POSGRES_DB
    }
)


export default client;