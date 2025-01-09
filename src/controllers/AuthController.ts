import { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body
            // Preventing duplicated users
            const userExists = await User.findOne({ email })
            if (userExists) {
                const error = new Error('This user has already been registered')
                res.status(409).json({ error: error.message })
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
            res.send('Account has been created, review your email to confirm it!')
        } catch (error) {
            res.status(500).json({ error: 'There was an error!' })
        }
    }
    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error("Token does not valid!")
                res.status(404).json({ error: error.message })
                return
            }

            const user = await User.findById(tokenExists.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send('Account confirmed correctly!')
        } catch (error) {
            res.status(500).json({ error: 'There was an error!' })
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error("User didn't find!")
                res.status(404).json({ error: error.message })
                return
            }
            if (!user.confirmed) {
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()
                // Sending email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error("The account has not been confirmed!. We have sent you a confirmation email")
                res.status(401).json({ error: error.message })
                return
            }
            // Checking passsword
            const isPasswordCorrect = await checkPassword(password, user.password)
            if (!isPasswordCorrect) {
                const error = new Error("Password hasn't been correct!")
                res.status(401).json({ error: error.message })
                return
            }
            res.send("Authenticated...")
        } catch (error) {
            res.status(500).json({ error: 'There was an error!' })
        }
    }
    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            // Searching that the user exists
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('This user is not registered!')
                res.status(404).json({ error: error.message })
                return
            }
            // If the user has already been confirmed
            if (user.confirmed) {
                const error = new Error('This user is already confirmed!')
                res.status(403).json({ error: error.message })
                return
            }
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
            res.send('It has been sent you a new token to your email!')
        } catch (error) {
            res.status(500).json({ error: 'There was an error!' })
        }
    }
}