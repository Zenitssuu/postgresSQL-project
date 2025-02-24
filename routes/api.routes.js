import express from "express";
import Authcontroller from "../controllers/Auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import ProfileController from "../controllers/Profile.controller.js";
import { upload } from "../middleware/multer.js";
import NewsController from "../controllers/News.controller.js";
// import redisCache from "../config/redis.config.js";
const router = express.Router();

router.post("/auth/register", Authcontroller.register);
router.post("/auth/login", Authcontroller.login);
router.post("/send-email", Authcontroller.sendEmailToUser);

// profile
router.get("/profile", authMiddleware, ProfileController.index);
router.get("/profile/:id", ProfileController.getProfile); //to get profile of different users
router.post(
  "/profile",
  authMiddleware,
  upload.single("profileImage"),
  ProfileController.updateProfile
); // for updating profile

//news
// router.get("/news", redisCache.route(),NewsController.index);
router.get("/news",NewsController.index);

router.get("/news/:id", NewsController.show);
router.post("/news", authMiddleware,upload.single("newsImage"),NewsController.store);
router.put("/news/:id", authMiddleware,upload.single("newsImage"),NewsController.update);
router.delete("/news/:id", authMiddleware, NewsController.destroy);

export default router;
