import Artiste from "../models/Artiste.js";
import Song from "../models/Song.js";

//@desc Create a new artiste
//@route POST /api/artistes/create
//@access public
const createArtiste = async (req, res) => {
	try {
		const { name, image, bio } = req.body;

		if (!name || !image) {
			return res.status(400).json({ message: "Name and image are required!" });
		}

		const newArtiste = await Artiste.create({
			name,
			image,
			bio,
			type: "Artiste"
		});

		if (!newArtiste) {
			return res.status(400).json({ message: "An error occurred!" });
		}

		res.status(201).json(newArtiste);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

//@desc Get all the artistes
//@route GET /api/artistes/all
//@access public
const getArtistes = async (req, res) => {
	const artistes = await Artiste.find();

	if (!artistes) {
		res.status(400).json({ message: "Artistes not found!" });
	}

	res.status(200).json(artistes);
};

//@desc Get the top artistes
//@route GET /api/artistes/top
//@access public
const getTopArtistes = async (req, res) => {
	try {
		const artistes = await Artiste.find()
			.sort({ createdAt: -1 }) // Сортуємо за датою створення (від найновіших)
			.limit(10); // Обмежуємо до 10 виконавців

		if (!artistes) {
			return res.status(400).json({ message: "Artistes not found!" });
		}

		res.status(200).json(artistes);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

//@desc Get details for an artiste
//@route GET /api/artistes/:id
//@access public
const getArtiste = async (req, res) => {
	const { id } = req.params;

	const artiste = await Artiste.findById(id);
	if (!artiste) {
		return res.status(404).json({ message: "Artiste not found!" });
	}

	// Search for songs using both artistIds and artistes array
	const artisteSongs = await Song.find({
		$or: [
			{ artistIds: id },
			{ artistes: { $elemMatch: { $regex: new RegExp('^' + artiste.name + '$', 'i') } } }
		]
	});

	if (!artisteSongs) {
		return res.status(400).json({ message: "An error occurred!" });
	}

	res.status(200).json({ ...artiste._doc, songs: artisteSongs });
};

//@desc Get artiste by name or ID
//@route GET /api/artistes/name/:nameOrId
//@access public
const getArtisteByName = async (req, res) => {
	try {
		const { name } = req.params;
		console.log("Searching for artiste with name/id:", name);
		
		let artiste;
		let artisteSongs = [];

		// First try to find by ID
		if (name.match(/^[0-9a-fA-F]{24}$/)) {
			artiste = await Artiste.findById(name);
			if (artiste) {
				// Search for songs using both artistIds and artistes array
				artisteSongs = await Song.find({
					$or: [
						{ artistIds: name },
						{ artistes: { $elemMatch: { $regex: new RegExp('^' + artiste.name + '$', 'i') } } }
					]
				});
			}
		}

		// If not found by ID, try to find by name
		if (!artiste) {
			const decodedName = decodeURIComponent(name);
			console.log("Searching by decoded name:", decodedName);
			
			artiste = await Artiste.findOne({ 
				name: { $regex: new RegExp('^' + decodedName + '$', 'i') }
			});

			if (artiste) {
				// Search for songs using both artistIds and artistes array
				artisteSongs = await Song.find({
					$or: [
						{ artistIds: artiste._id },
						{ artistes: { $elemMatch: { $regex: new RegExp('^' + decodedName + '$', 'i') } } }
					]
				});
			}
		}
		
		if (!artiste) {
			console.log("Artiste not found");
			return res.status(404).json({ message: "Artiste not found!" });
		}

		console.log("Found artiste:", artiste);
		console.log("Found songs:", artisteSongs);
		
		res.status(200).json({ ...artiste._doc, songs: artisteSongs || [] });
	} catch (error) {
		console.error("Error in getArtisteByName:", error);
		res.status(500).json({ message: error.message });
	}
};

export { getArtiste, getArtistes, getTopArtistes, createArtiste, getArtisteByName };
