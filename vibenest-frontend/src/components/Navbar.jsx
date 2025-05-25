import { BiMenuAltRight, BiMusic } from "react-icons/bi";
import { AiFillHeart, AiFillHome, AiOutlineLogout } from "react-icons/ai";
import { BsHeadphones } from "react-icons/bs";
import { TiTimes } from "react-icons/ti";
import { HiOutlineUserCircle, HiViewGrid } from "react-icons/hi";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Flex,
  Text,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/userSlice";
import { resetPlayer } from "../redux/slices/playerSlice";
import { useEffect, useState } from "react";

const MobileNav = () => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setNavIsOpen(false);
  }, [pathname]);

  const toggleNav = () => {
    setNavIsOpen(!navIsOpen);
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      zIndex={30}
      w="full"
      h={navIsOpen ? "100vh" : undefined}
      bg="primary.900"
    >
      <Flex align="center" justify="space-between" p={2}>
        <Link to="/home">
          <Flex color="accent.main" align="center" gap={4}>
            <Image
              src="/vibenest-logo.png"
              alt="Logo"
              width="180px"
              height="auto"
            />
          </Flex>
        </Link>
        <Button variant="unstyled" onClick={toggleNav}>
          {navIsOpen ? <TiTimes size={24} /> : <BiMenuAltRight size={24} />}
        </Button>
      </Flex>
      {navIsOpen && (
        <Box px={4} pb={2} h="full">
          <NavContent />
        </Box>
      )}
    </Box>
  );
};

const TabletNav = () => {
  // Панель для планшетів з меншою шириною, завжди відкрита
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      zIndex={30}
      width="12rem" // менш широка ніж десктоп
      minH="100vh"
      borderRight="1px"
      borderRightColor="primary.700"
      bg="primary.900"
      boxShadow="lg"
      overflowY="auto"
      overflowX="hidden"
    >
      <Flex direction="column" minH="100vh" p={3}>
        <Flex color="accent.main" align="center" gap={4} mb={4}>
          <Image src="/vibenest-logo.png" alt="Logo" width="auto" height="auto" />
        </Flex>
        <NavContent />
      </Flex>
    </Box>
  );
};

const DesktopNav = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      zIndex={30}
      width="16rem"
      minH="100vh"
      borderRight="1px"
      borderRightColor="primary.700"
      bg="primary.900"
      boxShadow="lg"
      overflowY="auto"
      overflowX="hidden"
    >
      <Flex direction="column" minH="100vh" p={4}>
        <Flex color="accent.main" align="center" gap={4} mb={2}>
          <Image src="/vibenest-logo.png" alt="Logo" width="auto" height="auto" />
        </Flex>
        <NavContent />
      </Flex>
    </Box>
  );
};

const NavContent = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(resetPlayer());
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  const gotoLogin = () => {
    dispatch(resetPlayer());
    navigate("/auth/login");
  };
  return (
    <Box>
      <Flex direction="column" gap={2} mt={4}>
        <NavLink to="/home">
          {({ isActive }) => (
            <Button
              bg={isActive ? "highlight.main" : "transparent"}
              color={isActive ? "white" : "accent.main"}
              _hover={
                isActive
                  ? { bg: "highlight.dark" }
                  : { bg: "primary.700", color: "white" }
              }
              rounded="lg"
              display="inline-flex"
              alignItems="center"
              justifyContent="flex-start"
              gap={6}
              py={6}
              px={4}
              w="full"
              transition="all 0.2s"
            >
              <AiFillHome size={20} />
              <span>Головна</span>
            </Button>
          )}
        </NavLink>
        <NavLink to="/library">
          {({ isActive }) => (
            <Button
              bg={isActive ? "highlight.main" : "transparent"}
              color={isActive ? "white" : "accent.main"}
              _hover={
                isActive
                  ? { bg: "highlight.dark" }
                  : { bg: "primary.700", color: "white" }
              }
              rounded="lg"
              display="inline-flex"
              alignItems="center"
              justifyContent="flex-start"
              gap={6}
              w="full"
              py={6}
              px={4}
              transition="all 0.2s"
            >
              <HiViewGrid size={20} />
              <span>Бібліотека</span>
            </Button>
          )}
        </NavLink>
        <NavLink to="/playlists">
          {({ isActive }) => (
            <Button
              bg={isActive ? "highlight.main" : "transparent"}
              color={isActive ? "white" : "accent.main"}
              _hover={
                isActive
                  ? { bg: "highlight.dark" }
                  : { bg: "primary.700", color: "white" }
              }
              rounded="lg"
              display="inline-flex"
              alignItems="center"
              justifyContent="flex-start"
              gap={6}
              w="full"
              py={6}
              px={4}
              transition="all 0.2s"
            >
              <BsHeadphones size={20} />
              <span>Плейлисти</span>
            </Button>
          )}
        </NavLink>
        <NavLink to="/favorites">
          {({ isActive }) => (
            <Button
              bg={isActive ? "highlight.main" : "transparent"}
              color={isActive ? "white" : "accent.main"}
              _hover={
                isActive
                  ? { bg: "highlight.dark" }
                  : { bg: "primary.700", color: "white" }
              }
              rounded="lg"
              display="inline-flex"
              alignItems="center"
              justifyContent="flex-start"
              gap={6}
              w="full"
              py={6}
              px={4}
              transition="all 0.2s"
            >
              <AiFillHeart size={20} />
              <span>Улюблені</span>
            </Button>
          )}
        </NavLink>
        {user && (
          <NavLink to="/add-song">
            {({ isActive }) => (
              <Button
                bg={isActive ? "highlight.main" : "transparent"}
                color={isActive ? "white" : "accent.main"}
                _hover={
                  isActive
                    ? { bg: "highlight.dark" }
                    : { bg: "primary.700", color: "white" }
                }
                rounded="lg"
                display="inline-flex"
                alignItems="center"
                justifyContent="flex-start"
                gap={6}
                w="full"
                py={6}
                px={4}
                transition="all 0.2s"
              >
                <BiMusic size={20} />
                <span>Додати пісню</span>
              </Button>
            )}
          </NavLink>
        )}
      </Flex>
      <Divider
        bg="primary.700"
        border="5"
        mt={{ base: 12, md: 6, lg: 12 }}
        h="1px"
        mb={4}
      />
      <Box>
        {user ? (
          <Box p={3}>
            <Flex align="center" gap={4} color="accent.main">
              <HiOutlineUserCircle size={20} color="inherit" />
              <Text color="inherit" fontSize="sm">
                {user?.username}
              </Text>
            </Flex>
            <Button
              onClick={handleLogout}
              mt={{ base: 8, md: 4, lg: 8 }}
              variant="ghost"
              color="accent.main"
              _hover={{ bg: "primary.700", color: "white" }}
              display="inline-flex"
              alignItems="center"
              fontWeight={400}
              gap={3}
              transition="all 0.2s"
            >
              <AiOutlineLogout size={20} /> Вийти
            </Button>
          </Box>
        ) : (
          <Button
            onClick={gotoLogin}
            variant="outline"
            rounded="lg"
            w="full"
            borderColor="primary.700"
            color="accent.main"
            _hover={{ bg: "primary.700", borderColor: "primary.600", color: "white" }}
            fontSize="sm"
            py={2}
            px={5}
            transition="all 0.2s"
          >
            Увійти
          </Button>
        )}
      </Box>
    </Box>
  );
};

const Navbar = () => {
  // Отримуємо розмір вікна для умовної логіки
  const breakpoint = useBreakpointValue({ base: "mobile", md: "tablet", lg: "desktop" });

  return (
    <>
      {breakpoint === "mobile" && <MobileNav />}
      {breakpoint === "tablet" && <TabletNav />}
      {breakpoint === "desktop" && <DesktopNav />}
    </>
  );
};

export default Navbar;
