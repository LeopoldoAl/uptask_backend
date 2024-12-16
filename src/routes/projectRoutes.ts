import { Router } from "express"
import { body, param } from "express-validator"
import { ProjectController } from "../controllers/ProjectController"
import { TaskController } from "../controllers/TaskController"
import { handleInputErrors } from "../middleware/validation"
import { projecExists } from "../middleware/project"
import { taskExists } from "../middleware/task"

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
router.param('projectId', projecExists)

router.post('/:projectId/tasks', 
    body("name")
        .notEmpty().withMessage("The name is obligatory!"),
    body("description")
        .notEmpty().withMessage("The description is obligatory!"),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks', 
    TaskController.getProjectTasks
)

router.param('taskId', taskExists)

router.get('/:projectId/tasks/:taskId', 
    param('taskId').isMongoId().withMessage("Id does not valid!"),
    handleInputErrors,
    TaskController.getTaskById
)
router.put('/:projectId/tasks/:taskId', 
    param('taskId').isMongoId().withMessage("Id does not valid!"),
    body("name")
        .notEmpty().withMessage("The name is obligatory!"),
    body("description")
        .notEmpty().withMessage("The description is obligatory!"),
    handleInputErrors,
    TaskController.updateTask
)
router.delete('/:projectId/tasks/:taskId', 
    param('taskId').isMongoId().withMessage("Id does not valid!"),
    handleInputErrors,
    TaskController.deleteTask
)

router.post("/:projectId/tasks/:taskId/status",
    param('taskId').isMongoId().withMessage("Id does not valid!"),
    body('status')
        .notEmpty().withMessage('the status is obligatory!'),
    handleInputErrors,
    TaskController.updateStatus
)
export default router