import { Button, Flex, Hide } from "@chakra-ui/react";
import { AiFillPauseCircle, AiFillPlayCircle } from "react-icons/ai";
import {
	TbArrowsShuffle,
	TbPlayerTrackNextFilled,
	TbPlayerTrackPrevFilled,
	TbRepeat,
	TbRepeatOff,
	TbRepeatOnce,
} from "react-icons/tb";
import { useDispatch } from "react-redux";
import { toggleRepeat } from "../../redux/slices/playerSlice";

const PlayControls = ({
	onNext,
	onPrevious,
	onPlay,
	isPlaying,
	repeatStatus,
	currentTrack,
}) => {
	const dispatch = useDispatch();
	return (
		<Flex
			align="center"
			justify="center"
			gap={{ base: 1, md: 6 }}
			ml={{ base: 8, md: 0 }}>
			<Hide below="md">
				<Button
					color="accent.main"
					variant="unstyled"
					display="inline-flex"
					alignItems="center"
					justifyContent="center"
					_hover={{ color: "accent.light" }}
				>
					<TbArrowsShuffle color="inherit" size={16} />
				</Button>
			</Hide>
			<Button
				onClick={onPrevious}
				variant="unstyled"
				p={0}
				h={10}
				w={10}
				minW={10}
				bg="#232323"
				color="white"
				borderRadius="full"
				fontSize={24}
				display="inline-flex"
				alignItems="center"
				justifyContent="center"
				_hover={{ bg: "accent.main", color: "white" }}
			>
				<TbPlayerTrackPrevFilled size={24} />
			</Button>
			<Button
				onClick={onPlay}
				variant="unstyled"
				color="accent.main"
				p={0}
				fontSize={{ base: 36, md: 48 }}
				disabled={!currentTrack}
				display="inline-flex"
				alignItems="center"
				justifyContent="center"
			>
				{!currentTrack ? <AiFillPlayCircle /> : (!isPlaying ? <AiFillPlayCircle /> : <AiFillPauseCircle />)}
			</Button>
			<Button
				onClick={onNext}
				variant="unstyled"
				p={0}
				h={10}
				w={10}
				minW={10}
				bg="#232323"
				color="white"
				borderRadius="full"
				fontSize={24}
				display="inline-flex"
				alignItems="center"
				justifyContent="center"
				_hover={{ bg: "accent.main", color: "white" }}
			>
				<TbPlayerTrackNextFilled size={24} />
			</Button>
			<Hide below="md">
				<Button
					onClick={() => dispatch(toggleRepeat())}
					color={repeatStatus == "OFF" ? "accent.main" : "accent.light"}
					variant="unstyled"
					display="inline-flex"
					alignItems="center"
					justifyContent="center"
					_hover={{ color: "accent.light" }}
				>
					{repeatStatus === "OFF" ? (
						<TbRepeatOff color="inherit" size={18} />
					) : repeatStatus === "SINGLE" ? (
						<TbRepeatOnce color="inherit" size={18} />
					) : (
						<TbRepeat color="inherit" size={18} />
					)}
				</Button>
			</Hide>
		</Flex>
	);
};

export default PlayControls;
