import { NextFunction, Request, Response } from "express"
import Task, { ITask } from "../models/Task"

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export async function taskExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { taskId } = req.params
        const task = await Task.findById(taskId)
        if (!task) {
            const error = new Error("Task did not find!")
            res.status(404).json({
                error: error.message
            })
            return
        }
        req.task = task
        next()
    } catch (error) {
        res.status(500).json({ error: 'There was an error!' })
    }
}

export async function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {
    if (req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error("Action does not valid!")
        res.status(400).json({error: error.message})
        return
    }
    next()
}