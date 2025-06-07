import express from "express";
import {
	getAroundYou,
	getNewReleases,
	getRandom,
	getSongs,
	getTopSongs,
	likeSong,
	createSong,
	getSongById,
	deleteSong
} from "../controllers/songController.js";
import { verifyToken } from "../middleware/validateToken.js";
import { upload } from "../config/multerConfig.js";

const router = express.Router();

router.get("/", getSongs);
router.get("/top", getTopSongs);
router.get("/releases", getNewReleases);
router.get("/random", getRandom);
router.get("/popular", getAroundYou);
router.get("/:id", getSongById);
router.patch("/like/:id", verifyToken, likeSong);
router.post("/create", upload.fields([
	{ name: 'file', maxCount: 1 },
	{ name: 'image', maxCount: 1 }
]), createSong);
router.delete("/:id", verifyToken, deleteSong);

export { router as songsRouter };
