import { CorsOptions } from "cors"

export const corsConfig: CorsOptions = {
    origin: function(origin, callback) {
        console.log(origin)
        const whitelist = [process.env.FRONTEND_URL]
        if (whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('CORS error!'))
        }
    }
}