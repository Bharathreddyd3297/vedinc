import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const navItems = ["Home", "Verticals", "Contact"];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 🔑 auth state
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setRole(localStorage.getItem("role"));
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const scrollToSection = (item: string) => {
    const sectionMap: Record<string, string> = {
      Home: "hero",
      Verticals: "verticals",
      Contact: "mentor-contact",
    };

    document.getElementById(sectionMap[item])?.scrollIntoView({
      behavior: "smooth",
    });
    setOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      {/* Main Navbar Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-transparent font-sans"
      >
        <div className="w-full px-10 py-10 flex items-center justify-between">
          {/* Burger (Left) */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(true)}
            className={`text-white hover:text-blue-500 transition-colors ${open ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
          >
            <Menu size={32} />
          </motion.button>

          {/* Auth Buttons (Right) */}
          <div className="flex items-center gap-4">
            {!token && (
              <>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/login"
                    className="hidden sm:block px-4 py-2 rounded-lg
                               border border-white/20 bg-white/10
                               backdrop-blur-md text-sm text-white font-medium"
                  >
                    Admin Login
                  </Link>
                </motion.div>
              </>
            )}

            {token && (
              <>
                <button
                  onClick={logout}
                  className="hidden sm:block text-sm text-red-400 font-medium hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Corner Menu Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: -20, y: -20, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              exit={{ x: -20, y: -20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-6 left-6 z-[120] w-[320px] bg-black border border-white/10 
                         rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16" />

              <div className="relative z-10">
                <div className="flex flex-col gap-10">
                  <div className="flex justify-start">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setOpen(false)}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <X size={32} />
                    </motion.button>
                  </div>

                  <div className="flex flex-col gap-6">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.05 * index }}
                      >
                        <button
                          onClick={() => scrollToSection(item)}
                          className="group relative text-3xl font-bold text-white hover:text-blue-500 
                                   transition-all duration-300 text-left uppercase tracking-tight"
                        >
                          <span className="relative z-10">{item}</span>
                          <motion.div className="absolute -bottom-1 left-0 h-1 bg-blue-500 w-0 group-hover:w-full transition-all duration-300" />
                        </button>
                      </motion.div>
                    ))}

                    {token && (
                      <>

                        <motion.button
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.25 }}
                          onClick={logout}
                          className="text-lg font-bold text-red-500 hover:text-red-400 mt-4 transition-colors uppercase text-left"
                        >
                          Logout
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;