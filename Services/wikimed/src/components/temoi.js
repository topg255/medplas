import React, { useState } from 'react';
import { FiStar, FiChevronLeft, FiChevronRight, FiPlay, FiPause, FiHeart, FiMapPin } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import test from '../assets/testo.mp4';
import test1 from '../assets/testo1.mp4';
import test2 from '../assets/testo2.mp4';
import T from '../assets/tes.jpg'
import T1 from '../assets/tes1.jpg';
import T2 from '../assets/tes2.jpg';

export const Testimonials360 = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState(null);

  const testimonials = [
    {
      id: 1,
      name: "Sophie Martin",
      procedure: "Greffe capillaire",
      rating: 5,
      quote: "Mon expérience en Tunisie a dépassé toutes mes attentes. L'équipe médicale était exceptionnellement compétente et l'environnement de convalescence idyllique.",
      location: "Tunis",
      country: "France",
      avatar: T,
      video: test,
      beforeAfter: {
        before: "/before-sophie.jpg",
        after: "/after-sophie.jpg"
      },
      highlights: [
        "Hôtel 5* avec spa médical",
        "Suivi à distance inclus"
      ]
    },
    {
      id: 2,
      name: "Ahmed Johnson",
      procedure: "Chirurgie dentaire",
      rating: 4,
      quote: "Après mes implants dentaires, j'ai pu visiter le désert en toute sécurité. Les médecins m'avaient donné des conseils parfaits pour ma convalescence.",
      location: "Djerba",
      country: "Canada",
      avatar: T1,
      video: test1,
      highlights: [
        "Technologie CAD/CAM",
        "Garantie 10 ans",
        "Transferts privés"
      ]
    },
    {
      id: 3,
      name: "Marie Dupont",
      procedure: "FIV",
      rating: 5,
      quote: "Notre rêve de devenir parents s'est réalisé grâce à l'expertise tunisienne. Le cadre apaisant a rendu ce parcours émotionnel beaucoup plus serein.",
      location: "Sousse",
      country: "Belgique",
      avatar: T2,
      video: test2,
      highlights: [
        "Laboratoire dernier cri",
        "Psychologue dédié",
        "Suivi post-traitement"
      ]
    }
  ];

  const toggleVideo = (id) => {
    if (activeVideo === id) {
      setActiveVideo(null);
      setIsPlaying(false);
    } else {
      setActiveVideo(id);
      setIsPlaying(true);
      // Pause Swiper autoplay when video is active
      if (swiperInstance) swiperInstance.autoplay.stop();
    }
  };

  const formatRating = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} w-5 h-5`}
      />
    ));
  };

  return (
    <section className="relative py-28 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-purple-100 opacity-20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 font-munika tracking-wider mb-4 inline-block">
            TÉMOIGNAGES IMMERSIFS
          </span>
          <h2 className="text-4xl md:text-5xl font-munika text-gray-900 mb-4">
            Expériences <span className="text-blue-600">360°</span> de nos patients
          </h2>
          <p className="text-base font-munika text-gray-600 max-w-3xl mx-auto">
            Découvrez des récits authentiques combinant excellence médicale et découverte culturelle
          </p>
        </motion.div>

        {/* Carousel 3D */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            navigation={{
              nextEl: '.testimonial-next',
              prevEl: '.testimonial-prev'
            }}
            pagination={{
              clickable: true,
              el: '.testimonial-pagination',
              type: 'bullets'
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false
            }}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            className="py-10"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col"
                >
                  {/* En-tête de la carte */}
                  <div className="relative h-60 bg-gray-100">
                    {activeVideo === testimonial.id ? (
                      <div className="relative h-full w-full bg-black">
                        <video
                          src={testimonial.video}
                          controls
                          autoPlay
                          className="w-full h-full object-cover"
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onEnded={() => {
                            setActiveVideo(null);
                            if (swiperInstance) swiperInstance.autoplay.start();
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => toggleVideo(testimonial.id)}
                          className="absolute inset-0 flex items-center justify-center group"
                        >
                          <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                            <FiPlay className="text-blue-600 text-2xl" />
                          </div>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Corps de la carte */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-munika">{testimonial.name}</h3>
                        <div className="flex items-center text-sm font-munika text-gray-500 mt-1">
                          <FiMapPin className="mr-1" />
                          <span>{testimonial.location} • {testimonial.country}</span>
                        </div>
                      </div>
                      <div className="flex">
                        {formatRating(testimonial.rating)}
                      </div>
                    </div>

                    <blockquote className="text-gray-600 font-munika italic mb-6 flex-1">
                      "{testimonial.quote}"
                    </blockquote>

                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-munika text-gray-500 mb-2">PROCÉDURE RÉALISÉE</h4>
                      <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-munika inline-block">
                        {testimonial.procedure}
                      </div>
                    </div>
                  </div>

                  {/* Pied de carte */}
                  <div className="px-6 pb-6">
                    <div className="flex flex-wrap gap-2">
                      {testimonial.highlights.map((highlight, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-800 font-munika rounded-full text-xs">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Contrôles de navigation */}
          <button className="testimonial-prev absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
            <FiChevronLeft className="text-gray-700 text-xl" />
          </button>
          <button className="testimonial-next absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
            <FiChevronRight className="text-gray-700 text-xl" />
          </button>

          {/* Pagination personnalisée */}
          <div className="testimonial-pagination flex justify-center mt-8 space-x-2"></div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-xl font-munika text-gray-600 mb-6">
            Prêt à vivre votre propre expérience de soins en Tunisie ?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-munika py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center">
              <FiPlay className="mr-2" />
              Voir plus de témoignages
            </button>
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-munika py-3 px-8 rounded-full transition-all flex items-center">
              <FiHeart className="mr-2" />
              Discuter avec un ancien patient
            </button>
          </div>
        </motion.div>
      </div>

      {/* Modal Before/After (pourrait être développé) */}
      <AnimatePresence>
        {false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          >
            {/* Contenu du modal */}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Testimonials360;