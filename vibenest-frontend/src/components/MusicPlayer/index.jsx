import { useEffect, useRef, useState } from "react";
import {
	Button,
	Flex,
	Hide,
	SimpleGrid,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {
	nextTrack,
	prevTrack,
	setPlaying,
	resetPlayer,
} from "../../redux/slices/playerSlice";
import { client } from "../../api";
import { setUser } from "../../redux/slices/userSlice";
import VolumeControl from "./VolumeControl";
import TrackDetails from "./TrackDetails";
import PlayControls from "./PlayControls";
import LoginModal from "../LoginModal";
import PlayingBar from "./PlayingBar";
import { setModalMessage } from "../../redux/slices/modalSlice";

const MusicPlayer = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const modalRef = useRef();
	const toast = useToast();
	const dispatch = useDispatch();
	const { currentTrack, repeatStatus, currentIndex, trackList, isPlaying } =
		useSelector((state) => state.player);
	const { user, token } = useSelector((state) => state.user);
	const audioRef = useRef();

	const isEndOfTracklist = currentIndex === trackList.length - 1;

	const [songDetails, setSongDetails] = useState({
		volume: 1,
		time: 0,
		currentTime: 0,
		shuffle: false,
		repeat: false,
	});
	const [userInteracted, setUserInteracted] = useState(false);

	if (!user) return null;

	useEffect(() => {
		const handleUserInteraction = () => {
			setUserInteracted(true);
			document.removeEventListener('click', handleUserInteraction);
			document.removeEventListener('keydown', handleUserInteraction);
		};

		document.addEventListener('click', handleUserInteraction);
		document.addEventListener('keydown', handleUserInteraction);
		window.addEventListener('user-interacted', handleUserInteraction);

		return () => {
			document.removeEventListener('click', handleUserInteraction);
			document.removeEventListener('keydown', handleUserInteraction);
			window.removeEventListener('user-interacted', handleUserInteraction);
		};
	}, []);

	useEffect(() => {
		if (isPlaying && userInteracted && audioRef.current) {
			try {
				const playPromise = audioRef.current.play();
				if (playPromise !== undefined) {
					playPromise.catch((error) => {
						console.error("Помилка автовідтворення:", error);
						dispatch(setPlaying(false));
					});
				}
			} catch (error) {
				console.error("Помилка відтворення:", error);
				dispatch(setPlaying(false));
			}
		} else if (!isPlaying && audioRef.current) {
			audioRef.current.pause();
		}
	}, [isPlaying, userInteracted, currentTrack?._id]);

	useEffect(() => {
		if (audioRef.current) {
			const savedVolume = localStorage.getItem('player-volume');
			const volume = savedVolume !== null ? parseFloat(savedVolume) : 1;
			audioRef.current.volume = volume;
			setSongDetails(prev => ({
				...prev,
				volume,
				time: Math.round(
					(audioRef.current.currentTime / audioRef.current.duration) * 100
				) || 0,
				shuffle: false,
				repeat: false,
			}));
		}
	}, [currentTrack?._id]);

	useEffect(() => {
		if (!audioRef.current) return;

		const updateTime = () => {
			setSongDetails(prev => ({
				...prev,
				time: Math.round((audioRef.current.currentTime / audioRef.current.duration) * 100) || 0,
				currentTime: audioRef.current.currentTime || 0,
			}));
			// Зберігаємо позицію для поточного треку
			if (currentTrack?._id) {
				localStorage.setItem(
					`track-position-${currentTrack._id}`,
					audioRef.current.currentTime
				);
			}
		};
		audioRef.current.addEventListener('timeupdate', updateTime);
		return () => {
			audioRef.current && audioRef.current.removeEventListener('timeupdate', updateTime);
		};
	}, [audioRef.current, currentTrack?._id]);

	// Додаю новий useEffect з loadedmetadata
	useEffect(() => {
		if (audioRef.current && currentTrack?._id) {
			const updateProgress = () => {
				const seek = audioRef.current.currentTime;
				setSongDetails(prev => ({
					...prev,
					currentTime: seek,
					time: Math.round((seek / audioRef.current.duration) * 100) || 0,
				}));
			};

			const handleLoadedMetadata = () => {
				const saved = localStorage.getItem(`track-position-${currentTrack._id}`);
				let seek = 0;
				if (saved) {
					seek = parseFloat(saved);
					audioRef.current.currentTime = seek;
				}
				updateProgress();
			};

			audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
			audioRef.current.addEventListener('canplay', updateProgress);

			return () => {
				audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
				audioRef.current.removeEventListener('canplay', updateProgress);
			};
		}
	}, [currentTrack?._id]);

	const seekPoint = (e) => {
		if (audioRef.current && audioRef.current.duration) {
			audioRef.current.currentTime = (e / 100) * audioRef.current.duration;
			setSongDetails((prev) => ({
				...prev,
				time: Math.round(
					(audioRef.current.currentTime / audioRef.current.duration) * 100
				),
			}));
		}
	};

	const changeVolume = (e) => {
		const newVolume = e / 100;
		setSongDetails((prevValues) => {
			return { ...prevValues, volume: newVolume };
		});
		if (audioRef.current) {
			audioRef.current.volume = newVolume;
		}
		// Зберігаємо гучність у localStorage
		localStorage.setItem('player-volume', newVolume);
	};

	// Відновлюємо гучність з localStorage при монтуванні
	useEffect(() => {
		const savedVolume = localStorage.getItem('player-volume');
		if (audioRef.current && savedVolume !== null) {
			audioRef.current.volume = parseFloat(savedVolume);
			setSongDetails(prev => ({ ...prev, volume: parseFloat(savedVolume) }));
		}
	}, []);

	const handlePlayPause = () => {
		if (!userInteracted) {
			setUserInteracted(true);
		}

		if (isPlaying) {
			audioRef?.current?.pause();
			dispatch(setPlaying(false));
		} else {
			try {
				const playPromise = audioRef?.current?.play();
				if (playPromise !== undefined) {
					playPromise.then(() => {
						dispatch(setPlaying(true));
					}).catch((error) => {
						console.error("Помилка відтворення:", error);
						dispatch(setPlaying(false));
					});
				}
			} catch (error) {
				console.error("Помилка відтворення:", error);
				dispatch(setPlaying(false));
			}
		}
	};

	const volumeToggle = () => {
		if (songDetails?.volume > 0) {
			setSongDetails((prev) => {
				return { ...prev, volume: 0 };
			});
			if (audioRef.current) {
				audioRef.current.volume = 0;
			}
		} else {
			setSongDetails((prev) => {
				return { ...prev, volume: 1 };
			});
			if (audioRef.current) {
				audioRef.current.volume = 1;
			}
		}
	};

	const handleNextSong = () => {
		if (trackList.length === 1) {
			restartSong();
		} else {
			dispatch(nextTrack());
			dispatch(setPlaying(true));
		}
	};

	const handlePreviousSong = () => {
		if (trackList.length === 1) {
			restartSong();
		} else {
			dispatch(prevTrack());
			dispatch(setPlaying(true));
		}
	};

	const restartSong = () => {
		setSongDetails((prev) => {
			return { ...prev, time: 0 };
		});
		if (audioRef.current) {
			audioRef.current.currentTime = 0;
			if (isPlaying && userInteracted) {
				try {
					const playPromise = audioRef.current.play();
					if (playPromise !== undefined) {
						playPromise.catch((error) => {
							console.error("Помилка відтворення:", error);
							dispatch(setPlaying(false));
						});
					}
				} catch (error) {
					console.error("Помилка відтворення:", error);
					dispatch(setPlaying(false));
				}
			}
		}
	};

	const handleEnded = () => {
		if (repeatStatus === "TRACK") {
			restartSong();
		} else if (!isEndOfTracklist || repeatStatus === "TRACKLIST") {
			dispatch(nextTrack());
			setUserInteracted(true);
			// Додаємо невелику затримку перед відтворенням
			setTimeout(() => {
				dispatch(setPlaying(true));
			}, 100);
		} else {
			dispatch(setPlaying(false));
		}
	};

	const likeSong = async () => {
		await client
			.patch(`/songs/like/${currentTrack?._id}`, null, {
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

	const handleLike = () => {
		if (!token) {
			dispatch(
				setModalMessage("Будь ласка, увійдіть щоб додавати пісні до улюблених.")
			);
			onOpen();
		} else {
			likeSong();
		}
	};

	useEffect(() => {
		const tryPlay = () => {
			if (isPlaying && audioRef.current) {
				audioRef.current.play().catch(() => {});
			}
		};
		window.addEventListener('user-interacted', tryPlay);
		return () => window.removeEventListener('user-interacted', tryPlay);
	}, [isPlaying, currentTrack?._id]);

	useEffect(() => {
		if (!user) {
			dispatch(resetPlayer());
		}
	}, [user]);

	useEffect(() => {
		if (isPlaying && audioRef.current && audioRef.current.paused) {
			dispatch(setPlaying(false));
		}
	}, []);

	return (
		<>
			<LoginModal ref={modalRef} onClose={onClose} isOpen={isOpen} />
			<SimpleGrid
				templateColumns="repeat(3, 1fr)"
				align="center"
				justify="space-between"
				position="fixed"
				bottom="0"
				left="0"
				zIndex={100}
				width="full"
				p={4}
				border="1px"
				borderColor="zinc.600"
				roundedTop="lg"
				bgColor="blackAlpha.700"
				backdropFilter="blur(15px)">
				<TrackDetails track={currentTrack} />
				<Flex direction="column" gap={2}>
					<PlayControls
						isPlaying={isPlaying}
						onNext={handleNextSong}
						onPlay={handlePlayPause}
						onPrevious={handlePreviousSong}
						repeatStatus={repeatStatus}
						currentTrack={currentTrack}
					/>
					<Hide below="md">
						<PlayingBar
							onSeek={seekPoint}
							time={songDetails?.time}
							track={currentTrack}
							trackRef={audioRef.current}
							currentTime={songDetails?.currentTime}
						/>
					</Hide>
				</Flex>
				<Flex align="center" justify="flex-end" gap={{ base: 0, md: 4 }}>
					<Button
						variant="unstyled"
						fontSize={{ base: 18, md: 24 }}
						p={0}
						h={{ base: 8, md: 12 }}
						minW={6}
						display="inline-flex"
						alignItems="center"
						justifyContent="center"
						color="accent.main"
						onClick={handleLike}>
						{user?.favorites.includes(currentTrack._id) ? (
							<AiFillHeart />
						) : (
							<AiOutlineHeart />
						)}
					</Button>
					<Hide below="md">
						<VolumeControl
							onChange={changeVolume}
							onToggle={volumeToggle}
							value={songDetails?.volume ? songDetails.volume * 100 : 0}
						/>
					</Hide>
				</Flex>
			</SimpleGrid>
			<audio
				ref={audioRef}
				src={currentTrack?.songUrl}
				onEnded={handleEnded}
				onVolumeChange={(e) => {
					setSongDetails(prev => ({
						...prev,
						volume: e.target.volume
					}));
				}}
				preload="metadata"
			/>
		</>
	);
};

export default MusicPlayer;
