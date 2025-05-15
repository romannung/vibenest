import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { BsFillPlayFill } from "react-icons/bs";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { client } from "../api";
import { useParams } from "react-router-dom";

const PlaylistSong = ({ song, index, totalSongs, handlePlay, onToggleAdd, isAdded, showMoveButtons = true }) => {
	const { id: playlistId } = useParams();

	const handleMove = async (direction) => {
		const fromIndex = index;
		const toIndex = direction === 'up' ? index - 1 : index + 1;

		try {
			await client.patch(`/playlists/${playlistId}/reorder`, {
				fromIndex,
				toIndex
			});
			// Оновлюємо сторінку, щоб побачити зміни
			window.location.reload();
		} catch (error) {
			console.error('Помилка при переміщенні пісні:', error);
		}
	};

	return (
		<Flex
			align="center"
			justify="space-between"
			gap={4}
			p={2}
			rounded="lg"
			transition="all 0.3s ease"
			_hover={{ bg: "blackAlpha.400" }}>
			<Flex align="center" gap={4} flex={1}>
				<Box position="relative" minW="3rem" h="3rem">
					<Image
						src={song?.coverImage}
						alt={song?.title}
						w="full"
						h="full"
						rounded="lg"
						objectFit="cover"
					/>
					<Button
						position="absolute"
						inset={0}
						bg="blackAlpha.600"
						opacity={0}
						display="flex"
						alignItems="center"
						justifyContent="center"
						_hover={{ opacity: 1 }}
						onClick={() => handlePlay(song)}>
						<BsFillPlayFill size={24} />
					</Button>
				</Box>
				<Box>
					<Text
						fontSize={{ base: "sm", md: "md" }}
						fontWeight={500}
						noOfLines={1}>
						{song?.title}
					</Text>
					<Text fontSize="sm" color="zinc.400" noOfLines={1}>
						{song?.artistes?.join(", ")}
					</Text>
				</Box>
			</Flex>
			<Text fontSize="sm" color="zinc.400">
				{song?.duration}
			</Text>
			<Flex gap={2}>
				{onToggleAdd && (
					<Button
						size="sm"
						variant="ghost"
						colorScheme={isAdded ? "red" : "green"}
						onClick={onToggleAdd}
						title={isAdded ? "Видалити з плейлиста" : "Додати до плейлиста"}>
						{isAdded ? <AiOutlineMinus /> : <AiOutlinePlus />}
					</Button>
				)}
				{showMoveButtons && (
					<>
						<Button
							size="sm"
							variant="ghost"
							colorScheme="blue"
							isDisabled={index === 0}
							onClick={() => handleMove('up')}
							title="Перемістити вгору">
							<MdArrowUpward />
						</Button>
						<Button
							size="sm"
							variant="ghost"
							colorScheme="blue"
							isDisabled={index === totalSongs - 1}
							onClick={() => handleMove('down')}
							title="Перемістити вниз">
							<MdArrowDownward />
						</Button>
					</>
				)}
			</Flex>
		</Flex>
	);
};

export default PlaylistSong;
