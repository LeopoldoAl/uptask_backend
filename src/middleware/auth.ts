import { Request, Response, NextFunction } from "express"
export const authenticate = async (req:Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    if(!bearer) {
        const error = new Error("Not authorized")
        res.status(404).json({error: error.message})
        return
    }
    const [,token] = bearer.split(' ')
    console.log(token)
    next()
}