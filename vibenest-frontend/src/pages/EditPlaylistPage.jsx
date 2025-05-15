import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Box,
	Button,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	SimpleGrid,
	Spinner,
	Text,
	useToast,
} from "@chakra-ui/react";
import { client } from "../api";
import PlaylistSong from "../components/PlaylistSong";
import { useSelector } from "react-redux";
import { AiOutlineLoading } from "react-icons/ai";

const EditPlaylistPage = () => {
	const [fetchPlaylistStatus, setFetchPlaylistStatus] = useState({
		loading: false,
		error: false,
	});
	const [otherSongs, setOtherSongs] = useState({
		loading: false,
		error: false,
		data: [],
	});
	const [editLoading, setEditLoading] = useState(false);
	const [playlistSongs, setPlaylistSongs] = useState([]);
	const [inputs, setInputs] = useState({
		playlistName: "",
		playlistDesc: "",
	});

	const { token } = useSelector((state) => state.user);

	const { id } = useParams();
	const navigate = useNavigate();
	const toast = useToast();

	const fetchPlaylist = async () => {
		setFetchPlaylistStatus({ loading: true, error: false });
		await client
			.get(`/playlists/${id}`)
			.then((res) => {
				setInputs({
					playlistName: res.data.title,
					playlistDesc: res.data.description,
				});
				setPlaylistSongs(res.data.songs);

				setFetchPlaylistStatus({ loading: false, error: false });
			})
			.catch(() => {
				setFetchPlaylistStatus({ loading: false, error: true });
			});
	};

	const fetchOtherSongs = async () => {
		setOtherSongs((prev) => {
			return { ...prev, error: false, loading: true };
		});
		await client
			.get("/songs/random")
			.then((res) => {
				setOtherSongs((prev) => {
					return { ...prev, data: res.data, loading: false };
				});
			})
			.catch(() => {
				setOtherSongs((prev) => {
					return { ...prev, error: true, loading: false };
				});
			});
	};

	useEffect(() => {
		fetchPlaylist();
		fetchOtherSongs();
	}, []);

	const songIsInPlaylist = (song) => {
		const songExists = playlistSongs.find((s) => song._id === s._id);
		return songExists ? true : false;
	};

	const toggleAddSong = (song) => {
		if (songIsInPlaylist(song)) {
			setPlaylistSongs(
				playlistSongs.filter((currentSong) => currentSong._id !== song._id)
			);
		} else {
			setPlaylistSongs([...playlistSongs, song]);
		}
	};

	const canEditPlaylist = () => {
		if (inputs.playlistName == "") {
			return false;
		}
		if (playlistSongs.length < 1) {
			return false;
		}

		return true;
	};

	const handleEditPlaylist = async () => {
		if (!canEditPlaylist()) {
			toast({
				description:
					inputs.playlistName == ""
						? "Дайте назву вашому плейлисту!"
						: "Додайте пісні до вашого плейлисту!",
				status: "error",
			});
		} else {
			editPlaylist();
		}
	};

	const editPlaylist = async () => {
		setEditLoading(true);
		const songIds = playlistSongs.map((song) => song._id);
		const playlistDetails = {
			title: inputs.playlistName,
			description: inputs.playlistDesc,
			songIds,
		};
		await client
			.patch(`/playlists/${id}`, playlistDetails, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			})
			.then(() => {
				setEditLoading(false);
				toast({
					description: "Плейлист оновлено!",
					status: "success",
				});
				navigate("/home");
			})
			.catch((err) => {
				setEditLoading(false);
				toast({
					description:
						err?.response.data.message || "Не вдалося оновити плейлист!",
					status: "error",
				});
			});
	};

	return (
		<Box p={4} pb={32} pt={{ base: 24, md: 4 }} pl={{ base: 4, md: 14, xl: 0 }}>
			<Flex align="center" justify="space-between" mb={8}>
				<Heading fontSize="2xl" fontWeight="semibold">
					Редагувати плейлист
				</Heading>
				<Button
					onClick={handleEditPlaylist}
					disabled={editLoading}
					_disabled={{ cursor: "not-allowed", opacity: 0.6 }}
					variant="unstyled"
					size="sm"
					px={4}
					bg="accent.light"
					fontSize="sm"
					rounded="md">
					{editLoading ? <Spinner color="white" size="sm" /> : "Зберегти"}
				</Button>
			</Flex>
			<Divider h="1px" border={0} my={6} bg="gray.500" />
			<Box mt={14}>
				{fetchPlaylistStatus.loading && (
					<Flex
						w="full"
						align="center"
						color="accent.main"
						justify="center"
						minH="12rem">
						<AiOutlineLoading color="inherit" className="spin" size={36} />
					</Flex>
				)}
				{!fetchPlaylistStatus.loading && !fetchPlaylistStatus.error && (
					<>
						<Flex
							direction={{ base: "column", md: "row" }}
							justify="space-between"
							mb={8}
							gap={8}>
							<FormControl isRequired>
								<FormLabel fontSize="xs" color="zinc.400" mb={3}>
									Назва плейлиста
								</FormLabel>
								<Input
									borderColor="accent.transparent"
									rounded="base"
									outline={0}
									variant="flushed"
									type="text"
									color="zinc.300"
									fontSize="sm"
									value={inputs.playlistName}
									onChange={(e) =>
										setInputs({ ...inputs, playlistName: e.target.value })
									}
								/>
							</FormControl>
							<FormControl>
								<FormLabel fontSize="xs" color="zinc.400" mb={3}>
									Опис плейлиста (необов&apos;язково)
								</FormLabel>
								<Input
									borderColor="accent.transparent"
									rounded="base"
									outline={0}
									variant="flushed"
									type="text"
									color="zinc.300"
									fontSize="sm"
									value={inputs.playlistDesc}
									onChange={(e) =>
										setInputs({ ...inputs, playlistDesc: e.target.value })
									}
								/>
							</FormControl>
						</Flex>
						<Heading as="h3" fontSize="xl" fontWeight={600} mb={4}>
							Пісні
						</Heading>
						<Divider w="full" h="1px" border="0" bg="zinc.600" mb={6} />

						<SimpleGrid
							templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
							gap={4}
							mt={4}>
							{playlistSongs?.map((song) => (
								<PlaylistSong
									key={song?._id}
									song={song}
									onToggleAdd={() => toggleAddSong(song)}
									isAdded={songIsInPlaylist(song)}
								/>
							))}
						</SimpleGrid>

						<Flex align="center" justify="space-between" mt={10} mb={6}>
							<Heading
								as="h4"
								fontSize="lg"
								color="zinc.400"
								fontWeight={400}>
								Додати інші пісні
							</Heading>
							<Button
								onClick={fetchOtherSongs}
								_disabled={{ cursor: "not-allowed", opacity: 0.6 }}
								disabled={otherSongs.loading}
								variant="unstyled"
								size="sm"
								px={6}
								py={2}
								bg="accent.light"
								fontSize="sm"
								rounded="md">
								{otherSongs.loading ? (
									<Spinner color="white" size="sm" />
								) : (
									"Оновити"
								)}
							</Button>
						</Flex>
					</>
				)}
				{!fetchPlaylistStatus.loading && fetchPlaylistStatus.error && (
					<Box my={4}>
						<Text color="zinc.400">Вибачте, сталася помилка</Text>
					</Box>
				)}
				<Divider h="1px" border={0} mt={6} mb={6} bg="gray.800" />
				{otherSongs.loading && (
					<Flex
						w="full"
						align="center"
						color="accent.main"
						justify="center"
						minH="12rem">
						<AiOutlineLoading color="inherit" className="spin" size={36} />
					</Flex>
				)}
				{!otherSongs.loading && otherSongs.error && (
					<Box my={4}>
						<Text color="zinc.400">Вибачте, сталася помилка</Text>
					</Box>
				)}
				{!otherSongs.loading && !otherSongs.error && (
					<SimpleGrid
						templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
						gap={4}
						mt={4}>
						{otherSongs?.data?.map((song) => (
							<PlaylistSong
								key={song?._id}
								song={song}
								isAdded={songIsInPlaylist(song)}
								onToggleAdd={() => toggleAddSong(song)}
							/>
						))}
					</SimpleGrid>
				)}
			</Box>
		</Box>
	);
};

export default EditPlaylistPage;
