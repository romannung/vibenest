import { useState } from 'react';
import {
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
    useToast,
    Box,
    Image,
    Text
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
    const toast = useToast();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        if (type === 'audio') {
            if (!file.type.startsWith('audio/')) {
                toast({
                    title: "Помилка!",
                    description: "Будь ласка, виберіть аудіо файл",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }
            setAudioFile(file);
            // Автоматично встановлюємо тривалість аудіо
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
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!audioFile) {
            toast({
                title: "Помилка!",
                description: "Будь ласка, завантажте аудіо файл",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!formData.title || !formData.duration || !formData.artistes) {
            toast({
                title: "Помилка!",
                description: "Будь ласка, заповніть всі обов'язкові поля",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title.trim());
        formDataToSend.append('duration', formData.duration.trim());
        formDataToSend.append('artistes', JSON.stringify(formData.artistes.split(',').map(artist => artist.trim())));
        formDataToSend.append('file', audioFile);
        
        if (imageFile) {
            formDataToSend.append('image', imageFile);
        } else if (formData.coverImage) {
            formDataToSend.append('coverImage', formData.coverImage.trim());
        }

        try {
            const response = await fetch('http://localhost:5000/api/songs/create', {
                method: 'POST',
                body: formDataToSend
            });

            const contentType = response.headers.get("content-type");
            if (!response.ok) {
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Помилка при створенні пісні");
                } else {
                    throw new Error("Помилка сервера");
                }
            }

            await response.json(); // Just consume the response
            
            toast({
                title: "Успіх!",
                description: "Пісню успішно додано",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            
            setFormData({
                title: '',
                duration: '',
                coverImage: '',
                artistes: ''
            });
            setAudioFile(null);
            setImageFile(null);
            setPreviewImage('');
            navigate("/home");
        } catch (error) {
            console.error('Error submitting form:', error);
            toast({
                title: "Помилка!",
                description: error.message || "Помилка при відправці форми. Спробуйте ще раз.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="container.md" py={8} maxH="calc(100vh - 180px)" overflowY="auto">
            <VStack spacing={8} align="stretch" minH="min-content" w="full">
                <Heading as="h1" size="lg">
                    Додати нову пісню
                </Heading>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={6} w="full">
                        <FormControl isRequired>
                            <FormLabel>Назва пісні</FormLabel>
                            <Input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Введіть назву пісні"
                            />
                        </FormControl>
                        
                        <FormControl isRequired>
                            <FormLabel>Тривалість</FormLabel>
                            <Input
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="3:45"
                                readOnly={!!audioFile}
                            />
                        </FormControl>
                        
                        <FormControl>
                            <FormLabel>Обкладинка</FormLabel>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'image')}
                                p={1}
                            />
                            <Text fontSize="sm" color="gray.500" mt={1}>
                                або вставте URL зображення:
                            </Text>
                            <Input
                                name="coverImage"
                                value={formData.coverImage}
                                onChange={handleChange}
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                mt={2}
                            />
                            {previewImage && (
                                <Box mt={2}>
                                    <Image 
                                        src={previewImage} 
                                        alt="Preview" 
                                        maxH="200px"
                                        objectFit="contain"
                                    />
                                </Box>
                            )}
                        </FormControl>
                        
                        <FormControl isRequired>
                            <FormLabel>Виконавці (через кому)</FormLabel>
                            <Input
                                name="artistes"
                                value={formData.artistes}
                                onChange={handleChange}
                                placeholder="Виконавець 1, Виконавець 2"
                            />
                        </FormControl>
                        
                        <FormControl isRequired>
                            <FormLabel>Аудіо файл</FormLabel>
                            <Input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => handleFileChange(e, 'audio')}
                                p={1}
                            />
                            {audioFile && (
                                <Text fontSize="sm" color="green.500" mt={1}>
                                    Вибрано файл: {audioFile.name}
                                </Text>
                            )}
                        </FormControl>
                        
                        <Button
                            mt={4}
                            colorScheme="blue"
                            type="submit"
                            w="full"
                        >
                            Додати пісню
                        </Button>
                    </VStack>
                </form>
            </VStack>
        </Container>
    );
};

export default AddSongForm; 