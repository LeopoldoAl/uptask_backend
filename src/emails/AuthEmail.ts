import { transport } from "../config/nodemailer"
import dotenv from 'dotenv'
dotenv.config()
interface IEmail {
    email: string,
    name: string,
    token: string
}
export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        const info = await transport.sendMail({
            from: `UpTask <${process.env.EMAIL_ADMIN}>`,
            to: user.email,
            subject: 'UpTask - Confirm your account',
            text: 'UpTask - Confirm your account',
            html: `<p>Hello ${user.name}, has created your account in UpTask, are all almost ready, you should only confirm your account</p>
            <p>Visit the following link</p>
            <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirm account</a>
            <p>Ingress the code: <b>${user.token}</b></p>
            <p>This token will expire in 10 minutes</p>
            `
        })
        console.log('Message sent',info.messageId)
    }
    static sendPasswordResetToken = async (user: IEmail) => {
        const info = await transport.sendMail({
            from: `UpTask <${process.env.EMAIL_ADMIN}>`,
            to: user.email,
            subject: 'UpTask - Restore your password',
            text: 'UpTask - Restore your password',
            html: `<p>Hello ${user.name}, has requested to restore your password.</p>
            <p>Visit the following link</p>
            <a href="${process.env.FRONTEND_URL}/auth/new-password">Restore Password</a>
            <p>Ingress the code: <b>${user.token}</b></p>
            <p>This token will expire in 10 minutes</p>
            `
        })
        console.log('Message sent',info.messageId)
    }
}