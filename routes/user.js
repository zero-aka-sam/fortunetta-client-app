import express from "express";
const router = express.Router();

import { signin, updateProfile } from "../controllers/user.js";

router.post("/signin", signin);
router.patch("/updateProfile/:id", updateProfile);

export default router;
