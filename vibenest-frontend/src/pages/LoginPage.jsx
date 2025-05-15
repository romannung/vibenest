import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	InputGroup,
	InputRightElement,
	Spinner,
	Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdError } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { client } from "../api";
import { loginUser } from "../redux/slices/userSlice";
import { resetPlayer } from "../redux/slices/playerSlice";

const LoginPage = () => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const dispatch = useDispatch();

	const validateFields = () => {
		if (username == "" || password == "") {
			setError("Всі поля обов'язкові!");
			return false;
		} else {
			setError(null);
			return true;
		}
	};

	const handleLogin = async () => {
		if (validateFields()) {
			setLoading(true);
			await client
				.post("/users/login", {
					username,
					password,
				})
				.then((res) => {
					dispatch(resetPlayer());
					dispatch(loginUser(res.data));
					setLoading(false);
				})
				.catch((err) => {
					setError(err?.response?.data?.message);
					setLoading(false);
				});
		}
	};

	return (
		<Box minH="calc(100vh - 5rem)" maxW="2xl" mx="auto" p={6}>
			<Box
				bg="primary.800"
				rounded="lg"
				p={{ base: 4, md: 8 }}
				boxShadow="lg"
				border="1px"
				borderColor="primary.700">
				<Box mb={8}>
					<Heading fontSize="2xl" color="zinc.200">
						Вхід
					</Heading>
					<Text fontSize="sm">Щоб продовжити користуватися Vibenest</Text>
				</Box>
				<Flex direction="column" gap={4}>
					<FormControl>
						<FormLabel fontSize="xs" color="white">
							Ім'я користувача
						</FormLabel>
						<Input
							border="1px"
							borderColor="zinc.400"
							rounded="md"
							outline={0}
							type="text"
							color="white"
							fontSize="sm"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							bg="primary.900"
							_placeholder={{ color: "white" }}
							_focus={{ borderColor: "accent.main", boxShadow: "none", color: "white" }}
							placeholder="Введіть ім'я користувача"
						/>
					</FormControl>
					<FormControl>
						<FormLabel fontSize="xs" color="white">
							Пароль
						</FormLabel>
						<InputGroup border="1px" borderColor="zinc.400" rounded="md" bg="primary.900">
							<Input
								border="none"
								_focus={{ outline: "none", borderColor: "accent.main", color: "white" }}
								type={showPassword ? "text" : "password"}
								color="white"
								fontSize="sm"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								bg="primary.900"
								_placeholder={{ color: "white" }}
								placeholder="Введіть пароль"
							/>
							<InputRightElement>
								<Button
									p={1}
									color="white"
									_hover={{ color: "accent.main" }}
									variant="ghost"
									onClick={() => setShowPassword(!showPassword)}>
									{showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
								</Button>
							</InputRightElement>
						</InputGroup>
					</FormControl>
					{error && (
						<Flex align="center" color="red.500" gap={4}>
							<MdError color="inherit" />
							<Text color="inherit" fontSize="xs">
								{error}
							</Text>
						</Flex>
					)}
					<Box mt={6}>
						<Button
							onClick={handleLogin}
							bg="accent.main"
							color="white"
							py={5}
							w="full"
							rounded="md"
							fontWeight={600}
							fontSize="md"
							_hover={{ bg: "accent.light" }}
							_active={{ bg: "highlight.main" }}>
							{loading ? <Spinner color="white" /> : "УВІЙТИ"}
						</Button>
						<Text my={2} fontSize="sm" textAlign="center">
							АБО
						</Text>
						<Link to="/home">
							<Text color="accent.main" fontSize="sm" textAlign="center" _hover={{ color: "accent.light" }}>
								Продовжити без входу
							</Text>
						</Link>
					</Box>
					<Text fontSize="sm" color="zinc.400">
						{"Ще не маєте акаунту?"}{" "}
						<Link to="/auth/register">
							{" "}
							<Text as="span" color="accent.main" _hover={{ color: "accent.light" }}>
								Зареєструватися
							</Text>
						</Link>
					</Text>
				</Flex>
			</Box>
		</Box>
	);
};

export default LoginPage;
