import {
	Box,
	Button,
	Flex,
	Heading,
	Image,
	Text,
	useToast,
	IconButton,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fadeInUp } from "../theme/motionVariants";
import {
	setCurrentTrack,
	setPlaying,
	setTrackList,
	playTrack,
} from "../redux/slices/playerSlice";
import {
	AiFillHeart,
	AiFillPauseCircle,
	AiFillPlayCircle,
	AiOutlineHeart,
	AiOutlineMore,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { client } from "../api";
import { setUser } from "../redux/slices/userSlice";

const SongCard = ({ song, audioRef, onDelete }) => {
	const dispatch = useDispatch();
	const { currentTrack, isPlaying } = useSelector((state) => state.player);
	const { user, token } = useSelector((state) => state.user);

	const toast = useToast();

	const playSong = () => {
		window.dispatchEvent(new Event('user-interacted'));
		if (isCurrentTrack) {
			dispatch(setPlaying(!isPlaying));
		} else {
			dispatch(playTrack(song));
			dispatch(setTrackList({ list: [song] }));
		}
	};

	const handleLike = async () => {
		await client
			.patch(`/songs/like/${song?._id}`, null, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				dispatch(setUser(res.data));
				toast({
					description: "Список улюблених оновлено",
					status: "success",
				});
			})
			.catch(() => {
				toast({
					description: "Сталася помилка",
					status: "error",
				});
			});
	};

	const handleDelete = async () => {
		try {
			await client.delete(`/songs/${song._id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			toast({
				description: "Пісню видалено",
				status: "success",
			});
			if (onDelete) {
				onDelete(song._id);
			}
		} catch (error) {
			toast({
				description: "Не вдалося видалити пісню",
				status: "error",
			});
		}
	};

	const isCurrentTrack = currentTrack?._id === song?._id;
	const isFavorite = user?.favorites.includes(song._id);

	return (
		<Box
			as={motion.div}
			initial="initial"
			animate="animate"
			variants={fadeInUp}
			rounded="lg"
			bg="zinc.900"
			minW={{ base: "8rem", md: "10rem" }}
			pb={4}
			overflow="hidden"
			role="group">
			<Box
				onClick={playSong}
				cursor="pointer"
				h={{ base: "8rem", md: "10rem" }}
				mb={4}
				overflow="hidden"
				position="relative">
				<Image
					src={song?.coverImage}
					alt={song?.title}
					w="full"
					roundedTop="base"
					transition="0.5s ease"
					_groupHover={{ transform: "scale(1.1)" }}
				/>
				<Box
					_groupHover={{ opacity: 1 }}
					opacity={0}
					transition="0.5s ease"
					display="flex"
					alignItems="center"
					justifyContent="center"
					bg="blackAlpha.700"
					position="absolute"
					top={0}
					left={0}
					w="full"
					h="full">
					<Button
						variant="unstyled"
						display="inline-flex"
						alignItems="center"
						justifyContent="center"
						p={0}
						color="gray.300"
						rounded="full">
						{isPlaying && isCurrentTrack ? (
							<AiFillPauseCircle color="inherit" size={36} />
						) : (
							<AiFillPlayCircle color="inherit" size={36} />
						)}
					</Button>
				</Box>
			</Box>
			<Flex gap={2} justify="space-between" align="center" px={2}>
				<Box>
					<Heading
						as="h5"
						fontSize={{ base: "sm", md: "md" }}
						noOfLines={1}
						fontWeight={500}>
						{song?.title}
					</Heading>
					<Link to={`/artiste/${song?.artistes[0]}`}>
						<Text
							fontSize={{ base: "xs", md: "sm" }}
							color="zinc.400"
							noOfLines={1}>
							{" "}
							{song?.artistes.join(", ")}{" "}
						</Text>
					</Link>
				</Box>
				<Flex gap={1}>
					{user && (
						<Button
							variant="unstyled"
							color={isFavorite ? "red.500" : "#b1b1b1"}
							minW={6}
							onClick={handleLike}
							transition="all 0.15s cubic-bezier(.4,0,.2,1)"
							_hover={isFavorite
								? { color: "red.400", transform: "scale(1.2)" }
								: { color: "red.500", transform: "scale(1.2)" }
							}
						>
							{isFavorite ? (
								<AiFillHeart color="inherit" />
							) : (
								<AiOutlineHeart color="inherit" />
							)}
						</Button>
					)}
					{user && (
						<Menu>
							<MenuButton
								as={IconButton}
								icon={<AiOutlineMore />}
								variant="unstyled"
								color="gray.400"
								_hover={{ color: "white" }}
								size="sm"
							/>
							<MenuList bg="zinc.800">
								<MenuItem 
									onClick={handleDelete}
									_hover={{ bg: "zinc.700" }}
									color="red.400"
								>
									Видалити
								</MenuItem>
							</MenuList>
						</Menu>
					)}
				</Flex>
			</Flex>
		</Box>
	);
};

export default SongCard;
