import { Router } from "express";
import { authMiddleware } from "../../middleware/authmiddleware";
import { Role } from "../../../generated/prisma/enums";
import { commentsController } from "./comment.controller";

const router = Router()
router.post("/",authMiddleware.auth(Role.USER,Role.ADMIN),commentsController.createComment)

router.get("/",authMiddleware.auth(),commentsController.getAllComments)

router.get("/:commentId",authMiddleware.auth(),commentsController.getCommentById)


router.get("/author/:authorId",authMiddleware.auth(Role.USER,Role.ADMIN,Role.AUTHOR),commentsController.getAuthorCommentById)

router.patch("/:commentId",authMiddleware.auth(Role.USER,Role.ADMIN),commentsController.updateCommentById)

router.patch("/:commentId/moderate",authMiddleware.auth(Role.ADMIN),commentsController.updateModerateComment)

router.delete("/:commentId",authMiddleware.auth(Role.USER,Role.ADMIN),commentsController.deleteComment)
export const commentsRouter = router