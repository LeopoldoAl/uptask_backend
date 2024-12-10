import mongoose, { Document, Schema } from "mongoose"

export type ProjectType = Document & {
    projectNmae: string
    clientName: string
    description: string
}

const ProjectSchema :  Schema = new Schema({
    projectName: {
        type: String,
        requiree: true,
        trim: true
    },
    clientName: {
        type: String,
        requiree: true,
        trim: true
    },
    description: {
        type: String,
        requiree: true,
        trim: true
    },
})

const Project = mongoose.model<ProjectType>('Project', ProjectSchema)
export default Project