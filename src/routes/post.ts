
import { Router } from "express"
import { createPost, getAllPosts,getMyPost } from "../controllers/post.controller";
import { authenticate } from "../middleware/auth";
import { Role } from "../models/user.model";
import { requireRole } from "../middleware/role";
import { upload } from "../middleware/upload";
       

const router = Router();



// Create a new post (protected)
router.post("/create", authenticate,
     requireRole([Role.AUTHOR]), 
     upload.single("image"),
     createPost);

// Get all posts (public)
router.get("/", getAllPosts);

// Get posts by logged-in user (protected)
router.get("/me", authenticate, requireRole([Role.AUTHOR]), getMyPost);

export default router;