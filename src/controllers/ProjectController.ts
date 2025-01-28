import { Request, Response } from "express"
import Project from "../models/Project"
export class ProjectController {
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)
        // We assing a manager to the project
        project.manager = req.user.id
        try {
            await project.save()
            res.send('Project has been created successfully!')
        } catch (error) {
            console.log(error)
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    {manager: {$in: req.user.id}},
                    {team: {$in: req.user.id}}
                ]
            })
            res.json(projects)
        } catch (error) {
            console.log(error)
        }
    }
    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id).populate('tasks')
            if (!project) {
                const error = new Error("Project did not find!")
                res.status(404).json({
                    error: error.message
                })
                return
            }
            if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error("Action doesn't valid!")
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
        try {
            req.project.clientName = req.body.clientName
            req.project.projectName = req.body.projectName
            req.project.description = req.body.description
            await req.project.save()
            res.send('Project has been updated correctly!')
        } catch (error) {
            console.log(error)
        }
    }
    static deleteProject = async (req: Request, res: Response) => {
        try {
            await req.project.deleteOne()
            res.send('Project has been deleted correctly!')
        } catch (error) {
            console.log(error)
        }
    }


}