import React, { useState, useRef } from 'react';
import { FiStar, FiChevronLeft, FiChevronRight,FiArrowRight, FiX, FiHeart, FiMapPin, FiCalendar, FiPlus } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import P1 from '../assets/p1.jpg';
import P2 from '../assets/p2.jpg';
import P3 from '../assets/p5.jpg';
import D from '../assets/desert.jpg';
import M from '../assets/medina.jpg';
import F from '../assets/forest.jpg';
import T from '../assets/tajin.jpg';
import C from '../assets/cosco.jpg';
import H from '../assets/riathp.jpg';
import Z1 from '../assets/jam.jpg'
import Z2 from '../assets/bardo.jpg'

export const TestimonialsGallery = () => {
    const testimonials = [
        {
            id: 1,
            name: "Sophie Martin",
            procedure: "Greffe capillaire",
            rating: 5,
            comment: "Non seulement l'équipe médicale était exceptionnelle, mais j'ai pu visiter Sidi Bou Saïd pendant ma convalescence. Une expérience inoubliable !",
            avatar: P3,
            date: "Mai 2023",
            location: "Tunis",
            beforeAfter: [M, F] // Images avant/après
        },
        {
            id: 2,
            name: "Ahmed Johnson",
            procedure: "Chirurgie dentaire",
            rating: 4,
            comment: "Après mes implants dentaires, j'ai exploré le désert tunisien. Les médecins m'avaient bien conseillé sur les activités adaptées à ma convalescence.",
            avatar: P2,
            date: "Mars 2023",
            location: "Djerba",
            beforeAfter: [M, Z2]
        },
        {
            id: 3,
            name: "Marie Dupont",
            procedure: "FIV",
            rating: 5,
            comment: "Un parcours émotionnel magnifiquement accompagné. Pendant les attentes entre les procédures, les excursions à Hammamet m'ont permis de me détendre.",
            avatar: P1,
            date: "Février 2023",
            location: "Hammamet",
            beforeAfter: [D, Z1]
        }
    ];

    const gallery = [
        { id: 1, src: M, category: "paysages", title: "Médina de Tunis", description: "Inscrite au patrimoine mondial de l’UNESCO, la Médina de Tunis est l’un des plus beaux exemples de villes arabo-musulmanes bien conservées. Fondée au VIIe siècle, elle est le cœur historique et culturel de la capitale tunisienne.Ses ruelles étroites, ses souks colorés, ses mosquées majestueuses et ses palais cachés offrent une immersion totale dans plus de 1 000 ans d’histoire. C’est un lieu vibrant où l’artisanat, la gastronomie et l’hospitalité tunisienne se rencontrent dans un décor authentique et vivant." },
        { id: 2, src: H, category: "hôtels", title: "Hôtel Riath Palm", description: "Situé sur la magnifique côte de Sousse, en bordure d'une plage de sable fin, le Riadh Palm Hotel est un établissement 4 étoiles qui allie détente, loisirs et hospitalité tunisienne. Entouré de palmiers et doté d'une grande piscine lagon, l'hôtel offre un cadre idéal pour des vacances reposantes en famille, en couple ou entre amis.Ses chambres spacieuses avec vue sur mer ou jardin, son centre de bien-être, ses restaurants variés et ses animations quotidiennes font du Riadh Palm un lieu à la fois relaxant et vivant, au cœur de l’une des stations balnéaires les plus dynamiques de Tunisie.", badge: "" },
        { id: 3, src: C, category: "cuisine", title: "Couscous traditionnel", description: "Plat emblématique de la Tunisie et de tout le Maghreb, le couscous traditionnel est bien plus qu’un simple repas : c’est un rituel de partage, de famille et de générosité.Préparé à base de semoule de blé finement roulée à la main, il est accompagné d’un savoureux bouillon parfumé aux épices locales (ras el hanout, harissa, curcuma…), de légumes frais (carottes, courgettes, pois chiches) et de viandes tendres comme l’agneau, le poulet ou même le poisson dans les régions côtières.Chaque région a sa propre touche, mais toutes ont en commun ce goût réconfortant et authentique qui raconte l’histoire d’un peuple et de ses traditions." },
        { id: 4, src: D, category: "paysages", title: "Désert du Sahara", description: "Le Sahara tunisien, aux portes de l’infini, est une expérience inoubliable. Dunes dorées, silence envoûtant, oasis secrètes… ce désert offre un décor naturel d’une beauté saisissante, où le temps semble suspendu.Du coucher de soleil sur les dunes de Douz ou Ksar Ghilane, aux nuits sous les étoiles dans un camp berbère, chaque instant dans le Sahara est une invitation à la contemplation et à la reconnexion avec l’essentiel. C’est aussi une terre d’aventure : balades à dos de dromadaire, 4x4 dans les étendues sablonneuses, ou encore randonnées dans les ergs sauvages." },
        { id: 5, src: F, category: "paysages", title: "Forêt de Ain Draham", description: "Nichée dans les montagnes du nord-ouest tunisien, la forêt de Aïn Draham est un véritable écrin de verdure. Entourée de cèdres, de pins et de chênes-lièges, cette région au climat doux et humide contraste merveilleusement avec le reste du pays.Ancienne station thermale coloniale, Aïn Draham est aujourd’hui une destination prisée pour ses paysages montagneux, ses sentiers de randonnée, ses sources naturelles et son air pur. C’est l’endroit rêvé pour les amoureux de la nature, du calme et de l’authenticité." },
        { id: 6, src: T, category: "cuisine", title: "Tajine tunisien", description: "Contrairement à son homonyme marocain, le tajine tunisien est une spécialité unique, entre l’omelette et le gratin. Préparé à base d'œufs, de pommes de terre, de viande (souvent du poulet ou du thon), de fromage et d’épices locales, il est cuit au four jusqu’à obtenir une texture fondante à l’intérieur et dorée à l’extérieur.Parfumé, nourrissant et facile à emporter, le tajine tunisien est omniprésent dans la cuisine familiale comme dans les pique-niques ou les buffets traditionnels. Il reflète parfaitement l’art tunisien de transformer des ingrédients simples en plats riches en saveurs." },
        { id: 7, src: Z1, category: "monuments", title: "Amphi Theatre ALJAM", description: "Situé au cœur de la Tunisie, l’amphithéâtre d’El Jem est l’un des plus grands colisées jamais construits par l’Empire romain — et l’un des mieux conservés au monde. Classé au patrimoine mondial de l’UNESCO, ce monument impressionnant témoigne de la grandeur architecturale et culturelle de la Rome antique en Afrique du Nord. Construit au IIIe siècle, il pouvait accueillir jusqu’à 35 000 spectateurs venus assister à des combats de gladiateurs, des chasses d’animaux sauvages et des spectacles publics. Avec ses dimensions majestueuses et ses gradins en pierre taillée, El Jem rivalise avec le Colisée de Rome par sa beauté et son ingéniosité."},
        { id: 8, src: Z2, category: "monuments", title: "Musé Bardo", description: "Le Musée national du Bardo, situé à Tunis, est l’un des musées les plus prestigieux d’Afrique et du bassin méditerranéen. Installé dans un ancien palais beylical, il est célèbre pour abriter la plus grande collection de mosaïques romaines au monde, superbement conservées et présentées dans un cadre somptueux mêlant architecture ottomane et modernité muséale.Le musée retrace l’histoire de la Tunisie depuis la préhistoire jusqu’à l’époque islamique, en passant par les civilisations punique, romaine, byzantine et arabe. Chaque salle est une plongée dans un chapitre fascinant de l’histoire du pays." }
    ];

    const [activeCategory, setActiveCategory] = useState("tous");
    const [currentImage, setCurrentImage] = useState(null);
    const [expandedTestimonial, setExpandedTestimonial] = useState(null);
    const swiperRef = useRef(null);

    const filteredGallery = activeCategory === "tous" ? gallery : gallery.filter(item => item.category === activeCategory);

    const testimonialVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const galleryItemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: "backOut" }
        },
        hover: { scale: 1.03 }
    };

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Fond décoratif */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full  opacity-5"
                    style={{ backgroundImage: `url(${M})` }}
                ></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Titre animé */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center mb-16"
                >
                    <div className="inline-block relative mb-6">
                        <span className="relative z-10 text-lg font-semibold text-blue-600 tracking-wider">
                            TÉMOIGNAGES & DÉCOUVERTES
                        </span>
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute bottom-0 left-0 h-1 bg-blue-100 z-0"
                        />
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-800">
                            Expériences inoubliables

                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Découvrez les récits de nos patients et les trésors de la Tunisie qui rendent chaque séjour unique
                    </p>
                </motion.div>

                {/* Témoignages - Version Carousel Premium */}
                <div className="mb-24 relative">
                    <div className="absolute inset-y-0 left-0 z-20 flex items-center">
                        <button
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="p-2 rounded-full bg-white shadow-lg text-blue-600 hover:bg-blue-50 -ml-4"
                        >
                            <FiChevronLeft size={24} />
                        </button>
                    </div>

                    <Swiper
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        modules={[Navigation, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 }
                        }}
                        pagination={{ clickable: true }}
                        className="py-10 px-2"
                    >
                        {testimonials.map((testi) => (
                            <SwiperSlide key={testi.id}>
                                <motion.div
                                    variants={testimonialVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                                    className="h-full"
                                >
                                    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden h-full transition-all duration-300 ${expandedTestimonial === testi.id ? 'ring-4 ring-blue-400' : 'hover:shadow-2xl'}`}>
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={testi.avatar}
                                                alt={testi.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                            <div className="absolute top-4 left-4">
                                                <div className="flex items-center bg-white/90 backdrop-blur px-3 py-1 rounded-full">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FiStar
                                                            key={i}
                                                            className={`${i < testi.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} w-4 h-4`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="text-xl font-bold">{testi.name}</h3>
                                                <button
                                                    onClick={() => setExpandedTestimonial(expandedTestimonial === testi.id ? null : testi.id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <FiPlus className={`transition-transform ${expandedTestimonial === testi.id ? 'rotate-45' : ''}`} />
                                                </button>
                                            </div>
                                            <p className={`text-gray-600 mb-4 ${expandedTestimonial === testi.id ? '' : 'line-clamp-3'}`}>
                                                "{testi.comment}"
                                            </p>

                                            <AnimatePresence>
                                                {expandedTestimonial === testi.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="mb-4">
                                                            <h4 className="font-semibold text-gray-700 mb-2">Best place to visit</h4>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {testi.beforeAfter.map((img, i) => (
                                                                    <img
                                                                        key={i}
                                                                        src={img}
                                                                        alt={i === 0 ? "Avant" : "Après"}
                                                                        className="rounded-lg h-24 object-cover"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                                {testi.procedure}
                                                            </span>
                                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center">
                                                                <FiMapPin className="mr-1" /> {testi.location}
                                                            </span>
                                                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium flex items-center">
                                                                <FiCalendar className="mr-1" /> {testi.date}
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="absolute inset-y-0 right-0 z-20 flex items-center">
                        <button
                            onClick={() => swiperRef.current?.slideNext()}
                            className="p-2 rounded-full bg-white shadow-lg text-blue-600 hover:bg-blue-50 -mr-4"
                        >
                            <FiChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* Galerie Premium */}
                <div>
                    {/* Filtres élégants */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap justify-center gap-2 mb-12"
                    >
                        {["tous", "paysages", "hôtels", "cuisine", "monuments"].map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-5 py-2.5 rounded-full capitalize text-sm font-medium transition-all duration-300 ${activeCategory === category
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                                    }`}
                            >
                                {category === "tous" ? "Tout voir" : category}
                            </button>
                        ))}
                    </motion.div>

                    {/* Grille Masonry */}
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
                        {filteredGallery.map((item) => (
                            <motion.div
                                key={item.id}
                                variants={galleryItemVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                                className="break-inside-avoid relative group overflow-hidden rounded-2xl cursor-pointer"
                                onClick={() => setCurrentImage(item)}
                            >
                                <img
                                    src={item.src}
                                    alt={item.title}
                                    className="w-full h-auto object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                    <motion.h3
                                        initial={{ y: 20 }}
                                        whileHover={{ y: 0 }}
                                        className="text-white font-bold text-xl mb-1"
                                    >
                                        {item.title}
                                    </motion.h3>
                                    <motion.p
                                        initial={{ y: 30, opacity: 0 }}
                                        whileHover={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-white/90 text-sm mb-3"
                                    >
                                    </motion.p>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileHover={{ scale: 1 }}
                                        className="origin-bottom-left"
                                    >
                                        <button className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-1.5 rounded-full text-xs font-semibold flex items-center">
                                            <FiPlus className="mr-1" /> Voir plus
                                        </button>
                                    </motion.div>
                                </div>
                                {item.badge && (
                                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                                        <FiStar className="mr-1" /> {item.badge}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal Premium */}
            <AnimatePresence>
                {currentImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <button
                            onClick={() => setCurrentImage(null)}
                            className="absolute top-6 right-6 text-white hover:text-gray-300 z-50 p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <FiX size={28} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="relative max-w-6xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="grid lg:grid-cols-2">
                                <div className="lg:col-span-1 h-[60vh] lg:h-auto">
                                    <img
                                        src={currentImage.src}
                                        alt={currentImage.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="lg:col-span-1 p-8 lg:p-12 flex flex-col">
                                    <h3 className="text-3xl font-bold text-gray-900 mb-3">{currentImage.title}</h3>
                                    <p className="text-gray-600 mb-6 text-lg">{currentImage.description}</p>

                                    <div className="mt-auto pt-6 border-t border-gray-200">
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center">
                                                <FiMapPin className="mr-2" /> Tunisie
                                            </span>
                                            {currentImage.badge && (
                                                <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium flex items-center">
                                                    <FiStar className="mr-2" /> {currentImage.badge}
                                                </span>
                                            )}
                                            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                Inclus dans nos packages
                                            </span>
                                        </div>

                                        <button className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl">
                                            Découvrir nos offres
                                            <FiArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default TestimonialsGallery;