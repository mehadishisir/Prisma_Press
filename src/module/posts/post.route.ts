import { Router } from "express";
import { authMiddleware } from "../../middleware/authmiddleware";
import { Role } from "../../../generated/prisma/enums";
import { postController } from "./post.controller";
import { authController } from "../auth/auth.controller";

const router =  Router()

router.post("/",authMiddleware.auth(Role.USER , Role.ADMIN), postController.createPost)
router.get("/",authMiddleware.auth(Role.USER,Role.ADMIN,Role.AUTHOR),postController.getAllPosts)
router.get("/my-posts",authMiddleware.auth(Role.USER,Role.ADMIN),postController.getMyposts)
router.get("/:postId",authMiddleware.auth(Role.USER,Role.ADMIN,Role.AUTHOR),postController.getPostById)
router.get("/status",authMiddleware.auth(Role.ADMIN),postController.getPostStatus)
router.patch("/:postId",authMiddleware.auth(Role.USER,Role.ADMIN),postController.updatePost)
router.delete("/:postId",authMiddleware.auth(Role.ADMIN,Role.USER),postController.deletePost)


export const postRoutes = router