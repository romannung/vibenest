import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./config/dbConnection.js";
import { songsRouter } from "./routes/songRoutes.js";
import { userRouter } from "./routes/userRoutes.js";
import { artisteRouter } from "./routes/artisteRoutes.js";
import { playlistRouter } from "./routes/playlistRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
	origin: ['https://vibenest-1-0zkv.onrender.com', 'http://localhost:5000', 'http://localhost:5173'],
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
	credentials: true
}));

app.use(express.json());

// Serve static files from uploads directory with CORS
app.use('/uploads', (req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
}, express.static(path.join(__dirname, 'uploads')));

connectDb();

app.use("/api/songs/", songsRouter);
app.use("/api/users/", userRouter);
app.use("/api/artistes/", artisteRouter);
app.use("/api/playlists/", playlistRouter);

const port = process.env.PORT || 5000;

app.listen(port, async () => {
	console.log(`SERVER RUNNING ON PORT ${port}`);
});
