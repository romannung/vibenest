import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Input,
    VStack,
    Text,
    Flex,
    Image,
    IconButton,
    Divider,
    useToast,
    InputGroup,
    InputLeftElement
} from '@chakra-ui/react';
import { FaSearch, FaPlus, FaArrowUp, FaArrowDown, FaCheck } from 'react-icons/fa';
import { client } from '../api';

const EditPlaylist = ({ playlistId, onUpdate }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [songs, setSongs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    // Fetch playlist data
    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await client.get(`/playlists/${playlistId}`);
                const { title, description, songs } = response.data;
                setTitle(title);
                setDescription(description);
                setSongs(songs);
            } catch (error) {
                console.error('Error fetching playlist:', error);
                toast({
                    title: 'Помилка',
                    description: 'Не вдалося завантажити плейлист',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        };
        fetchPlaylist();
    }, [playlistId]);

    // Search songs
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        
        setLoading(true);
        try {
            const response = await client.get('/songs');
            const allSongs = response.data;
            
            // Filter songs based on search query
            const filteredSongs = allSongs.filter(song => 
                song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                song.artistes.some(artist => 
                    artist.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
            
            // Remove songs that are already in the playlist
            const newSearchResults = filteredSongs.filter(
                song => !songs.some(playlistSong => playlistSong._id === song._id)
            );
            
            setSearchResults(newSearchResults);
        } catch (error) {
            console.error('Error searching songs:', error);
            toast({
                title: 'Помилка',
                description: 'Не вдалося знайти пісні',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // Add song to playlist
    const handleAddSong = (song) => {
        setSongs([...songs, song]);
        setSearchResults(searchResults.filter(s => s._id !== song._id));
        toast({
            title: 'Успішно',
            description: 'Пісню додано до плейлиста',
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
    };

    // Move song up in playlist
    const handleMoveUp = (index) => {
        if (index === 0) return;
        const newSongs = [...songs];
        [newSongs[index], newSongs[index - 1]] = [newSongs[index - 1], newSongs[index]];
        setSongs(newSongs);
    };

    // Move song down in playlist
    const handleMoveDown = (index) => {
        if (index === songs.length - 1) return;
        const newSongs = [...songs];
        [newSongs[index], newSongs[index + 1]] = [newSongs[index + 1], newSongs[index]];
        setSongs(newSongs);
    };

    // Save playlist changes
    const handleSave = async () => {
        try {
            await client.patch(`/playlists/${playlistId}`, {
                title,
                description,
                songIds: songs.map(song => song._id)
            });
            
            toast({
                title: 'Успішно',
                description: 'Плейлист збережено',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error saving playlist:', error);
            toast({
                title: 'Помилка',
                description: 'Не вдалося зберегти плейлист',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box>
            <VStack spacing={4} align="stretch" mb={8}>
                <Input
                    placeholder="Назва плейлиста"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <Input
                    placeholder="Опис плейлиста (необов'язково)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </VStack>

            <Text mb={2} fontWeight="bold">Пісні</Text>
            <VStack spacing={2} align="stretch" mb={6}>
                {songs.map((song, index) => (
                    <Flex key={song._id} align="center" bg="whiteAlpha.100" p={2} borderRadius="md">
                        <Image
                            src={song.coverImage}
                            alt={song.title}
                            boxSize="40px"
                            objectFit="cover"
                            borderRadius="md"
                            mr={3}
                        />
                        <Box flex={1}>
                            <Text>{song.title}</Text>
                            <Text fontSize="sm" color="gray.500">
                                {song.artistes.join(', ')}
                            </Text>
                        </Box>
                        <IconButton
                            icon={<FaArrowUp />}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveUp(index)}
                            isDisabled={index === 0}
                            aria-label="Move up"
                        />
                        <IconButton
                            icon={<FaArrowDown />}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveDown(index)}
                            isDisabled={index === songs.length - 1}
                            aria-label="Move down"
                        />
                    </Flex>
                ))}
            </VStack>

            <Divider my={4} />

            <Text mb={2} fontWeight="bold">Додати пісні</Text>
            <InputGroup mb={4}>
                <InputLeftElement>
                    <FaSearch />
                </InputLeftElement>
                <Input
                    placeholder="Пошук пісень..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                    ml={2}
                    onClick={handleSearch}
                    isLoading={loading}
                >
                    Пошук
                </Button>
            </InputGroup>

            <VStack spacing={2} align="stretch" mb={6}>
                {searchResults.map(song => (
                    <Flex key={song._id} align="center" bg="whiteAlpha.50" p={2} borderRadius="md">
                        <Image
                            src={song.coverImage}
                            alt={song.title}
                            boxSize="40px"
                            objectFit="cover"
                            borderRadius="md"
                            mr={3}
                        />
                        <Box flex={1}>
                            <Text>{song.title}</Text>
                            <Text fontSize="sm" color="gray.500">
                                {song.artistes.join(', ')}
                            </Text>
                        </Box>
                        <IconButton
                            icon={<FaPlus />}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddSong(song)}
                            aria-label="Add song"
                        />
                    </Flex>
                ))}
            </VStack>

            <Button
                leftIcon={<FaCheck />}
                colorScheme="green"
                onClick={handleSave}
                width="full"
            >
                Зберегти
            </Button>
        </Box>
    );
};

export default EditPlaylist; 