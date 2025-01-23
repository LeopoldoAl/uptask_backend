import { Router } from "express"
import { AuthController } from "../controllers/AuthController"
import { body, param } from "express-validator"
import { handleInputErrors } from "../middleware/validation"
import { authenticate } from "../middleware/auth"

const router = Router()
router.post('/create-account',
    body('name')
        .notEmpty().withMessage("The name can not go empty!"),
    body('password')
        .isLength({ min: 8 })
        .withMessage("The password is too short, as at least it should have 8 characters"),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password fields are not equal!")
        }
        return true
    }),
    body('email')
        .isEmail().withMessage("Email doesn't valid!"),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage("The Token can not go empty!"),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email')
        .isEmail().withMessage("Email doesn't valid!"),
    body('password')
        .notEmpty()
        .withMessage("The password can't be empty!"),
    handleInputErrors,
    AuthController.login
)
router.post('/request-code',
    body('email')
        .isEmail().withMessage("Email doesn't valid!"),
    handleInputErrors,
    AuthController.requestConfirmationCode
)
router.post('/forgot-password',
    body('email')
        .isEmail().withMessage("Email doesn't valid!"),
    handleInputErrors,
    AuthController.forgotPassword
)
router.post('/validate-token',
    body('token')
        .notEmpty().withMessage("The Token can not go empty!"),
    handleInputErrors,
    AuthController.validateToken
)
router.post('/update-password/:token',
    param('token')
        .isNumeric().withMessage("Token doesn't valid"),
    body('password')
        .isLength({ min: 8 })
        .withMessage("The password is too short, as at least it should have 8 characters"),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password fields are not equal!")
        }
        return true
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)

router.get('/user', 
    authenticate,
    AuthController.user
)
/** Profile */
router.put('/profile',
    authenticate,
    body('name')
        .notEmpty().withMessage("The name can not go empty!"),
    body('email')
        .isEmail().withMessage("Email doesn't valid!"),
    handleInputErrors,
    AuthController.updateProfile
)
router.post('/update-password',
    authenticate,
    body('current_password')
        .notEmpty().withMessage("The current password can not go empty!"),
    body('password')
        .isLength({ min: 8 })
        .withMessage("The password is too short, as at least it should have 8 characters"),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password fields are not equal!")
        }
        return true
    }),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
)
router.post('/check-password',
    authenticate,
    body('password')
        .notEmpty().withMessage("The password can not go empty!"),
    handleInputErrors,
    AuthController.chackPassword
)
export default router