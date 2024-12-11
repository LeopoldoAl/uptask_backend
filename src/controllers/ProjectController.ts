import { Request, Response } from "express"
import Project from "../models/Project"
import { populate } from "dotenv"
export class ProjectController {
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)

        try {
            await project.save()
            res.send('Project has been created successfully!')
        } catch (error) {
            console.log(error)
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find()
            res.json(projects)
        } catch (error) {
            console.log(error)
        }
    }
    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id)
            if (!project) {
                const error = new Error("Project did not find!")
                res.status(404).json({
                    error: error.message
                })
                return
            }
            res.json(project)
        } catch (error) {
            console.log(error)
        }
    }

    static updateProduct = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findByIdAndUpdate(id, req.body)

            if (!project) {
                const error = new Error("Project did not find!")
                res.status(404).json({
                    error: error.message
                })
                return
            }
            await project.save()
            res.send('Project has been updated correctly!')
        } catch (error) {
            console.log(error)
        }
    }
    static deleteProject = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id)
            if (!project) {
                const error = new Error("Project did not find!")
                res.status(404).json({
                    error: error.message
                })
                return
            }
            await project.deleteOne()
            res.send('Project has been deleted correctly!')
        } catch (error) {
            console.log(error)
        }
    }


}