import { useState, useRef } from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
    useToast,
    Text,
    Image,
    SlideFade,
    useColorModeValue,
    HStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Flex,
    Editable,
    EditablePreview,
    EditableInput,
    useEditableControls,
    ButtonGroup,
    IconButton as ChakraIconButton,
    Flex as ChakraFlex,
    Tooltip
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { client } from '../api';
import { useSelector } from 'react-redux';
import { parseBlob } from 'music-metadata';
import { DeleteIcon, CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';

const EditableControls = () => {
    const {
        isEditing,
        getSubmitButtonProps,
        getCancelButtonProps,
        getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
        <ButtonGroup justifyContent="center" size="sm">
            <ChakraIconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
            <ChakraIconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
        </ButtonGroup>
    ) : (
        <ChakraFlex justifyContent="center">
            <ChakraIconButton size="sm" icon={<EditIcon />} {...getEditButtonProps()} />
        </ChakraFlex>
    );
};

const EditableCell = ({ value, onChange }) => {
    return (
        <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            size="sm"
            variant="unstyled"
            _hover={{ bg: 'whiteAlpha.200' }}
            _focus={{ bg: 'whiteAlpha.300' }}
            px={2}
            py={1}
            borderRadius="md"
            color="white"
            _placeholder={{ color: 'whiteAlpha.600' }}
        />
    );
};

const EditableCover = ({ imageFile, previewImage, onChange }) => {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            onChange(file);
        }
    };

    return (
        <Box position="relative" cursor="pointer" onClick={handleClick}>
            <Image
                src={previewImage}
                alt="Cover"
                boxSize="50px"
                objectFit="cover"
                borderRadius="md"
                _hover={{ opacity: 0.8 }}
            />
            <Tooltip label="Змінити обкладинку" placement="top">
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    opacity={0}
                    _groupHover={{ opacity: 1 }}
                    transition="opacity 0.2s"
                >
                    <EditIcon color="white" boxSize={4} />
                </Box>
            </Tooltip>
            <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                display="none"
            />
        </Box>
    );
};

const AddSongForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        duration: '',
        coverImage: '',
        artistes: ''
    });
    const [audioFile, setAudioFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [hasEmbeddedCover, setHasEmbeddedCover] = useState(false);
    const [songsList, setSongsList] = useState([]);
    const toast = useToast();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.user);

    const textColor = useColorModeValue('gray.800', 'white');

    const resetForm = () => {
        setFormData({
            title: '',
            duration: '',
            coverImage: '',
            artistes: ''
        });
        setAudioFile(null);
        setImageFile(null);
        setPreviewImage('');
        setHasEmbeddedCover(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileDrop = (e, type) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            if (type === 'audio') {
                handleMultipleFiles(files);
            } else {
                handleFile(files[0], type);
            }
        }
    };

    const handleMultipleFiles = async (files) => {
        for (const file of files) {
            if (!file.type.startsWith('audio/')) {
                toast({
                    title: "Помилка!",
                    description: `Файл ${file.name} не є аудіо файлом`,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                continue;
            }
            await processAudioFile(file);
        }
    };

    const processAudioFile = async (file) => {
        try {
            const metadata = await parseBlob(file);
            const audio = new Audio();
            audio.src = URL.createObjectURL(file);
            
            const duration = await new Promise((resolve) => {
                audio.onloadedmetadata = () => {
                    const minutes = Math.floor(audio.duration / 60);
                    const seconds = Math.floor(audio.duration % 60);
                    resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
                };
            });

            const songData = {
                title: metadata.common.title || file.name.replace(/\.[^/.]+$/, ""),
                duration: duration,
                artistes: metadata.common.artists ? metadata.common.artists.join(', ') : 
                        metadata.common.artist || '',
                audioFile: file,
                imageFile: null,
                previewImage: '',
                hasEmbeddedCover: false
            };

            if (metadata.common.picture && metadata.common.picture.length > 0) {
                const picture = metadata.common.picture[0];
                const blob = new Blob([picture.data], { type: picture.format });
                songData.imageFile = new File([blob], 'cover.' + picture.format.split('/')[1], { type: picture.format });
                songData.previewImage = URL.createObjectURL(blob);
                songData.hasEmbeddedCover = true;
            }

            setSongsList(prev => [...prev, songData]);
        } catch (error) {
            console.error('Помилка обробки файлу:', error);
            toast({
                title: "Помилка!",
                description: `Не вдалося обробити файл ${file.name}`,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleFile = async (file, type) => {
        if (type === 'audio') {
            await processAudioFile(file);
        } else if (type === 'image') {
            if (!file.type.startsWith('image/')) {
                toast({
                    title: "Помилка!",
                    description: "Будь ласка, виберіть файл зображення",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
            setHasEmbeddedCover(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!token) {
            toast({
                title: "Помилка",
                description: "Будь ласка, увійдіть щоб додати пісню",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!audioFile) {
            toast({
                title: "Помилка",
                description: "Будь ласка, виберіть аудіо файл",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('duration', formData.duration);
            formDataToSend.append('artistes', formData.artistes);
            formDataToSend.append('file', audioFile);
            
            if (imageFile) {
                formDataToSend.append('image', imageFile);
            } else if (formData.coverImage) {
                formDataToSend.append('coverImage', formData.coverImage);
            }

            await client.post('/songs/create', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            toast({
                title: "Успішно",
                description: "Пісню додано",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            resetForm();
        } catch (error) {
            console.error('Error adding song:', error);
            toast({
                title: "Помилка",
                description: "Не вдалося додати пісню",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitAll = async () => {
        if (!token) {
            toast({
                title: "Помилка",
                description: "Будь ласка, увійдіть щоб додати пісні",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (songsList.length === 0) {
            toast({
                title: "Помилка",
                description: "Немає пісень для додавання",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setSubmitting(true);

        try {
            for (const song of songsList) {
                const formDataToSend = new FormData();
                formDataToSend.append('title', song.title);
                formDataToSend.append('duration', song.duration);
                formDataToSend.append('artistes', song.artistes);
                formDataToSend.append('file', song.audioFile);
                
                if (song.imageFile) {
                    formDataToSend.append('image', song.imageFile);
                }

                await client.post('/songs/create', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            toast({
                title: "Успішно",
                description: `Додано ${songsList.length} пісень`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            setSongsList([]);
            navigate('/');
        } catch (error) {
            console.error('Error adding songs:', error);
            toast({
                title: "Помилка",
                description: "Не вдалося додати пісні",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setSubmitting(false);
        }
    };

    const removeSong = (index) => {
        setSongsList(prev => prev.filter((_, i) => i !== index));
    };

    const updateSongData = (index, field, value) => {
        setSongsList(prev => prev.map((song, i) => 
            i === index ? { ...song, [field]: value } : song
        ));
    };

    const updateSongCover = (index, file) => {
        const previewUrl = URL.createObjectURL(file);
        setSongsList(prev => prev.map((song, i) => 
            i === index ? { 
                ...song, 
                imageFile: file,
                previewImage: previewUrl,
                hasEmbeddedCover: false
            } : song
        ));
    };

    const fileInputStyles = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        cursor: 'pointer',
        zIndex: 2,
    };

    return (
        <Box
            minH="100vh"
            overflowY="auto"
            pb="150px"
            pl="50px"
        >
            <Container maxW="container.md" py={8}>
                <SlideFade in offsetY={20}>
                    <VStack spacing={8} align="stretch" w="full" color={textColor}>
                        <Heading as="h1" size="lg">Додати нові пісні</Heading>
                        
                        <Box
                            position="relative"
                            border="2px dashed #ffffff"
                            p={4}
                            textAlign="center"
                            borderRadius="md"
                            onDrop={(e) => handleFileDrop(e, 'audio')}
                            onDragOver={(e) => e.preventDefault()}
                            cursor="pointer"
                            color="#C05621"
                            fontWeight="bold"
                        >
                            <Text>Перетягніть аудіо файли сюди</Text>
                            <Button
                                mt={3}
                                bg="#C05621"          
                                color="white"
                                _hover={{ bg: "#9C4221" }}
                                variant="solid"
                                fontWeight="bold"
                                px={6}
                                as="label"
                                cursor="pointer"
                            >
                                Вибрати файли
                                <Input
                                    type="file"
                                    accept="audio/*"
                                    multiple
                                    onChange={(e) => handleMultipleFiles(Array.from(e.target.files))}
                                    sx={fileInputStyles}
                                />
                            </Button>
                        </Box>

                        {songsList.length > 0 && (
                            <Box>
                                <Heading as="h2" size="md" mb={4}>Список пісень для додавання</Heading>
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th color="white">Обкладинка</Th>
                                            <Th color="white">Назва</Th>
                                            <Th color="white">Виконавці</Th>
                                            <Th color="white">Тривалість</Th>
                                            <Th color="white">Дії</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {songsList.map((song, index) => (
                                            <Tr key={index}>
                                                <Td>
                                                    {song.previewImage && (
                                                        <EditableCover
                                                            imageFile={song.imageFile}
                                                            previewImage={song.previewImage}
                                                            onChange={(file) => updateSongCover(index, file)}
                                                        />
                                                    )}
                                                </Td>
                                                <Td>
                                                    <EditableCell 
                                                        value={song.title} 
                                                        onChange={(value) => updateSongData(index, 'title', value)} 
                                                    />
                                                </Td>
                                                <Td>
                                                    <EditableCell 
                                                        value={song.artistes} 
                                                        onChange={(value) => updateSongData(index, 'artistes', value)} 
                                                    />
                                                </Td>
                                                <Td>
                                                    <EditableCell 
                                                        value={song.duration} 
                                                        onChange={(value) => updateSongData(index, 'duration', value)} 
                                                    />
                                                </Td>
                                                <Td>
                                                    <IconButton
                                                        icon={<DeleteIcon />}
                                                        onClick={() => removeSong(index)}
                                                        aria-label="Видалити пісню"
                                                        colorScheme="red"
                                                        size="sm"
                                                    />
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                                <Button
                                    mt={4}
                                    bg="#C05621"          
                                    color="white"
                                    _hover={{ bg: "#9C4221" }}
                                    onClick={handleSubmitAll}
                                    isLoading={submitting}
                                    w="full"
                                    fontWeight="bold"
                                >
                                    Додати всі пісні
                                </Button>
                            </Box>
                        )}
                    </VStack>
                </SlideFade>
            </Container>
        </Box>
    );
};

export default AddSongForm;
