import { Request, Response } from "express"
import User from "../models/User"
import { hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
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
                // Sending email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })
                await Promise.allSettled([user.save(), token.save()])
                res.send('Account has been created, review your email to confirm!')
            } catch (error) {
                res.status(500).json({error: 'There was an error!'})
            }
        }
        static confirmAccount = async (req: Request, res: Response) => {
            try {
                const { token } = req.body
                const tokenExists = await Token.findOne({token})
                if (!tokenExists) {
                    const error = new Error("Token does no valid!")
                    res.status(401).json({error: error.message})
                    return
                }

                const user = await User.findById(tokenExists.user)
                user.confirmed = true

                await Promise.allSettled([user.save(), tokenExists.deleteOne()])
                res.send('Account confirmed correctly!')
            } catch (error) {
                res.status(500).json({error: 'There was an error!'})
            }
        }
    }