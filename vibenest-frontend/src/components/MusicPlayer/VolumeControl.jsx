import {
	Button,
	Flex,
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
} from "@chakra-ui/react";
import { BsFillVolumeMuteFill, BsFillVolumeUpFill } from "react-icons/bs";

const VolumeControl = ({ onToggle, onChange, value }) => {
	return (
		<Flex align="center">
			<Button
				variant="unstyled"
				p={0}
				m={0}
				display="inline-flex"
				boxSize={6}
				onClick={onToggle}>
				{value === 0 ? <BsFillVolumeMuteFill /> : <BsFillVolumeUpFill />}
			</Button>

			<Slider
				aria-label="volume-slider"
				width="10rem"
				onChange={onChange}
				value={value || 0}>
				<SliderTrack bg="gray.400">
					<SliderFilledTrack bg="accent.light" />
				</SliderTrack>
				<SliderThumb boxSize={3} outline={0} />
			</Slider>
		</Flex>
	);
};

export default VolumeControl;
