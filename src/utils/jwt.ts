import jwt from 'jsonwebtoken'
export const generateJWT = () => {
    const data = {
        name: 'Juan',
        credit_card: '12130914091',
        password: 'password'
    }
    const token = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: '6m', // 6 moths
    })
    return token
}