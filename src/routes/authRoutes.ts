import { Router } from "express"
import { AuthController } from "../controllers/AuthController"
import { body } from "express-validator"
import { handleInputErrors } from "../middleware/validation"

const router = Router()
router.post('/create-account',
    body('name')
        .notEmpty().withMessage("The name can not go empty!"),
    body('password')
        .isLength({ min: 8 })
        .withMessage("The password is too short, as at least it should have 8 characters"),
    body('password_confirmation').custom((value, {req}) =>{
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

export default router