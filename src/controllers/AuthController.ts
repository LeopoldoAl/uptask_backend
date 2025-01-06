import { Request, Response } from "express"
import User from "../models/User"
    export class AuthController {
        static createAccount = async (req: Request, res: Response) => {
            try {
                const user = new User(req.body)
                await user.save()
                res.send('Account has been created, review your email to confirm!')
            } catch (error) {
                res.status(500).json({error: 'There was an error!'})
            }
        }
    }