import { Router } from "express"
import {
  getMyProfile,
  login,
  refreshToken,
  registerAdmin,
  registerUser
} from "../controllers/auth.controler"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { Role } from "../models/user.model"

const router = Router()

// register (only USER) - public
router.post("/register", registerUser)

router.post("/refresh",refreshToken)

// login - public
router.post("/login", login)

// register (ADMIN) - Admin only
router.post(
  "/admin/register",
  authenticate,
  requireRole([Role.ADMIN]),
  registerAdmin
)

// me - Admin or User both
router.get("/me", authenticate, getMyProfile)

// router.get("/test", authenticate, () => {})

export default router
