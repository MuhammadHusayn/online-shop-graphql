import jwt from 'jsonwebtoken'
import { TOKEN_TIME } from '#config'

export default {
    sign: (payload) => jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: TOKEN_TIME }),
    verify: (token) => jwt.verify(token, process.env.JWT_SECRET_KEY)
}