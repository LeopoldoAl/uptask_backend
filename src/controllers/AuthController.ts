import { Request, Response } from "express"
import User from "../models/User"
import { hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
    export class AuthController {
        static createAccount = async (req: Request, res: Response) => {
            try {
                const { password, email }  = req.body
                // Preventing duplicated users
                const userExists = await User.findOne({email})
                if (userExists) {
                    const error = new Error('This user has already been registered')
                    res.status(409).json({error: error.message})
                    return
                }
                // Creating a user
                const user = new User(req.body)
                // Hash password
                user.password = await hashPassword(password)
                // Generating Token
                const token = new Token()
                token.token = generateToken()
                token.user = user.id
                await Promise.allSettled([user.save(), token.save()])
                res.send('Account has been created, review your email to confirm!')
            } catch (error) {
                res.status(500).json({error: 'There was an error!'})
            }
        }
    }