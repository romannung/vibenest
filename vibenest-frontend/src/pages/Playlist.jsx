import { Box, Container, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../api";
import PlaylistSong from "../components/PlaylistSong";
import { usePlayer } from "../contexts/PlayerContext";

const Playlist = () => {
	const { id } = useParams();
	const [playlist, setPlaylist] = useState(null);
	const { handlePlay } = usePlayer();

	useEffect(() => {
		const fetchPlaylist = async () => {
			try {
				const response = await client.get(`/playlists/${id}`);
				setPlaylist(response.data);
			} catch (error) {
				console.error("Error fetching playlist:", error);
			}
		};

		fetchPlaylist();
	}, [id]);

	if (!playlist) return null;

	return (
		<Container maxW="container.xl">
			<Flex gap={6} direction={{ base: "column", md: "row" }}>
				<Box flex={{ base: "none", md: 2 }}>
					<Image
						src={playlist?.coverImage}
						alt={playlist?.name}
						rounded="lg"
						w="full"
						maxW="20rem"
						mx="auto"
					/>
				</Box>
				<Box flex={{ base: "none", md: 3 }}>
					<Heading size="lg" mb={4}>
						{playlist?.name}
					</Heading>
					<Text color="zinc.400" mb={8}>
						{playlist?.description}
					</Text>
					<Box>
						{playlist?.songs?.map((song, index) => (
							<PlaylistSong
								key={song._id}
								song={song}
								index={index}
								totalSongs={playlist.songs.length}
								handlePlay={handlePlay}
							/>
						))}
					</Box>
				</Box>
			</Flex>
		</Container>
	);
};

export default Playlist; 