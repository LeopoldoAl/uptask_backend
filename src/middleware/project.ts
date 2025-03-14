import { NextFunction, Request, Response } from "express"
import Project, { IProject } from "../models/Project"

declare global {
    namespace Express {
        interface Request {
            project: IProject
        }
    }
}

export async function projecExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { projectId } = req.params
        const project = await Project.findById(projectId)
        if (!project) {
            const error = new Error("Project did not find!")
            res.status(404).json({
                error: error.message
            })
            return
        }
        req.project = project
        next()
    } catch (error) {
        res.status(500).json({ error: 'There was an error!' })
        console.log(error)

    }
}