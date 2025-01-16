import { Request, Response } from "express"
import User from "../models/User"

export class TeamMemberContoller {
    static findMemberByEmail = async (req:Request, res: Response) => {
        const { email } = req.body
        // Finding user
        const user = await  User.findOne({email}).select("id email name")
        if (!user) {
            const error = new Error("User did not find!")
            res.status(404).json({error: error.message})
            return
        }
        res.json(user)
    }
}