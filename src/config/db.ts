import colors from "colors";
import mongoose from "mongoose"
import { exit } from 'node:process';

export const connectDB = async () => {
    try {
        
        const {connection} = await mongoose.connect(process.env.DATABASE_URL)
        const utl = `${connection.host}:${connection.port}`
        console.log(colors.magenta.bold(`MongoDB connected on: ${utl}`))
        
        
    } catch (error) {
        console.log(colors.red.bold('Error during the connection to MongoDB'))
        exit(1)
    }
}