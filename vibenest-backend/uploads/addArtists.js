import mongoose from "mongoose";
import Artiste from "../models/Artiste.js";
import dotenv from "dotenv";

dotenv.config();

const addArtists = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const artists = [
            {
                name: "Arctic Monkeys",
                image: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Feskipaper.com%2Fimages%2Farctic-monkeys-2.jpg&f=1&nofb=1&ipt=d3a86c29bfc4d55e7f76332b1f249d6c89de0e24e0fea59a7a4842e065a22f79",
                bio: "Arctic Monkeys — англійський рок-гурт, створений у 2002 році в передмісті Шеффілда. Їхній дебютний альбом встановив рекорд за кількістю проданих копій у перший тиждень у Великій Британії. Гурт відомий поєднанням різних музичних стилів, а також харизматичним вокалом Алекса Тернера. Arctic Monkeys стали одними з найвпливовіших британських гуртів 2000-х років.",
                type: "Artiste"
            },
            {
                name: "Post Malone",
                image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F9c%2F54%2F9c%2F9c549c72183e9e2d4a01f9488442b0e6.jpg&f=1&nofb=1&ipt=40724e46b66484c2a474f6b648c642a1049de1ec470fe5b89cb32442ba630634",
                bio: "Post Malone (Остін Річард Пост) — американський репер, співак, автор пісень і продюсер. Народився в Сіракузах, Нью-Йорк, а згодом переїхав до Техасу. Відомий поєднанням хіп-хопу, року та поп-музики. Його дебютний альбом 'Stoney' (2016) приніс йому світову популярність, а наступні релізи закріпили статус одного з найуспішніших артистів свого покоління.",
                type: "Artiste"
            },
            {
                name: "Calvin Harris",
                image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0387%2F3509%2Fproducts%2Fcalvin-harris-summer_remix_cd_grande.jpg%3Fv%3D1453860394&f=1&nofb=1&ipt=931174b1d30ecc5ab7e380b921bc0a77a8ba1dddcd0db6b978658d2e0b16cd5f",
                bio: "Calvin Harris (Адам Річард Вайлс) — шотландський діджей, музичний продюсер та автор пісень. Його дебютний альбом 'I Created Disco' став золотим, а третій альбом '18 Months' приніс світову славу, встановивши рекорд за кількістю хітів у топ-10 британських чартів. Харріс відомий співпрацею з багатьма зірками поп-музики та танцювальної сцени.",
                type: "Artiste"
            },
            {
                name: "Мотор'ролла",
                image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FyA7ZsajYUNA%2Fhqdefault.jpg%3Fsqp%3D-oaymwEmCOADEOgC8quKqQMa8AEB-AHOBYAC0AWKAgwIABABGH8gEygXMA8%3D%26amp%3Brs%3DAOn4CLCJA92_uPCNf36W4ZlDxVvMjJe7Pw&f=1&nofb=1&ipt=f92544d457c2e0ed980417396e6dd8c99d1a70ced88067f0ff6d5f2733af1d3e",
                bio: "Мотор'ролла — український рок-гурт з Хмельницького, заснований у 1994 році. Назва гурту походить від поєднання слів 'мотоцикли' та 'рок-н-рол'. Відомі своїм енергійним звучанням та патріотичними текстами, гурт випустив кілька альбомів, серед яких 'Забави патріотів' та 'Тиск'.",
                type: "Artiste"
            },
            {
                name: "FliT",
                image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flyricstranslate.com%2Ffiles%2Fstyles%2Fartist%2Fpublic%2Fflit.jpg&f=1&nofb=1&ipt=1359d0615d7c4ad8881159a7e69a81081c4433325c2d7465e09dcc88fa00b59e",
                bio: "FliT — українсько-американський панк-рок гурт, створений у 2001 році в Івано-Франківську. Відомі своїм унікальним стилем 'інтелігентного панку' та енергійними живими виступами. Гурт активно гастролював Європою, а їхня пісня 'Їжачок' стала візитівкою колективу.",
                type: "Artiste"
            },
            {
                name: "Друга Ріка",
                image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fafishamira.com%2Fwp-content%2Fuploads%2F2023%2F10%2Fdruga-rika--e1697295495574-768x511.jpeg&f=1&nofb=1&ipt=fbff4328a876bc3724e0fbd822a787392d5c3c32b06bbe83e8aa47afad652c61",
                bio: "Друга Ріка — український рок-гурт, заснований у Житомирі наприкінці 1990-х років. Перший альбом 'Я є' вийшов у 2000 році та швидко приніс популярність. Гурт відомий своїми глибокими текстами та мелодійним звучанням, а також численними хітами, що стали класикою української рок-музики.",
                type: "Artiste"
            },
            {
                name: "KOSMOPOLIS",
                image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fviberate-upload.ams3.cdn.digitaloceanspaces.com%2Fprod%2Fentity%2Fartist%2Fkosmopolis-kRQep&f=1&nofb=1&ipt=ce277174309a6fbab777d327d6f2f396ff9b00a92697973d1aa64aecce39eb4d",
                bio: "KOSMOPOLIS — сучасний український гурт, що експериментує з різними жанрами, поєднуючи електроніку, рок і поп. Відомі своїми яскравими сценічними шоу та оригінальним підходом до створення музики. Гурт активно виступає на фестивалях та має віддану аудиторію.",
                type: "Artiste"
            },
            {
                name: "ТНМК (Танок на Майдані Конґо)",
                image: "https://content.rozetka.com.ua/goods/images/big/246920110.jpg",
                bio: "ТНМК (Танок на Майдані Конґо) — культовий український гурт, який поєднує хіп-хоп, рок, фанк і джаз. Заснований у Харкові 1989 року. Відомий дотепними текстами, живими інструментами та експериментами зі звучанням. ТНМК — учасники багатьох фестивалів, лауреати численних музичних премій, їхній альбом 'Зроби мені хіп-хоп' став класикою української сцени.",
                type: "Artiste"
            }
        ];

        for (const artist of artists) {
            const existingArtist = await Artiste.findOne({ name: artist.name });
            if (!existingArtist) {
                const newArtist = new Artiste(artist);
                const savedArtist = await newArtist.save();
                console.log(`${artist.name} added successfully:`, savedArtist);
            } else {
                console.log(`${artist.name} already exists in the database`);
            }
        }
        
        console.log('All artists processed');
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

addArtists(); 