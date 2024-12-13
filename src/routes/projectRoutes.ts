import { Router } from "express"
import { body, param } from "express-validator"
import { ProjectController } from "../controllers/ProjectController"
import { TaskController } from "../controllers/TaskController"
import { handleInputErrors } from "../middleware/validation"
import { validateProjecExists } from "../middleware/project"

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

router.get('/:id',
    param('id').isMongoId().withMessage("Id does not valid!"),
    handleInputErrors,
    ProjectController.getProjectById
)

router.put('/:id',
    param('id').isMongoId().withMessage("Id does not valid!"),
    body("projectName")
        .notEmpty().withMessage("The project name is obligatory!"),
    body("clientName")
        .notEmpty().withMessage("The client name is obligatory!"),
    body("description")
        .notEmpty().withMessage("The description is obligatory!"),
    handleInputErrors,
    ProjectController.updateProduct
)

router.delete('/:id',
    param('id').isMongoId().withMessage("Id does not valid!"),
    handleInputErrors,
    ProjectController.deleteProject
)

// Routes to Tasks
router.post('/:projectId/tasks', 
    validateProjecExists,
    body("name")
        .notEmpty().withMessage("The name is obligatory!"),
    body("description")
        .notEmpty().withMessage("The description is obligatory!"),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks', 
    validateProjecExists,
    TaskController.getProjectTasks
)

router.get('/:projectId/tasks/:taskId', 
    validateProjecExists,
    TaskController.getTaskById
)

export default router