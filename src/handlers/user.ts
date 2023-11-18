import express, {Request, Response } from "express";
import bcrypt from "bcrypt";
import { User, UserStore } from "../models/user";
import { generateToken } from "../modules/auth";
import CustomExpressError from "../models/custom_error";
import { protect } from "../middlewares/protect_routes";

const { SALT } = process.env;

const index = async (_req:Request, res: Response, next: Function) => {
    try {
        const users = await UserStore.index();
        return res.json(users);
    } catch (error) {
       return next(error) 
    }
}

const create = async (req:Request, res: Response, next: Function) => {
  try {
    const userExists = await UserStore.findByUsername(req.body.username);
    if (userExists) {
        throw new CustomExpressError(`A User with username: ${req.body.username} already exists`, 422);
    }
    const saltArounds = Number.parseInt(SALT!);
    const salt = await bcrypt.genSalt(saltArounds);
    const hashPassworrd = await bcrypt.hash(req.body.password, salt)
    const user: User = {
        id: 1,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: hashPassworrd
    }
    const savedUser = await UserStore.create(user);
    return res.status(201).json(savedUser)
  } catch (error) {
    return next(error)
  }
}

const show = async (req:Request, res: Response, next: Function) => {
    try {
        const id = Number.parseInt(req.params.id);
        const user = await UserStore.show(id)
        return res.json(user);
    } catch (error) {
        return next(error);
    }
}

const update = async (req: Request, res: Response, next: Function) => {
    
    try {
        const id = Number.parseInt(req.params.id);
        const user: User = {
            id: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password
        }
        const updatedUser = await UserStore.update(id, user);
        return res.json(updatedUser)
    } catch (error) {
        return next(error)
    }
}

const deleteUser = async (req:Request, res: Response, next: Function) => {
    try {
        const id = Number.parseInt(req.params.id);
        const deletedUser = await UserStore.delete(id);
        return res.json(deletedUser)
    } catch (error) {
        return next(error)        
    }
}

const signin =async (req:Request, res: Response, next: Function) => {
    try {
        const { username, password } = req.body;
        const user = await UserStore.findByUsername(username);
        const isValidPassword =  await bcrypt.compare(password, user.password);
        if(!isValidPassword){
            throw new CustomExpressError("Wrong password", 422);
        }
        const token = await generateToken(user);
        return res.json({token})
    } catch (error) {
        return next(error);
    }
}

const userRoutes = (app: express.Application) =>{
    app.get("/api/v1/users", protect, index);
    app.post("/api/v1/users/register", create);
    app.post("/api/v1/users/login", signin)
    app.get("/api/v1/users/:id", protect, show);
    app.put("/api/v1/users/:id", protect, update);
    app.delete("/api/v1/users/:id", deleteUser)
}

export default userRoutes;