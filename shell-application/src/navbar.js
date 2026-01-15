import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings, Bell, ChevronDown, Sparkles } from "lucide-react";
import { tokenService } from './services/logout';
import { Routes, Route, useNavigate } from "react-router-dom";
import { ProfileSettings } from './components/profileSet';

// Assets imports
import G from '../src/assets/h.jpg';
import T from '../src/assets/to.jpg';
import R from '../src/assets/ho.jpg';
import Z from '../src/assets/rf.jpg';
import F from '../src/assets/a.jpg';
import image1 from '../src/assets/1.jpg';
import image2 from '../src/assets/3.jpg';
import image3 from '../src/assets/4.jpg';
import image4 from '../src/assets/5.jpg';
import image5 from '../src/assets/6.jpg';
import D from '../src/assets/da.jpg';
import U from '../src/assets/re.jpg';
import V from '../src/assets/ui.jpg';
import IM from '../src/assets/ur.jpg';
import AM from '../src/assets/nx.jpg';
import CM from '../src/assets/gh.jpg';
import { useTranslation } from 'react-i18next';
import './i18n';

// Components
import { StickyScroll } from './components/StickyScroll';
import { AnimatedTestimonials } from './components/testo';
import { Timeline } from "./components/TimeLine";
import { FeaturesSectionDemo } from './components/TunisiaCard';
import { ContactSection } from './components/ContactUs';
import { Footer } from './components/footer';
import { ScrollToTopButton } from './components/button';
import { CurvedBackground } from './components/curvebackgorund';
import { MarqueeDemo } from './components/testor';
import { Hero } from './components/Herosection';
//import { InfiniteScrollBanner } from './components/scrollbanner';
import { LogoShowcase } from './components/logoshow';
import MedicalChatbot from './components/chatboot';
import {AboutUsSection} from './components/AboutUsSection';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userAge, setUserAge] = useState(0);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const processData = [
    {
      title: t("timeline_search_title"),
      iconType: "search",
      content: (
        <div className="space-y-4 sm:space-y-6">
          <p className="text-gray-700 font-bump leading-relaxed text-sm sm:text-base">
            {t("timeline_search_desc")}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <motion.div whileHover={{ scale: 1.02 }}>
              <img src={D} alt="Medical search" className="rounded-lg object-cover h-24 sm:h-32 w-full shadow-md" loading="lazy" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <img src={U} alt="Doctor consultation" className="rounded-lg object-cover h-24 sm:h-32 w-full shadow-md" loading="lazy" />
            </motion.div>
          </div>
        </div>
      ),
      link: { text: t("tunisia_explore_treatments"), url: "/treatments" }
    },
    {
      title: t("timeline_planning_title"),
      iconType: "planning",
      content: (
        <div className="space-y-4 sm:space-y-6">
          <p className="text-gray-700 font-bump leading-relaxed text-sm sm:text-base">
            {t("timeline_planning_desc")}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <motion.div whileHover={{ scale: 1.02 }}>
              <img src={R} alt="Treatment planning" className="rounded-lg object-cover h-24 sm:h-32 w-full shadow-md" loading="lazy" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <img src={V} alt="Cost estimation" className="rounded-lg object-cover h-24 sm:h-32 w-full shadow-md" loading="lazy" />
            </motion.div>
          </div>
        </div>
      ),
      link: { text: t("timeline_learn_more"), url: "/planning" }
    },
    {
      title: t("timeline_travel_title"),
      iconType: "travel",
      content: (
        <div className="space-y-4 sm:space-y-6">
          <p className="text-gray-700 font-bump leading-relaxed text-sm sm:text-base">
            {t("timeline_travel_desc")}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <motion.div whileHover={{ scale: 1.02 }}>
              <img src={IM} alt="Travel arrangements" className="rounded-lg object-cover h-24 sm:h-32 w-full shadow-md" loading="lazy" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <img src={AM} alt="Medical facility" className="rounded-lg object-cover h-24 sm:h-32 w-full shadow-md" loading="lazy" />
            </motion.div>
          </div>
        </div>
      ),
      link: { text: t("timeline_learn_more"), url: "/travel" }
    },
    {
      title: t("timeline_followup_title"),
      iconType: "followup",
      content: (
        <div className="space-y-4 sm:space-y-6">
          <p className="text-gray-700 font-bump leading-relaxed text-sm sm:text-base">
            {t("timeline_followup_desc")}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <motion.div whileHover={{ scale: 1.02 }}>
              <img src={F} alt="Recovery process" className="rounded-lg object-cover h-24 sm:h-32 w-full shadow-md" loading="lazy" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <img src={CM} alt="Aftercare support" className="rounded-lg object-cover h-24 sm:h-32 w-full shadow-md" loading="lazy" />
            </motion.div>
          </div>
        </div>
      ),
      link: { text: t("timeline_learn_more"), url: "/aftercare" }
    }
  ];

  const testimonialsData = [
    {
      quote: t("Discover your perfect match"),
      name: t("Plastic Surgery"),
      src: image1
    },
    {
      quote: t("Achieve a radiant smile with cosmetic dentistry, implants, and whitening treatments."),
      name: t("Dentistry"),
      designation: t("Make a great smile"),
      src: image2
    },
    {
      quote: t("Pursue your dream of parenthood with personalized fertility treatments and support."),
      name: t("IVF"),
      designation: t("Assisted Human Reproduction"),
      src: image3
    },
    {
      quote: t("At PlasFora, your health comes first with expert care..."),
      name: t("General Treatment"),
      designation: t("Health Better"),
      src: image4
    },
    {
      quote: t("Restore confidence with advanced FUE and DHI hair transplant techniques by expert surgeons."),
      name: t("Hair Transplant"),
      designation: t("Feel More Younger"),
      src: image5
    },
  ];

  const servicesData = [
    {
      title: t("Medical Booking"),
      description: t("Find and book with top doctors, get quotes, schedule calls."),
      content: <div className="h-full w-full flex justify-center"><img src={G} alt={t("Medical Booking")} className="h-full w-full object-cover" /></div>
    },
    {
      title: t("Travel Assistance"),
      description: t("We help with flights, hotels, transportation – stress-free."),
      content: <div className="h-full w-full flex justify-center"><img src={T} alt={t("Travel Assistance")} className="h-full w-full object-cover" /></div>
    },
    {
      title: t("Personalized Support"),
      description: t("Get support throughout your journey with our dedicated team."),
      content: <div className="h-full w-full flex justify-center"><img src={R} alt={t("Personalized Support")} className="h-full w-full object-cover" /></div>
    },
    {
      title: t("Additional Services"),
      description: t("Translation, excursions, VIP services & more."),
      content: <div className="h-full w-full flex justify-center"><img src={Z} alt={t("Additional Services")} className="h-full w-full object-cover" /></div>
    }
  ];

  // Enhanced User Menu Component
  const EnhancedUserMenu = ({
    isLoggedIn,
    userName,
    userEmail,
    onLogout,
    onNavigate
  }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState(3);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const getInitials = (name) => {
      if (!name) return "U";
      return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const menuVariants = {
      hidden: {
        opacity: 0,
        scale: 0.95,
        y: -10,
        rotateX: -15,
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
          staggerChildren: 0.05,
        },
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        y: -10,
        rotateX: -15,
        transition: {
          duration: 0.2,
        },
      },
    };

    const itemVariants = {
      hidden: { x: -10, opacity: 0 },
      visible: { x: 0, opacity: 1 },
    };

    const handleLogoutClick = async () => {
      setIsLoggingOut(true);
      setIsMenuOpen(false);
      await new Promise((resolve) => setTimeout(resolve, 300));
      onLogout();
    };

    return (
      <div className="relative">
        {/* Dropdown Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            >
              {/* Menu content */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {getInitials(userName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base truncate">{userName || "User"}</h3>
                    <p className="text-sm text-gray-600 truncate flex items-center gap-1">
                      <User size={12} />
                      {userEmail || "No email"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <motion.button
                  variants={itemVariants}
                  className="w-full flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-blue-50 rounded-lg text-sm transition-all group"
                  onClick={() => {
                    onNavigate("/dashboard");
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <User className="text-blue-600" size={16} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">My Dashboard</div>
                    <div className="text-xs text-gray-500">View your Dashboard</div>
                  </div>
                </motion.button>

                <motion.button
                  variants={itemVariants}
                  className="w-full flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-blue-50 rounded-lg text-sm transition-all group"
                  onClick={() => {
                    onNavigate("/profile");
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <Settings className="text-gray-600" size={16} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">Settings</div>
                    <div className="text-xs text-gray-500">Account preferences</div>
                  </div>
                </motion.button>

                <hr className="my-2 border-gray-100" />

                <motion.button
                  variants={itemVariants}
                  className="w-full flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm transition-all group"
                  onClick={handleLogoutClick}
                  disabled={isLoggingOut}
                >
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <LogOut className="text-red-600" size={16} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{isLoggingOut ? "Signing out..." : "Sign out"}</div>
                    <div className="text-xs text-red-400">Logout from account</div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const calculateAge = (birthDateStr) => {
    if (!birthDateStr) return "";
    const today = new Date();
    const birthDate = new Date(birthDateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");
    const age = localStorage.getItem("age");
    const role = localStorage.getItem("role");

    if (token && name) {
      setIsLoggedIn(true);
      setUserName(name);
      setUserEmail(email || "");
      setUserAge(Number(age) || 0);
    }

    window.opener?.postMessage("READY_FOR_TOKEN", "http://localhost:3021");

    const handleMessage = (event) => {
      const { origin, data, source } = event;

      if (origin === "http://localhost:3021") {
        const { accessToken, refreshToken, user } = data;
        if (accessToken && user) {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("userName", user.name);
          localStorage.setItem("userEmail", user.email);
          localStorage.setItem("userId", user.id);
          localStorage.setItem("insurance", user.insurance);
          localStorage.setItem("birthDate", user.birthDate);
          localStorage.setItem("role", user.role);
          setIsLoggedIn(true);
          setUserName(user.name);
          setUserEmail(user.email);
          setUserAge(calculateAge(user.birthDate));
        }
      } else if (
        (origin === "http://localhost:3028" || origin === "http://localhost:3070") &&
        data === "READY_FOR_TOKEN"
      ) {
        const tokenData = {
          accessToken: localStorage.getItem("accessToken") || "",
          refreshToken: localStorage.getItem("refreshToken") || "",
          user: {
            name: localStorage.getItem("userName") || "",
            email: localStorage.getItem("userEmail") || "",
            id: localStorage.getItem("userId") || "",
            insurance: localStorage.getItem("insurance") || "",
            age: localStorage.getItem("age") || "",
          },
        };

        if (tokenData.accessToken && tokenData.refreshToken && tokenData.user.name) {
          source.postMessage(tokenData, origin);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleLogout = async () => {
    await tokenService.logoutAll();
    localStorage.clear();
    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");
    setUserAge(0);
    navigate("/", { replace: true });
    window.location.reload();
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleUpdateProfile = ({ userName, userEmail, userAge }) => {
    setUserName(userName);
    setUserEmail(userEmail);
    setUserAge(userAge);
  };
   const LanguageSelector = () => (
        <div className="flex items-center space-x-2">
            {["en", "fr", "ar"].map((lng) => (
                <button
                    key={lng}
                    onClick={() => i18n.changeLanguage(lng)}
                    className={`px-2 py-1 rounded ${i18n.language === lng ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
                >
                    {lng.toUpperCase()}
                </button>
            ))}
        </div>
    );

  // MainContent avec responsive design
  const MainContent = () => (
    <div className="w-full overflow-x-hidden">
       <div className="fixed top-2 right-2 z-[99999]">
                <LanguageSelector />
            </div>

      <CurvedBackground />
      <Hero />
      <AboutUsSection />

      <div className="w-full overflow-x-hidden space-y-8 sm:space-y-12 pb-12 sm:pb-16">
        {/* Testimonials Section */}
        <div className="w-full px-3 sm:px-4  py-8 sm:py-12 bg-gradient-to-b from-blue-50 via-blue-50 to-white">
          <div className="max-w-7xl mx-auto">
            <AnimatedTestimonials testimonials={testimonialsData} />
          </div>
        </div>
        <div className="w-full px-3 sm:px-4  py-8 sm:py-12 bg-gradient-to-b from-white via-white to-blue-50">

          <StickyScroll content={servicesData} />
          <Timeline data={processData} />

        </div>


        {/* Features Section */}
        <div className="w-full px-3 sm:px-4 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto">
            <FeaturesSectionDemo />
          </div>
        </div>

        {/* Marquee Section */}
        {/*<div className="w-full max-w-7xl px-20 sm:px-9 py-8 sm:py-12">
          <MarqueeDemo />
        </div>*/}

        {/* Contact Section */}
        <div className="w-full bg-white py-12 sm:py-16 px-3 sm:px-4">
          <div className="max-w-7xl mx-auto">
            <ContactSection />
          </div>
        </div>
      </div>

      <ScrollToTopButton />
      <LogoShowcase />
        <MedicalChatbot></MedicalChatbot>
      <Footer />
    </div>
  );

  return (
    <div className="relative min-h-screen">
      {/* Enhanced User Menu */}
      {isLoggedIn && (
        <div className="fixed top-4 right-4 z-50">
          <EnhancedUserMenu
            isLoggedIn={isLoggedIn}
            userName={userName}
            userEmail={userEmail}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        </div>
      )}

      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route
          path="/profile"
          element={
            <ProfileSettings
              userName={userName}
              userEmail={userEmail}
              userAge={userAge}
              onUpdate={handleUpdateProfile}
              onCancel={() => navigate("/")}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default Navbar;