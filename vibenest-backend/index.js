import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./config/dbConnection.js";
import { songsRouter } from "./routes/songRoutes.js";
import { userRouter } from "./routes/userRoutes.js";
import { artisteRouter } from "./routes/artisteRoutes.js";
import { playlistRouter } from "./routes/playlistRoutes.js";
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
	origin: ['https://vibenest-1-0zkv.onrender.com', 'http://localhost:5173', 'http://localhost:3000'],
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
	credentials: true
}));

app.use(express.json());

// Налаштування Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use("/api/songs/", songsRouter);
app.use("/api/users/", userRouter);
app.use("/api/artistes/", artisteRouter);
app.use("/api/playlists/", playlistRouter);

const port = process.env.PORT || 5000;

app.listen(port, '0.0.0.0', async () => {
	console.log(`SERVER RUNNING ON PORT ${port}`);
});

cloudinary.api.ping()
	.then(() => console.log('FILE DATABASE CONNECTED Cloudinary'))
	.catch(err => console.error('FILE DATABASE NOT CONNECTED Cloudinary:', err));

connectDb();