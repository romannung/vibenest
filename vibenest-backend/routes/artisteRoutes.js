import express from "express";
import {
	getArtiste,
	getArtistes,
	getTopArtistes,
	createArtiste,
	getArtisteByName
} from "../controllers/artistController.js";

const router = express.Router();

router.post("/create", createArtiste);
router.get("/all", getArtistes);
router.get("/top", getTopArtistes);
router.get("/name/:name", getArtisteByName);
router.get("/:id", getArtiste);

export { router as artisteRouter };
