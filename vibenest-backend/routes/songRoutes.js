import express from "express";
import {
	getAroundYou,
	getNewReleases,
	getRandom,
	getSongs,
	getTopSongs,
	likeSong,
	createSong,
	getSongById
} from "../controllers/songController.js";
import { verifyToken } from "../middleware/validateToken.js";
import { uploadAudio } from "../config/cloudinaryConfig.js";

const router = express.Router();

router.get("/", getSongs);
router.get("/top", getTopSongs);
router.get("/releases", getNewReleases);
router.get("/random", getRandom);
router.get("/around-you", getAroundYou);
router.get("/:id", getSongById);
router.patch("/like/:id", verifyToken, likeSong);
router.post("/create", uploadAudio.single('file'), createSong);

export { router as songsRouter };
