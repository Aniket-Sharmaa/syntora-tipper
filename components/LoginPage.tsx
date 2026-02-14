import { useState } from "react";
import { toast } from "sonner";
import { User, UserRole } from "@/app/page";
import { Eye, EyeOff, Users, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Globe } from "@/components/ui/globe";
import Image from "next/image"

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Register form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [phone, setPhone] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeUpdates, setAgreeUpdates] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (email && password) {
        const username = email.split('@')[0];
        let role: UserRole = "employee";
        
        if (username.toLowerCase().includes("super") || username.toLowerCase() === "superadmin") {
          role = "super-admin";
        } else if (username.toLowerCase().includes("admin")) {
          role = "admin";
        } else {
          role = "employee";
        }

        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          username,
          role,
        };

        toast.success(`Welcome to Syntora-Tipper, ${username}!`);
        onLogin(user);
      } else {
        toast.error("Please enter both email and password");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error("Please agree to the Terms and Conditions");
      return;
    }
    toast.success("Registration successful! Please login.");
    setShowRegister(false);
    // Reset register form
    setFirstName("");
    setLastName("");
    setRegisterEmail("");
    setHandle("");
    setPhone("");
    setAgreeTerms(false);
    setAgreeUpdates(false);
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-black">
      {/* Left Side - Globe */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Globe 
            className="opacity-90"
            config={{
              width: 800,
              height: 800,
              onRender: () => {},
              devicePixelRatio: 2,
              phi: 0,
              theta: 0.3,
              dark: 0.8,
              diffuse: 1.2,
              mapSamples: 16000,
              mapBrightness: 6,
              baseColor: [0.2, 0.47, 0.71],
              markerColor: [51 / 255, 122 / 255, 183 / 255],
              glowColor: [0.2, 0.47, 0.71],
              markers: [
                { location: [14.5995, 120.9842], size: 0.03 },
                { location: [19.076, 72.8777], size: 0.1 },
                { location: [23.8103, 90.4125], size: 0.05 },
                { location: [30.0444, 31.2357], size: 0.07 },
                { location: [39.9042, 116.4074], size: 0.08 },
                { location: [-23.5505, -46.6333], size: 0.1 },
                { location: [19.4326, -99.1332], size: 0.1 },
                { location: [40.7128, -74.006], size: 0.1 },
                { location: [34.6937, 135.5022], size: 0.05 },
                { location: [41.0082, 28.9784], size: 0.06 },
              ],
            }}
          />
        </div>
        
        {/* Branding Overlay */}
        <div className="absolute top-10 left-10 z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3"
          >
           <Image
  src="/syntora.png"
  alt="Syntora Logo"
  width={40}
  height={40}
  className="object-contain drop-shadow-2xl"
/>
          </motion.div>
        </div>

        {/* Bottom Text */}
        <div className="absolute bottom-10 left-10 right-10 z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {/* <h2 className="text-2xl font-bold text-white mb-2">Syntora-Tipper</h2>
            <p className="text-[#337ab7] font-semibold mb-4 text-lg">Employee Management System</p> */}
            <p className="text-gray-400 text-sm max-w-md">
              Connect with your team globally. Manage employees, track payments, and streamline operations all in one place.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login/Register Form */}
      <div className="w-full lg:w-1/2 relative bg-gradient-to-br from-[#337ab7] via-[#2868a0] to-[#1e4d7a] flex items-center justify-center p-6 overflow-y-auto">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <AnimatePresence mode="wait">
            {!showRegister ? (
              // Login Form
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Mobile Logo */}
                <div className="text-center mb-8 lg:hidden">
                  <Image
  src="/syntora.png"
  alt="Syntora Logo"
  width={128}
  height={128}
  className="object-contain drop-shadow-2xl"
/>
                </div>

                <h2 className="text-4xl font-bold text-white mb-2 text-center tracking-tight">
                  LOGIN
                </h2>
                <p className="text-white/80 text-center mb-8 text-sm">
                  Access your employee dashboard
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full px-6 py-4 bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-2xl focus:outline-none focus:border-white text-white placeholder:text-white/60 transition-all text-base"
                      required
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-6 py-4 bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-2xl focus:outline-none focus:border-white text-white placeholder:text-white/60 transition-all pr-14 text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white text-[#337ab7] font-bold py-4 rounded-2xl transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 text-base flex items-center justify-center gap-2 group"
                  >
                    {isLoading ? "SIGNING IN..." : "LOGIN"}
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </motion.button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-white/90 mb-4 uppercase tracking-wider text-sm font-semibold">
                    Register to never miss a beat
                  </p>
                  <button
                    onClick={() => setShowRegister(true)}
                    className="text-white hover:text-white/80 transition-colors underline underline-offset-4 text-sm font-medium"
                  >
                    Create an account
                  </button>
                </div>

                {/* Test Accounts */}
                <div className="mt-8 p-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                  <p className="text-white font-bold text-center mb-3 text-sm uppercase tracking-wider">
                    Test Accounts
                  </p>
                  <div className="space-y-2 text-xs text-white/90">
                    <div className="bg-white/10 p-2 rounded-lg">
                      <p><span className="font-bold">Super Admin:</span> superadmin@syntora.com</p>
                    </div>
                    <div className="bg-white/10 p-2 rounded-lg">
                      <p><span className="font-bold">Admin:</span> admin@syntora.com</p>
                    </div>
                    <div className="bg-white/10 p-2 rounded-lg">
                      <p><span className="font-bold">Employee:</span> employee@syntora.com</p>
                    </div>
                    <p className="text-center italic pt-1 text-white/70">Password: any text</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              // Register Form
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <button
                  onClick={() => setShowRegister(false)}
                  className="absolute -top-2 -right-2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-xl z-10"
                >
                  <X size={20} />
                </button>

                {/* Mobile Logo for Register */}
                <div className="text-center mb-6 lg:hidden">
                 <Image
  src="/syntora.png"
  alt="Syntora Logo"
  width={50}
  height={50}
  className="object-contain drop-shadow-2xl"
/>
                </div>

                <h2 className="text-3xl font-bold text-white mb-2 text-center tracking-tight">
                  REGISTER TO NEVER MISS A BEAT
                </h2>
                <p className="text-white/80 text-center mb-6 text-sm">
                  Join Syntora-Tipper today
                </p>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="*First name"
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-xl focus:outline-none focus:border-white text-white placeholder:text-white/60 transition-all text-sm"
                      required
                    />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="*Last name"
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-xl focus:outline-none focus:border-white text-white placeholder:text-white/60 transition-all text-sm"
                      required
                    />
                  </div>

                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="*@Handle"
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-xl focus:outline-none focus:border-white text-white placeholder:text-white/60 transition-all text-sm"
                    required
                  />

                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="*Email"
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-xl focus:outline-none focus:border-white text-white placeholder:text-white/60 transition-all text-sm"
                    required
                  />

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="*Phone number (+1 XXX XXX XXXX)"
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-xl focus:outline-none focus:border-white text-white placeholder:text-white/60 transition-all text-sm"
                    required
                  />

                  <div className="flex items-start gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded accent-white cursor-pointer"
                      required
                    />
                    <label htmlFor="terms" className="text-white/90 text-xs leading-relaxed cursor-pointer">
                      *I agree to the{" "}
                      <span className="underline cursor-pointer hover:text-white">Terms and Conditions</span>
                      {" "}and{" "}
                      <span className="underline cursor-pointer hover:text-white">Privacy Policy</span>
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="updates"
                      checked={agreeUpdates}
                      onChange={(e) => setAgreeUpdates(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded accent-white cursor-pointer"
                    />
                    <label htmlFor="updates" className="text-white/90 text-xs leading-relaxed cursor-pointer">
                      I agree to receive updates and notifications from Syntora-Tipper
                    </label>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white text-[#337ab7] font-bold py-4 rounded-xl transition-all shadow-xl hover:shadow-2xl text-base flex items-center justify-center gap-2 group mt-6"
                  >
                    CREATE ACCOUNT
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </motion.button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowRegister(false)}
                    className="text-white hover:text-white/80 transition-colors text-sm font-medium"
                  >
                    Already have an account? <span className="underline underline-offset-4">Login</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
