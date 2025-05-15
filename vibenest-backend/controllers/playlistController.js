import Playlist from "../models/Playlist.js";
import Song from "../models/Song.js";
import User from "../models/User.js";

//@desc Get all the playlists
//@route GET /api/playlists
//@access public
const getPlaylists = async (req, res) => {
	const playlists = await Playlist.find({});

	if (!playlists) {
		return res.status(400).json({ message: "An error occured" });
	}

	res.status(200).json(playlists);
};

//@desc Create a playlist
//@route POST /api/playlists/create
//@access private
const createPlaylist = async (req, res) => {
	const { id, username } = req.user;
	const { title, description, isPrivate, songIds } = req.body;
	const user = await User.findById(id);

	if (!title || !songIds) {
		return res.status(400).json({ message: "All fields are required!" });
	}

	if (!user) {
		return res.status(404).json({ message: "User not found!" });
	}

	await Promise.all(
		songIds.map(async (id) => {
			const songExists = await Song.findById(id);
			if (!songExists) {
				return res.status(404).json({ message: "Song not found" });
			}
		})
	);

	const newPlaylist = await Playlist.create({
		title,
		description,
		userId: id,
		userName: username,
		songs: songIds,
		isPrivate,
	});

	if (!newPlaylist) {
		return res.status(400).json({ message: "An error occured!" });
	}

	user.playlists.push(newPlaylist.id);
	await user.save();

	res.status(201).json(newPlaylist);
};

//@desc Get a playlists' details
//@route GET /api/playlists/:id
//@access public
const getPlaylist = async (req, res) => {
	try {
		const { id } = req.params;

		const playlist = await Playlist.findById(id);

		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found!" });
		}

		let songs = [];

		await Promise.all(
			playlist.songs.map(async (songId) => {
				const playlistSong = await Song.findById(songId);
				if (!playlistSong) {
					return res.status(404).json({ message: "Song not found" });
				} else {
					songs.push(playlistSong);
				}
			})
		);

		res.status(200).json({ ...playlist.toObject(), songs });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

//@desc Add or remove a song from a playlist
//@route PATCH /api/playlists/:id
//@access private
const editPlaylist = async (req, res) => {
	const { id } = req.params;
	const userId = req.user.id;
	const { title, description, songIds } = req.body;
	const playlist = await Playlist.findById(id);

	if (!title || !songIds) {
		return res.status(400).json({ message: "All fields are required!" });
	}

	if (!playlist) {
		return res.status(400).json({ message: "Playlist not found!" });
	}

	if (playlist.userId !== userId) {
		return res
			.status(403)
			.json({ message: "You are not allowed to edit other users' playlists!" });
	}

	await Promise.all(
		songIds.map(async (id) => {
			const songExists = await Song.findById(id);
			if (!songExists) {
				return res.status(404).json({ message: "Song not found" });
			}
		})
	);

	const updatedPlaylist = await Playlist.findByIdAndUpdate(
		id,
		{ title, description, songs: songIds },
		{
			new: true,
		}
	);

	if (!updatedPlaylist) {
		return res.status(400).json({ message: "Playlist not updated!" });
	}
	res.status(200).json(updatedPlaylist);
};

//@desc Delete a playlist
//@route DELETE /api/playlists/:id
//@access private
const deletePlaylist = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;

		// Знаходимо плейліст
		const playlist = await Playlist.findById(id);
		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found!" });
		}

		// Перевіряємо чи користувач є власником плейлісту
		if (playlist.userId.toString() !== userId) {
			return res.status(403).json({ message: "Not authorized to delete this playlist!" });
		}

		// Видаляємо плейліст з бази даних
		await Playlist.findByIdAndDelete(id);

		// Видаляємо ID плейлісту зі списку плейлістів користувача
		const user = await User.findById(userId);
		user.playlists = user.playlists.filter(playlistId => playlistId.toString() !== id);
		await user.save();

		res.status(200).json({ message: "Playlist deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

//@desc Update playlist songs order
//@route PATCH /api/playlists/:id/reorder
//@access private
const reorderPlaylistSongs = async (req, res) => {
	try {
		const { id } = req.params;
		const { fromIndex, toIndex } = req.body;
		const userId = req.user.id;

		// Знаходимо плейліст
		const playlist = await Playlist.findById(id);
		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found!" });
		}

		// Перевіряємо чи користувач є власником плейлісту
		if (playlist.userId.toString() !== userId) {
			return res.status(403).json({ message: "Not authorized to modify this playlist!" });
		}

		// Перевіряємо валідність індексів
		if (fromIndex < 0 || fromIndex >= playlist.songs.length || 
			toIndex < 0 || toIndex >= playlist.songs.length) {
			return res.status(400).json({ message: "Invalid index values!" });
		}

		// Переміщуємо пісню
		const [removedSong] = playlist.songs.splice(fromIndex, 1);
		playlist.songs.splice(toIndex, 0, removedSong);

		// Зберігаємо оновлений плейліст
		const updatedPlaylist = await playlist.save();

		// Отримуємо повну інформацію про пісні
		let songs = [];
		await Promise.all(
			updatedPlaylist.songs.map(async (songId) => {
				const playlistSong = await Song.findById(songId);
				if (playlistSong) {
					songs.push(playlistSong);
				}
			})
		);

		res.status(200).json({ ...updatedPlaylist.toObject(), songs });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const reorderSongs = async (req, res) => {
	try {
		const { playlistId } = req.params;
		const { songId, direction } = req.body;
		
		const playlist = await Playlist.findById(playlistId);
		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found" });
		}

		const currentIndex = playlist.songs.indexOf(songId);
		if (currentIndex === -1) {
			return res.status(404).json({ message: "Song not found in playlist" });
		}

		let newIndex;
		if (direction === "up" && currentIndex > 0) {
			newIndex = currentIndex - 1;
		} else if (direction === "down" && currentIndex < playlist.songs.length - 1) {
			newIndex = currentIndex + 1;
		} else {
			return res.status(400).json({ message: "Invalid move direction" });
		}

		// Remove song from current position and insert at new position
		const [song] = playlist.songs.splice(currentIndex, 1);
		playlist.songs.splice(newIndex, 0, song);

		await playlist.save();
		res.json(playlist);
	} catch (error) {
		console.error("Error reordering songs:", error);
		res.status(500).json({ message: "Error reordering songs" });
	}
};

export { getPlaylists, createPlaylist, getPlaylist, editPlaylist, deletePlaylist, reorderPlaylistSongs, reorderSongs };
