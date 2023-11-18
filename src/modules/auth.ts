
import jsonwebtoken from "jsonwebtoken";
import { User } from "../models/user";


const { JWT_SECRET } = process.env;
const JWT_OPTIONS = { expiresIn: 24 * 60 * 60 };

export const generateToken = async (user: User) => {
    return jsonwebtoken.sign({id: user.id, username: user.username}, JWT_SECRET!, JWT_OPTIONS)
}