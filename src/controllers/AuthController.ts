import { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../utils/jwt"
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
            const token = generateJWT({id: user.id})
            res.send(token)
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
    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            // Searching that the user exists
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('This user is not registered!')
                res.status(404).json({ error: error.message })
                return
            }

            // Generating Token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()
            // Sending email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })
            res.send('Review your email to receive the instructions')
        } catch (error) {
            res.status(500).json({ error: 'There was an error!' })
        }
    }
    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error("Token does not valid!")
                res.status(404).json({ error: error.message })
                return
            }
            res.send('Token is valid, define your new password')
        } catch (error) {
            res.status(500).json({ error: 'There was an error!' })
        }
    }
    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params
            const { password } = req.body
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error("Token does not valid!")
                res.status(404).json({ error: error.message })
                return
            }
            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(password)
            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send('The password was modified correctly!')
        } catch (error) {
            res.status(500).json({ error: 'There was an error!' })
        }
    }
    static user = async (req: Request, res: Response) =>  {res.json(req.user)}
    static updateProfile = async (req: Request, res: Response) =>  {
        const { name, email } = req.body
        req.user.name = name
        req.user.email = email
        const userExists = await User.findOne({email})
        if (userExists && userExists.id.toString() !== req.user.id.toString()) {
            const error = new Error("That email has already taken")
            res.status(409).json({error: error.message})
            return
        }
        try {
            await req.user.save()
            res.send('Profile updated correctly!')
        } catch (error) {
            res.status(500).json({error: "There was an error!"})
        }
    }
    static updateCurrentUserPassword = async (req: Request, res: Response) =>  {
        const { current_password, password } = req.body
        const user = await User.findById(req.user.id)
        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if (!isPasswordCorrect) {
            const error = new Error("The current password is incorrect!")
            res.status(401).json({error: error.message})
            return
        }
        try {
            user.password = await hashPassword(password)
            await user.save()
            res.send("The password has been modified correctly!")
        } catch (error) {
            res.status(500).json({error: "There was an error!"})
        }
    }
    static chackPassword = async (req: Request, res: Response) =>  {
        const { password } = req.body
        const user = await User.findById(req.user.id)
        const isPasswordCorrect = await checkPassword(password, user.password)
        if (!isPasswordCorrect) {
            const error = new Error("The password is incorrect!")
            res.status(401).json({error: error.message})
            return
        }
        res.send("Passoword Correct!")
    }
}