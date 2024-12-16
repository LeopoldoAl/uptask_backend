import { Request, Response } from "express"
import Task from "../models/Task"

export class TaskController {
    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)
            await Promise.allSettled([task.save(), req.project.save()])
            res.send('Task created correctly!')
        } catch (error) {
            res.status(500).json({ error: 'There was an error!' })

        }
    }
    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({project: req.project.id}).populate('project')
            res.json(tasks)
        } catch (error) {
            res.status(500).json({ error: 'There was an error!' })

        }
    }

        
    static getTaskById = async (req: Request, res: Response) => {
        try {
           if (req.task.project.toString() !== req.project.id) {
                const error = new Error("Action does not valid!")
                res.status(400).json({error: error.message})
                return
            }
            res.json(req.task)
        } catch (error) {
            res.status(500).json({ error: 'There was an error!' })

        }
    }
    static updateTask = async (req: Request, res: Response) => {
        try {
            if (req.task.project.toString() !== req.project.id) {
                const error = new Error("Action does not valid!")
                res.status(400).json({error: error.message})
                return
            }
            req.task.name = req.body.name
            req.task.description = req.body.description
            await req.task.save()
            res.send("Task has been updated correctly!")
        } catch (error) {
            res.status(500).json({ error: 'There was an error!' })

        }
    }
    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter( task => task.toString() !== req.task.id.toString())
            await Promise.allSettled([req.task.deleteOne(), req.project.save()])
            
            res.send("Task has been deleted correctly!")
        } catch (error) {
            res.status(500).json({ error: 'There was an error!' })

        }
    }
    static updateStatus = async (req: Request, res: Response) => {
        try {
            const {status} = req.body
            req.task.status = status
            await req.task.save()
            res.send("Task has been updated correctly!")
        } catch (error) {
            res.status(500).json({ error: 'There was an error!' })
        }
    }
}   