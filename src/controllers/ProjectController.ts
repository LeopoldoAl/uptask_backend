import { Request, Response } from "express"
import Project from "../models/Project"
export class ProjectController {
    static createProject = async (req: Request, res: Response) => {
        try {
            await Project.create(req.body)
            res.send('Project has been created successfully!')   
        } catch (error) {
            console.log(error)
        }    
    }
    
    static getAllProjects = async (req: Request, res: Response) => {
        res.send('All of the projects')       
    }
}