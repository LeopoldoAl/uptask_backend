import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import User from "../models/User"
export const authenticate = async (req:Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    if(!bearer) {
        const error = new Error("Not authorized")
        res.status(404).json({error: error.message})
        return
    }
    const [,token] = bearer.split(' ')
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id)
            console.log(user)
        }
        
    } catch (error) {
        res.status(500).json({error: 'Token does not valid'})
    }
    next()
}