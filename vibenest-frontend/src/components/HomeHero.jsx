import { Box, Flex, Heading, Text, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
 {
  img: "/hero-section.jpg",
  title: "Чудові Плейлисти",
  desc: "Слухайте найкращі плейлисти, створені нами та нашими користувачами."
 },
 {
  img: "/hero-section-1.jpg",
  title: "Відкрий нову музику",
  desc: "Знаходь улюблені треки та відкривай нові хіти щодня!"
 },
 {
  img: "/hero-section-2.jpg",
  title: "Тільки найкраще",
  desc: "Ми обираємо для вас найякіснішу музику без реклами."
 },
 {
  img: "/hero-section-3.jpg",
  title: "Музика для настрою",
  desc: "Підбирай саундтрек під будь-який настрій та момент."
 },
 {
  img: "/hero-section-4.jpg",
  title: "Ділись з друзями",
  desc: "Створюй власні плейлисти та ділись ними з іншими."
 }
];

const HomeHero = () => {
 const [index, setIndex] = useState(0);

 useEffect(() => {
  const interval = setInterval(() => {
   setIndex((prev) => (prev + 1) % slides.length);
  }, 5000);
  return () => clearInterval(interval);
 }, []);

 return (
  <Box
   h={96}
   rounded="lg"
   pos="relative"
   overflow="hidden"
   boxShadow="2xl"
  >
   {slides.map((slide, i) => (
    <Box
     key={slide.img}
     pos="absolute"
     top={0}
     left={0}
     w="full"
     h="full"
     style={{
      opacity: index === i ? 1 : 0,
      zIndex: index === i ? 2 : 1,
      pointerEvents: index === i ? 'auto' : 'none',
      transition: "opacity 1.2s cubic-bezier(.4,0,.2,1)"
     }}
    >
     <img
      src={slide.img}
      alt="hero"
      style={{
       width: "100%",
       height: "100%",
       objectFit: "cover",
       position: "absolute",
       top: 0,
       left: 0,
       transition: "transform 2.5s cubic-bezier(.4,0,.2,1)",
       transform: index === i ? "scale(1.08)" : "scale(1)"
      }}
     />
     <Flex
      align="flex-end"
      pos="absolute"
      bottom={0}
      left={0}
      w="full"
      h="full"
      p={4}
      pb={6}
      bgGradient="linear(to-t, zinc.900, transparent)"
      zIndex={2}
     >
      <Box w="full" maxW={{ base: "95%", md: "70%" }}
       bg="rgba(0,0,0,0.55)"
       borderRadius="lg"
       px={{ base: 3, md: 8 }}
       py={{ base: 4, md: 6 }}
       style={{
        opacity: index === i ? 1 : 0,
        transform: index === i ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 1.2s, transform 1.2s"
       }}
      >
       <Heading
        as="h1"
        fontSize={{ base: "2xl", md: "4xl" }}
        fontWeight={700}
        mb={2}
        color="white"
        textShadow="0 2px 16px #000, 0 1px 1px #222"
       >
        {slide.title}
       </Heading>
       <Text fontSize={{ base: "sm", md: "md" }} color="white" textShadow="0 2px 8px #000" w="100%">
        {slide.desc}
       </Text>
       <Link to="/playlists">
        <Button
         bg="accent.main"
         color="white"
         fontWeight="bold"
         fontSize={{ base: "sm", md: "md" }}
         py={{ base: 3, md: 5 }}
         px={{ base: 5, md: 8 }}
         mt={4}
         rounded="md"
         _hover={{ bg: "accent.light" }}
         _active={{ bg: "highlight.main" }}
        >
         Слухати зараз
        </Button>
       </Link>
      </Box>
     </Flex>
    </Box>
   ))}
  </Box>
 );
};

export default HomeHero;