import express from "express";
import {
	createPlaylist,
	editPlaylist,
	getPlaylist,
	getPlaylists,
	deletePlaylist,
	reorderPlaylistSongs
} from "../controllers/playlistController.js";
import { verifyToken } from "../middleware/validateToken.js";

const router = express.Router();

router.get("/", getPlaylists);
router.get("/:id", getPlaylist);
router.post("/create", verifyToken, createPlaylist);
router.patch("/:id", verifyToken, editPlaylist);
router.delete("/:id", verifyToken, deletePlaylist);
router.patch("/:id/reorder", verifyToken, reorderPlaylistSongs);

export { router as playlistRouter };
