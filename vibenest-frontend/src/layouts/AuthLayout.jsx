import { Box, Flex, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const AuthLayout = () => {
	const { user } = useSelector((state) => state.user);
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate("/home");
		}
	}, [user]);
	return (
		<main>
			<Flex
				align="center"
				justify="flex-start"
				bg="#27272a"
				p={4}
				pl={6}
				h={{ base: "full", md: "5rem" }}>
				<Flex align="center" color="accent.main" justify="flex-start" gap={2}>
					<img src="/vibenest-logo.png" alt="Logo" style={{height:55}} />
				</Flex>
			</Flex>
			<Box bg="#181818" h="full" minH="91vh">
				<Outlet />
			</Box>
		</main>
	);
};

export default AuthLayout;
