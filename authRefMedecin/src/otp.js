import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const OtpVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
  const [userRole, setUserRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [maxResendAttempts] = useState(3);
  const [resendCooldown] = useState(60);
  const inputRefs = useRef([]);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Récupérer le rôle et l'email depuis localStorage au chargement du composant
  useEffect(() => {
    // Récupérer l'email depuis localStorage
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }

    // Récupérer le rôle depuis différentes sources
    const savedRole = localStorage.getItem("userRole");
    const urlParams = new URLSearchParams(window.location.search);
    const roleFromUrl = urlParams.get("role");
    const roleFromState = window.history.state?.userRole;

    // Utiliser le rôle dans l'ordre de priorité
    const role = roleFromUrl || roleFromState || savedRole || "patient";
    setUserRole(role);

    // Sauvegarder le rôle dans localStorage s'il n'est pas déjà présent
    if (role && role !== savedRole) {
      localStorage.setItem("userRole", role);
    }
  }, []);

  // Handle OTP field changes
  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next field if a digit is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle Backspace key to move to previous field
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Verify OTP automatically when all digits are entered
  useEffect(() => {
    const otpCode = otp.join("");
    if (otpCode.length === 6 && /^\d{6}$/.test(otpCode)) {
      verifyOtp(otpCode);
    }
  }, [otp]);

  // OTP verification function modifiée pour utiliser l'email du localStorage
  const verifyOtp = async (otpCode) => {
    setError("");
    setIsSubmitting(true);

    // Utiliser l'email du localStorage comme source principale
    const userEmail = localStorage.getItem("userEmail") || email;
    
    // Validate email
    if (!userEmail) {
      setError("Please enter an email address.");
      setIsSubmitting(false);
      return;
    }
    if (!emailRegex.test(userEmail)) {
      setError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    // Validate user role
    if (!userRole) {
      setError("User role not found. Please try registering again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      
      // Construction de l'URL avec le rôle dynamique
      const apiUrl = `http://localhost:3001/users/${userRole}/verify-otp`;
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify({
          email: userEmail,
          otpCode: otpCode.toString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Email verified successfully!");
        
        // Nettoyer les données temporaires après vérification réussie
        localStorage.removeItem("userEmail");
        localStorage.removeItem("tempUserId");
        localStorage.removeItem("tempUserName");
        localStorage.removeItem("tempUserEmail");
        localStorage.removeItem("tempUserRole");
        
        // Nettoyer les données spécifiques au médecin si nécessaire
        if (userRole === "RefDoctor") {
          localStorage.removeItem("userHospital");
          localStorage.removeItem("userSpeciality");
          localStorage.removeItem("userMedicalLicense");
          localStorage.removeItem("userApproved");
          localStorage.removeItem("userDeployed");
        }

        // Rediriger vers la page de login appropriée selon le rôle
        setTimeout(() => {
          if (userRole === "RefDoctor") {
            navigate("/login_RefDoctor");
          } else if (userRole === "pdoctor") {
            navigate("/login_medecin");
          } else if (userRole === "clinic") {
            navigate("/login_clinic");
          } else {
            navigate("/login");
          }
        }, 2000);
      } else {
        if (response.status === 400 || data.error?.toLowerCase().includes("incorrect")) {
          setError("Incorrect OTP code.");
          toast.error("Incorrect OTP code.");
        } else if (response.status === 404) {
          setError("Invalid user role or endpoint not found.");
          toast.error("Invalid user role or endpoint not found.");
        } else {
          setError(data.error || "An error occurred. Please try again.");
          toast.error(data.error || "Verification failed.");
        }
        
        // Reset OTP fields on error
        setOtp(["", "", "", "", "", ""]);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
      toast.error(err.message || "Verification failed.");
      
      // Reset OTP fields on error
      setOtp(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check resend conditions based on API response
  const checkResendConditions = (apiResponse) => {
    const { 
      canResend = true, 
      maxAttempts = 3, 
      currentAttempts = 0,
      cooldownTime = 60,
      remainingTime = 0,
      isBlocked = false,
      blockReason = ""
    } = apiResponse;

    if (isBlocked) {
      setIsResendDisabled(true);
      toast.error(`Resend blocked: ${blockReason}`);
      return false;
    }

    if (currentAttempts >= maxAttempts) {
      setIsResendDisabled(true);
      toast.error(`Maximum resend attempts (${maxAttempts}) reached. Please try again later.`);
      return false;
    }

    if (remainingTime > 0) {
      setResendTimer(remainingTime);
      toast.info(`Please wait ${remainingTime} seconds before requesting a new OTP.`);
      return false;
    }

    if (!canResend) {
      setIsResendDisabled(true);
      toast.error("Resend OTP is currently not available. Please contact support.");
      return false;
    }

    return true;
  };

  // Handle OTP resend request modifiée pour utiliser l'email du localStorage
  const handleResendOtp = async () => {
    // Utiliser l'email du localStorage comme source principale
    const userEmail = localStorage.getItem("userEmail") || email;
    
    if (!userEmail) {
      toast.error("Please enter an email address.");
      return;
    }
    if (!emailRegex.test(userEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!userRole) {
      toast.error("User role not found. Please try registering again.");
      return;
    }

    if (resendTimer > 0) {
      toast.warning(`Please wait ${resendTimer} seconds before requesting a new OTP.`);
      return;
    }

    if (resendAttempts >= maxResendAttempts) {
      toast.error(`Maximum resend attempts (${maxResendAttempts}) reached.`);
      setIsResendDisabled(true);
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      
      // Construction de l'URL avec le rôle dynamique pour resend
      const apiUrl = `http://localhost:3001/users/users/${userRole}/resend-otp`;
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        if (checkResendConditions(data)) {
          toast.success(data.message || "A new OTP has been sent to your email.");
          setResendAttempts(prev => prev + 1);
          setResendTimer(data.cooldownTime || resendCooldown);
          
          setOtp(["", "", "", "", "", ""]);
          if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
          }
        }
      } else {
        if (response.status === 429) {
          toast.error("Too many resend requests. Please wait before trying again.");
          setResendTimer(data.retryAfter || 300);
        } else if (response.status === 403) {
          toast.error("Resend OTP is not allowed for this email.");
          setIsResendDisabled(true);
        } else if (response.status === 404) {
          toast.error("Invalid user role or endpoint not found.");
        } else {
          throw new Error(data.error || "Failed to send OTP.");
        }
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error(err.message || "Error requesting new OTP.");
      
      if (err.name === 'NetworkError' || err.message.includes('fetch')) {
        toast.info("Network error. Please check your connection and try again.");
      }
    }
  };

  // Handle resend countdown
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            if (resendAttempts < maxResendAttempts) {
              setIsResendDisabled(false);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer, resendAttempts, maxResendAttempts]);

  // Form animation
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const isResendButtonDisabled = resendTimer > 0 || isResendDisabled || resendAttempts >= maxResendAttempts;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Email Verification
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter the 6-digit OTP code sent to your email.
        </p>

        <div className="space-y-6">
          {/* Affichage du rôle pour debug (optionnel) */}
          {userRole && (
            <div className="text-center">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Role: {userRole}
              </span>
            </div>
          )}

          {/* Champ email en lecture seule */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <motion.input
              id="email"
              type="email"
              value={email}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              aria-label="Email address for verification"
              aria-describedby="email-error"
            />
            <p className="text-xs text-gray-500 mt-1">
              This is the email address you used for registration
            </p>
          </div>

          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                aria-label={`Digit ${index + 1} of OTP code`}
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileFocus={{ scale: 1.05 }}
              />
            ))}
          </div>

          {error && (
            <p id="email-error" className="text-red-500 text-sm text-center" role="alert">
              {error}
            </p>
          )}

          {isSubmitting && (
            <div className="text-center">
              <p className="text-blue-600">Verifying OTP...</p>
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendOtp}
              className={`text-blue-600 hover:underline transition-colors ${
                isResendButtonDisabled ? "opacity-50 cursor-not-allowed text-gray-400" : ""
              }`}
              disabled={isResendButtonDisabled}
              aria-label="Resend new OTP"
            >
              {resendTimer > 0 
                ? `Resend in ${resendTimer}s` 
                : isResendDisabled 
                ? "Resend unavailable"
                : resendAttempts >= maxResendAttempts
                ? "Max attempts reached"
                : "Resend OTP"
              }
            </button>
          </p>
          
          {resendAttempts > 0 && resendAttempts < maxResendAttempts && (
            <p className="text-gray-500 text-xs mt-1">
              {maxResendAttempts - resendAttempts} resend attempts remaining
            </p>
          )}
        </div>
      </motion.div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default OtpVerification;