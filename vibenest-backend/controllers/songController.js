import Song from "../models/Song.js";
import User from "../models/User.js";

//@desc Get all the songs
//@route GET /api/songs
//@access public
const getSongs = async (req, res) => {
	const songs = await Song.find({});

	if (!songs) {
		return res.status(400).json({ message: "An error occured!" });
	}
	const shuffledSongs = songs.sort(() => (Math.random() > 0.5 ? 1 : -1));

	res.status(200).json(shuffledSongs);
};

//@desc Get the top songs
//@route GET /api/songs/top
//@access public
const getTopSongs = async (req, res) => {
	try {
		const results = await Song.aggregate([
			{
				$project: {
					title: 1,
					duration: 1,
					coverImage: 1,
					artistes: 1,
					songUrl: 1,
					artistIds: 1,
					type: 1,
					likes: {
						$size: {
							$objectToArray: "$likes",
						},
					},
				},
			},
			{ $sort: { likes: -1 } },
			{ $limit: 8 },
		]);
		res.status(200).json(results);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

//@desc Get the new releases
//@route GET /api/songs/releases
//@access public
const getNewReleases = async (req, res) => {
	try {
		const songs = await Song.find({})
			.sort({ createdAt: -1 }) // Сортуємо за датою створення (від найновіших)
			.limit(10); // Обмежуємо до 10 пісень

		if (!songs) {
			return res.status(400).json({ message: "An error occurred!" });
		}

		res.status(200).json(songs);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

//@desc Get random songs
//@route GET /api/songs/random
//@access public
const getRandom = async (req, res) => {
	const songs = await Song.find({});

	const shuffledSongs = songs.sort(() => (Math.random() > 0.5 ? 1 : -1));
	const result = shuffledSongs.slice(-11, -1);

	res.status(200).json(result);
};

//@desc Get the popular songs around you
//@route GET /api/songs/popular
//@access public
const getAroundYou = async (req, res) => {
	const songs = await Song.find({});

	const result = songs.slice(0, 11);
	const shuffledSongs = result.sort(() => (Math.random() > 0.5 ? 1 : -1));

	res.status(200).json(shuffledSongs);
};

//@desc Like or unlike a song
//@route PATCH /api/songs/like/:id
//@access private
const likeSong = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;
		const song = await Song.findById(id);
		const user = await User.findById(userId);

		if (!user) {
			return res.json(404).json({ message: "User not found!" });
		}
		if (!song) {
			return res.json(404).json({ message: "Song not found!" });
		}

		const isLiked = song.likes.get(userId);

		if (isLiked) {
			song.likes.delete(userId);
			user.favorites = user.favorites.filter((songId) => songId !== id);
		} else {
			song.likes.set(userId, true);
			user.favorites.push(id);
		}

		const savedSong = await song.save();
		const savedUser = await user.save();

		if (!savedSong || !savedUser) {
			return res.status(400).json({ message: "An error occured" });
		}

		const returnUser = {
			id: savedUser.id,
			username: savedUser.username,
			favorites: savedUser.favorites,
			playlists: savedUser.playlists,
		};

		res.status(200).json(returnUser);
	} catch (error) {
		return res.status(409).json({ message: error.message });
	}
};

const createSong = async (req, res) => {
	try {
		console.log('Request body:', req.body);
		console.log('Request files:', req.files);
		
		const { title, duration, artistes } = req.body;
		
		// Перевірка наявності файлу
		if (!req.files || !req.files.file || req.files.file.length === 0) {
			return res.status(400).json({ message: "Аудіо файл обов'язковий" });
		}

		// Перевірка обов'язкових полів
		if (!title || !duration || !artistes) {
			return res.status(400).json({ message: "Всі поля обов'язкові" });
		}

		const audioFile = req.files.file[0];
		const imageFile = req.files.image && req.files.image.length > 0 ? req.files.image[0] : null;

		// Створюємо URL для файлів з повним шляхом до бекенду
		const songUrl = `http://localhost:5000/uploads/audio/${audioFile.filename}`;
		const coverImage = imageFile 
			? `http://localhost:5000/uploads/images/${imageFile.filename}`
			: "https://firebasestorage.googleapis.com/v0/b/socialstream-ba300.appspot.com/o/music_app_files%2Fplaylist_cover.jpg?alt=media&token=546adcad-e9c3-402f-8a57-b7ba252100ec";

		let artistesArray;
		try {
			artistesArray = JSON.parse(artistes);
			if (!Array.isArray(artistesArray)) {
				artistesArray = [artistes];
			}
		} catch (error) {
			// Якщо не вдалося розпарсити JSON, припускаємо що це один виконавець
			artistesArray = [artistes];
		}

		const newSong = new Song({
			title: title.trim(),
			duration: duration.trim(),
			coverImage,
			artistes: artistesArray,
			songUrl,
			type: "Song",
			likes: new Map()
		});

		const savedSong = await newSong.save();
		console.log('Song saved:', savedSong);
		res.status(201).json(savedSong);
	} catch (error) {
		console.error('Error creating song:', error);
		res.status(500).json({ message: error.message });
	}
};

//@desc Get a song by ID
//@route GET /api/songs/:id
//@access public
const getSongById = async (req, res) => {
	try {
		const { id } = req.params;
		const song = await Song.findById(id);
		
		if (!song) {
			return res.status(404).json({ message: "Song not found!" });
		}
		
		res.status(200).json(song);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export {
	getSongs,
	getTopSongs,
	getNewReleases,
	getRandom,
	getAroundYou,
	likeSong,
	createSong,
	getSongById
};
