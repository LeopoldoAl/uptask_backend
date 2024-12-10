import { Document, Schema } from "mongoose";

export type ProjectType = Document & {
    projectNmae: string
    clientName: string
    description: string
}

const ProjectSchema :  Schema = new Schema({
    projectName: {
        type: String,
        requiree: true,
        trim: true,
        unique: true
    }
})