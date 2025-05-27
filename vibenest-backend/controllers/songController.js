import Song from "../models/Song.js";
import User from "../models/User.js";
import { uploadAudio, getCloudinaryUrl } from "../config/cloudinaryConfig.js";

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
		console.log('=== Початок створення пісні ===');
		console.log('Request body:', req.body);
		console.log('Request files:', { audio: req.file, image: req.file });
		
		const { title, duration, artistes } = req.body;
		
		// Перевірка наявності аудіо файлу
		if (!req.file) {
			console.log('Помилка: Аудіо файл відсутній');
			return res.status(400).json({ message: "Аудіо файл обов'язковий" });
		}

		// Перевірка обов'язкових полів
		if (!title || !duration || !artistes) {
			console.log('Помилка: Відсутні обов\'язкові поля', { title, duration, artistes });
			return res.status(400).json({ message: "Всі поля обов'язкові" });
		}

		// Отримуємо URL з Cloudinary
		console.log('Отримання URL з Cloudinary');
		const songUrl = getCloudinaryUrl(req.file);
		console.log('URL пісні:', songUrl);

		if (!songUrl) {
			console.log('Помилка: Не вдалося отримати URL пісні з Cloudinary');
			return res.status(500).json({ message: "Помилка при завантаженні файлу" });
		}

		let artistesArray;
		try {
			console.log('Обробка виконавців:', artistes);
			if (typeof artistes === 'string') {
				artistesArray = artistes.split(',').map(a => a.trim());
			} else if (Array.isArray(artistes)) {
				artistesArray = artistes;
			} else {
				artistesArray = [artistes];
			}
			console.log('Оброблені виконавці:', artistesArray);
		} catch (error) {
			console.log('Помилка обробки виконавців, використовуємо як єдиний рядок');
			artistesArray = [artistes];
		}

		// Визначаємо URL обкладинки
		let coverImageUrl = req.body.coverImage;
		if (!coverImageUrl) {
			coverImageUrl = "https://firebasestorage.googleapis.com/v0/b/socialstream-ba300.appspot.com/o/music_app_files%2Fplaylist_cover.jpg?alt=media&token=546adcad-e9c3-402f-8a57-b7ba252100ec";
		}

		console.log('Створення нової пісні з даними:', {
			title: title.trim(),
			duration: duration.trim(),
			coverImage: coverImageUrl,
			artistes: artistesArray,
			songUrl
		});

		const newSong = new Song({
			title: title.trim(),
			duration: duration.trim(),
			coverImage: coverImageUrl,
			artistes: artistesArray,
			songUrl,
			type: "Song",
			likes: new Map()
		});

		console.log('Збереження пісні в базу даних');
		const savedSong = await newSong.save();
		console.log('Пісню збережено:', savedSong);
		
		res.status(201).json(savedSong);
	} catch (error) {
		console.error('Помилка при створенні пісні:', error);
		console.error('Stack trace:', error.stack);
		
		// Визначаємо тип помилки
		if (error.name === 'ValidationError') {
			return res.status(400).json({ 
				message: "Помилка валідації даних",
				details: error.message 
			});
		}
		
		if (error.name === 'MulterError') {
			return res.status(400).json({ 
				message: "Помилка завантаження файлу",
				details: error.message 
			});
		}
		
		res.status(500).json({ 
			message: "Внутрішня помилка сервера",
			details: error.message 
		});
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
