import { Box, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { client } from "../api";
import ArtisteSong from "../components/ArtisteSong";
import { playTrack, setTrackList } from "../redux/slices/playerSlice";
import { AiOutlineLoading } from "react-icons/ai";

const FavoritesPage = () => {
	const [favorites, setFavorites] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const { user, token } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const fetchFavorites = async () => {
		setLoading(true);
		setError(false);
		try {
			const response = await client.get("/users/favorites", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			// Фільтруємо null значення
			const validFavorites = response.data.filter(song => song !== null);
			setFavorites(validFavorites);
		} catch (error) {
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		token && fetchFavorites();
	}, [token]);

	const onPlay = (song) => {
		if (!song) return;
		const index = favorites?.findIndex((s) => s?._id === song._id);
		if (index === -1) return;

		dispatch(setTrackList({ list: favorites, index }));
		dispatch(playTrack(song));
	};

	const handleDelete = async (songId) => {
		try {
			await client.delete(`/songs/${songId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			// Оновлюємо список улюблених пісень
			await fetchFavorites();
		} catch (error) {
			console.error("Помилка при видаленні пісні:", error);
		}
	};

	if (!user) {
		return (
			<Flex align="center" justify="center" h="100vh">
				<Flex direction="column" align="center" gap={4}>
					<Text textAlign="center" color="zinc.500">
						Будь ласка, увійдіть щоб побачити ваші улюблені
					</Text>
					<Link to="/auth/login">
						<Button variant="unstyled" bg="accent.main" px={6}>
							Увійти
						</Button>
					</Link>
				</Flex>
			</Flex>
		);
	}

	return (
		<Box
			p={4}
			pb={32}
			minH="100vh"
			pt={{ base: 20, md: 6 }}
			pl={{ base: 4, md: 14, xl: 0 }}>
			<Box mb={6}>
				<Heading
					fontSize={{ base: "lg", md: "2xl" }}
					fontWeight="semibold"
					mb={1}>
					Улюблені
				</Heading>
				<Text fontSize="sm" color="zinc.400">
					Ваші улюблені пісні
				</Text>
			</Box>
			<Divider h="1px" border={0} bg="gray.500" />
			{loading && favorites.length < 1 && (
				<Flex align="center" justify="center" color="accent.main" minH="20rem">
					<AiOutlineLoading className="spin" size={36} />
				</Flex>
			)}
			{error && (
				<Text color="zinc.300" my={2}>
					Вибачте, сталася помилка
				</Text>
			)}
			<Flex direction="column" gap={4} mt={4}>
				{favorites?.filter(song => song !== null).map((song) => (
					<ArtisteSong 
						key={song._id} 
						song={song} 
						handlePlay={onPlay}
						onDelete={handleDelete}
					/>
				))}
			</Flex>
			{!loading && !error && favorites.length < 1 && (
				<Text>{"Ви ще не додали жодної пісні до улюблених..."}</Text>
			)}
		</Box>
	);
};

export default FavoritesPage;
