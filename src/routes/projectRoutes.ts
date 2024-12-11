import { Router } from "express"
import { ProjectController } from "../controllers/ProjectController"
import { body } from "express-validator"
import { handleInputErrors } from "../middleware/validation"

const router = Router()

router.post('/', 
    body("projectName")
        .notEmpty().withMessage("The project name is obligatory!"),
    body("clientName")
        .notEmpty().withMessage("The client name is obligatory!"),
    body("description")
        .notEmpty().withMessage("The description is obligatory!"),
    // Here it goes the middleware
    handleInputErrors,
    ProjectController.createProject
)
router.get('/', ProjectController.getAllProjects)

export default router