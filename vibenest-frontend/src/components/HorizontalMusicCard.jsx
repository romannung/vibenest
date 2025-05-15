import {
	Box,
	Button,
	Flex,
	Heading,
	Hide,
	Image,
	Text,
} from "@chakra-ui/react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { motion } from "framer-motion";
import { fadeInUp } from "../theme/motionVariants";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "@chakra-ui/react";
import { client } from "../api";
import { setUser } from "../redux/slices/userSlice";

const HorizontalMusicCard = ({ song, onPlay }) => {
	const { currentTrack } = useSelector((state) => state.player);
	const { user, token } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const toast = useToast();

	const handleLike = async (e) => {
		e.stopPropagation();
		if (!token) {
			toast({
				description: "Будь ласка, увійдіть щоб зберегти пісні в улюблені.",
				status: "info",
			});
			return;
		}
		await client
			.patch(`/songs/like/${song?._id}`, null, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				dispatch(setUser(res.data));
				toast({
					description: "Ваші улюблені оновлено",
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

	return (
		<Box
			cursor="pointer"
			onClick={() => onPlay(song)}
			as={motion.div}
			initial="initial"
			animate="animate"
			variants={fadeInUp}
			bg="zinc.900"
			p={2}
			w="full"
			rounded="base">
			<Flex align="center" justify="space-between">
				<Flex align="center" gap={{ base: 2, md: 4 }}>
					<Image
						src={song?.coverImage}
						alt="album"
						objectFit="cover"
						w={{ base: 8, md: 10 }}
						h={{ base: 8, md: 10 }}
						rounded="base"
					/>
					<Box>
						<Heading
							as="h4"
							fontSize={{ base: "sm", md: "md" }}
							fontWeight={500}
							color={
								currentTrack?._id == song?._id ? "accent.light" : "zinc.200"
							}
							noOfLines={1}>
							{song?.title}
						</Heading>
						<Text fontSize="xs" noOfLines={1} color="zinc.400">
							{song?.artistes?.join(", ")}
						</Text>
					</Box>
				</Flex>
				<Flex align="center" gap={{ base: 1, md: 3 }}>
					<Hide below="xl">
						<Text fontSize="sm" color="zinc.400">
							{song?.duration?.split(".")?.join(":")}
						</Text>
					</Hide>
					<Button 
						variant="unstyled" 
						minW={5} 
						color={user?.favorites?.includes(song._id) ? "red.500" : "#b1b1b1"}
						transition="all 0.15s cubic-bezier(.4,0,.2,1)"
						_hover={user?.favorites?.includes(song._id)
							? { color: "red.400", transform: "scale(1.2)" }
							: { color: "red.500", transform: "scale(1.2)" }
						}
						onClick={handleLike}
					>
						{user?.favorites?.includes(song._id) ? (
							<AiFillHeart color="inherit" />
						) : (
							<AiOutlineHeart color="inherit" />
						)}
					</Button>
				</Flex>
			</Flex>
		</Box>
	);
};

export default HorizontalMusicCard;
