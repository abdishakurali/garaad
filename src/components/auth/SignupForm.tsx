import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "../ui/button";

interface SignupFormProps {
  onSubmit: (formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    age: string;
  }) => void;
}

// Signup form component for collecting user information
export function SignupForm({ onSubmit }: SignupFormProps) {
  const [showAdditionalFields, setShowAdditionalFields] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    age: ''
  });

  // Handle input changes and show additional fields when email contains @
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="bg-white rounded-xl p-10 max-w-2xl w-full mx-6 shadow-2xl"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Waxbarashadaada waa diyaar!</h2>
              <p className="text-gray-600">Samee akoon bilaash ah si aad u bilowdo.</p>
            </div>
            <Image src="/rocket.svg" alt="" width={80} height={80} />
          </div>

          <div className="space-y-6">
            {/* Google Sign-up */}
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 mb-4 cursor-not-allowed relative"

            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Kusoo gal Google
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                Dhowaan
              </span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 mb-4 cursor-not-allowed relative"

            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Kusoo gal Facebook
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                Dhowaan
              </span>
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">AMA</span>
              </div>
            </div>

            {/* Progressive Form */}
            <div className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Iimaylka"
                className="w-full p-3 md:p-4 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base md:text-lg"
                style={{ fontSize: '16px' }}
                value={formData.email}
                onChange={(e) => {
                  handleInputChange(e);
                  if (e.target.value.includes('@')) {
                    setShowAdditionalFields(true);
                  }
                }}
              />

              {showAdditionalFields && (
                <div className="space-y-4">
                  <input
                    type="password"
                    name="password"
                    placeholder="Furaha sirta ah"
                    className="w-full p-3 md:p-4 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base md:text-lg"
                    style={{ fontSize: '16px' }}
                    value={formData.password}
                    onChange={handleInputChange}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Magaca koowaad"
                      className="w-full p-3 md:p-4 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base md:text-lg"
                      style={{ fontSize: '16px' }}
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />

                    <input
                      type="number"
                      name="age"
                      placeholder="Da'da"
                      className="w-full p-3 md:p-4 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base md:text-lg"
                      style={{ fontSize: '16px' }}
                      value={formData.age}
                      onChange={handleInputChange}
                    />
                  </div>

                </div>
              )}

              <button
                className="w-full bg-black text-white rounded-xl p-4 hover:bg-black/90 transition-colors relative cursor-not-allowed opacity-60"
                onClick={(e) => e.preventDefault()}
                disabled
              >
                Is diiwaan geli
                <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                  Dhowaan
                </span>
              </button>
            </div>

            <p className="text-xs text-center text-gray-500">
              Marka aad guujiso Is diiwaan geli, waxaad ogoshahay{" "}
              <a href="#" className="underline">Shuruudaha</a> iyo{" "}
              <a href="#" className="underline">Xogta gaarka ah</a>
            </p>

            <div className="text-center">
              <span className="text-sm text-gray-600">Horay ma u diiwaan gashay? </span>
              <a href="#" className="text-sm text-blue-600 hover:underline">Soo gal</a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
