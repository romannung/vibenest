import React from 'react';
import { Flex, Image, Text, VStack } from '@chakra-ui/react';

const TrackDetails = ({ track, onDoubleClick }) => {
  if (!track) return null;

  return (
    <Flex
      align="center"
      gap={4}
      cursor="pointer"
      onDoubleClick={onDoubleClick}
      _hover={{ opacity: 0.8 }}
    >
      <Image
        src={track.coverImage}
        alt={track.title}
        boxSize={{ base: '40px', md: '60px' }}
        objectFit="cover"
        rounded="md"
      />
      <VStack align="start" spacing={0}>
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          fontWeight="medium"
          color="white"
          noOfLines={1}
        >
          {track.title}
        </Text>
        <Text
          fontSize={{ base: 'xs', md: 'sm' }}
          color="gray.400"
          noOfLines={1}
        >
          {track.artistes?.join(', ')}
        </Text>
      </VStack>
    </Flex>
  );
};

export default TrackDetails;