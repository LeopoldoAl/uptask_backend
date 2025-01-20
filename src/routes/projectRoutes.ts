import { Router } from "express"
import { body, param } from "express-validator"
import { ProjectController } from "../controllers/ProjectController"
import { TaskController } from "../controllers/TaskController"
import { handleInputErrors } from "../middleware/validation"
import { projecExists } from "../middleware/project"
import { hasAuthorization, taskBelongsToProject, taskExists } from "../middleware/task"
import { authenticate } from "../middleware/auth"
import { TeamMemberContoller } from "../controllers/TeamController"
import { NoteController } from "../controllers/NoteController"

const router = Router()

router.use(authenticate)
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
    hasAuthorization,
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
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId', 
    param('taskId').isMongoId().withMessage("Id does not valid!"),
    handleInputErrors,
    TaskController.getTaskById
)
router.put('/:projectId/tasks/:taskId', 
    hasAuthorization,
    param('taskId').isMongoId().withMessage("Id does not valid!"),
    body("name")
        .notEmpty().withMessage("The name is obligatory!"),
    body("description")
        .notEmpty().withMessage("The description is obligatory!"),
    handleInputErrors,
    TaskController.updateTask
)
router.delete('/:projectId/tasks/:taskId', 
    hasAuthorization,
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
/** Routes for teams */
router.post('/:projectId/team/find',
    body('email')
    .isEmail().toLowerCase().withMessage("Email does not valid!"),
    handleInputErrors,
    TeamMemberContoller.findMemberByEmail
)
router.get('/:projectId/team',
    TeamMemberContoller.getProjectTeam
)
router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage("ID doesn't valid!"),
        handleInputErrors,
        TeamMemberContoller.addMemberById
)
router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage("ID doesn't valid!"),
        handleInputErrors,
        TeamMemberContoller.removeMemberById
)
/** Routes for Notes */
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('The note content is obligatory!'),
    handleInputErrors,
    NoteController.createNote
)
export default router