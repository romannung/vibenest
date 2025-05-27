import { useRef, useState } from 'react';
import {
    Box, Button, Container, FormControl, FormLabel, Input, VStack,
    Heading, useToast, Text, Image, SlideFade, useColorModeValue
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

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

    const audioFileRef = useRef(null); // реф для форми
    const toast = useToast();
    const navigate = useNavigate();
    const textColor = useColorModeValue('gray.800', 'white');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const showError = (msg) => {
        toast({
            title: "Помилка!",
            description: msg,
            status: "error",
            duration: 3000,
            isClosable: true,
        });
    };

    const handleFile = (file, type) => {
        if (type === 'audio') {
            if (!file.type.startsWith('audio/')) {
                showError("Будь ласка, виберіть аудіо файл");
                return;
            }
            setAudioFile(file);
            audioFileRef.current = file;

            const audio = new Audio();
            audio.src = URL.createObjectURL(file);
            audio.onloadedmetadata = () => {
                const minutes = Math.floor(audio.duration / 60);
                const seconds = Math.floor(audio.duration % 60);
                setFormData(prev => ({
                    ...prev,
                    duration: `${minutes}:${seconds.toString().padStart(2, '0')}`
                }));
            };
        } else if (type === 'image') {
            if (!file.type.startsWith('image/')) {
                showError("Будь ласка, виберіть файл зображення");
                return;
            }
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleFileDrop = (e, type) => {
        e.preventDefault();
        if (e.dataTransfer && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            handleFile(file, type);
            e.dataTransfer.clearData();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        if (!formData.title.trim() || !formData.artistes.trim()) {
            showError("Будь ласка, заповніть всі обов'язкові поля");
            setSubmitting(false);
            return;
        }

        if (!audioFileRef.current) {
            showError("Будь ласка, завантажте аудіо файл");
            setSubmitting(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title.trim());
            formDataToSend.append('duration', formData.duration.trim());
            formDataToSend.append('artistes', JSON.stringify(formData.artistes.split(',').map(a => a.trim())));
            formDataToSend.append('file', audioFileRef.current);

            if (imageFile) {
                formDataToSend.append('image', imageFile);
            } else if (formData.coverImage.trim()) {
                formDataToSend.append('coverImage', formData.coverImage.trim());
            }

            const response = await fetch('http://localhost:5000/api/songs/create', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Помилка при створенні пісні');
            }

            toast({
                title: "Успіх!",
                description: "Пісню успішно додано",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            // reset
            setFormData({ title: '', duration: '', coverImage: '', artistes: '' });
            setAudioFile(null);
            audioFileRef.current = null;
            setImageFile(null);
            setPreviewImage('');
            navigate('/home');
        } catch (error) {
            showError(error.message || 'Помилка при відправці форми. Спробуйте ще раз.');
        } finally {
            setSubmitting(false);
        }
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
        <Box minH="100vh" overflowY="auto" pb="150px" pl="50px">
            <Container maxW="container.md" py={8}>
                <SlideFade in offsetY={20}>
                    <VStack spacing={8} align="stretch" w="full" color={textColor}>
                        <Heading as="h1" size="lg">Додати нову пісню</Heading>
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={6} w="full">
                                <FormControl isRequired>
                                    <FormLabel color="white">Назва пісні</FormLabel>
                                    <Input name="title" value={formData.title} onChange={handleChange} color="white" />
                                </FormControl>

                                <FormControl>
                                    <FormLabel color="white">Тривалість</FormLabel>
                                    <Input name="duration" value={formData.duration} readOnly color="white" />
                                </FormControl>

                                <FormControl>
                                    <FormLabel color="white">Обкладинка (Drag & Drop або вибір)</FormLabel>
                                    <Box
                                        position="relative"
                                        border="2px dashed #ffffff"
                                        p={4}
                                        textAlign="center"
                                        borderRadius="md"
                                        onDrop={(e) => handleFileDrop(e, 'image')}
                                        onDragOver={(e) => e.preventDefault()}
                                        cursor="pointer"
                                        color="#C05621"
                                        fontWeight="bold"
                                    >
                                        <Text>Перетягніть зображення сюди</Text>
                                        <Button mt={3} bg="#C05621" color="white" _hover={{ bg: "#9C4221" }} as="label">
                                            Вибрати файл
                                            <Input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files[0], 'image')} sx={fileInputStyles} />
                                        </Button>
                                    </Box>
                                    <Text fontSize="sm" mt={2}>або вставте URL зображення:</Text>
                                    <Input name="coverImage" value={formData.coverImage} onChange={handleChange} type="url" color="white" />
                                    {previewImage && (
                                        <Box mt={2}>
                                            <Image src={previewImage} alt="Preview" maxH="200px" objectFit="contain" />
                                        </Box>
                                    )}
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel color="white">Виконавці (через кому)</FormLabel>
                                    <Input name="artistes" value={formData.artistes} onChange={handleChange} color="white" />
                                </FormControl>

                                <FormControl>
                                    <FormLabel color="white">Аудіо файл (Drag & Drop або вибір)</FormLabel>
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
                                        <Text>Перетягніть аудіо файл сюди</Text>
                                        <Button mt={3} bg="#C05621" color="white" _hover={{ bg: "#9C4221" }} as="label">
                                            Вибрати файл
                                            <Input type="file" accept="audio/*" onChange={(e) => handleFile(e.target.files[0], 'audio')} sx={fileInputStyles} />
                                        </Button>
                                        {audioFile && (
                                            <Text fontSize="sm" color="green.300" mt={1}>
                                                Вибрано файл: {audioFile.name}
                                            </Text>
                                        )}
                                    </Box>
                                </FormControl>

                                <Button mt={4} bg="#C05621" color="white" _hover={{ bg: "#9C4221" }} type="submit" w="full" isLoading={submitting}>
                                    Додати пісню
                                </Button>
                            </VStack>
                        </form>
                    </VStack>
                </SlideFade>
            </Container>
        </Box>
    );
};

export default AddSongForm;
