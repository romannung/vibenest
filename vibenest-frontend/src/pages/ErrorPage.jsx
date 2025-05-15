import { Box, Flex, Heading, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { BiError } from "react-icons/bi";

const ErrorPage = () => {
	return (
		<Box minH="100vh" bg="#181818" p={4} display="flex" alignItems="center" justifyContent="center">
			<Flex
				direction="column"
				align="center"
				justify="center"
				bg="primary.800"
				rounded="2xl"
				boxShadow="2xl"
				px={{ base: 6, md: 16 }}
				py={{ base: 10, md: 16 }}
				gap={6}
				maxW="lg"
				w="full"
			>
				<Flex align="center" gap={4}>
					<Heading fontSize={{ base: "7xl", md: "9xl" }} color="accent.main" fontWeight="extrabold" letterSpacing="tight">
						404
					</Heading>
					<BiError size={80} color="#ED8936" />
				</Flex>
				<Heading fontSize={{ base: "2xl", md: "4xl" }} color="white" fontWeight={700} textAlign="center">
					Сторінку не знайдено
				</Heading>
				<Text color="zinc.300" fontSize={{ base: "md", md: "lg" }} textAlign="center" maxW="md">
					Вибачте, такої сторінки не існує або вона була переміщена.
				</Text>
				<Link to="/home">
					<Button
						bg="accent.main"
						color="white"
						fontWeight="bold"
						fontSize={{ base: "md", md: "lg" }}
						px={8}
						py={6}
						rounded="full"
						mt={4}
						boxShadow="0 4px 24px 0 rgba(237,137,54,0.25)"
						_hover={{ bg: "accent.light" }}
						_active={{ bg: "highlight.main" }}
					>
						На головну
					</Button>
				</Link>
			</Flex>
		</Box>
	);
};

export default ErrorPage;
