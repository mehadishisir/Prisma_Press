import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();


router.post("/login", authController.logInController);
router.post("/refresh-token", authController.refreshTokenController);

export const authRouter = router;