import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, Settings, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthModal } from "@/components/AuthModal";
import logo from "@/assets/logo.png";

interface HeaderProps {
  onGetInTouchClick?: () => void;
}

const Header = ({ onGetInTouchClick }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Login button hidden – users/admins can go to /login, /signup, or /admin/login directly via URL
  // const [authModalOpen, setAuthModalOpen] = useState(false);
  const { isAdmin, user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const navLinks = [
    { name: "Home", href: "#home", isAnchor: true },
    { name: "About", href: "#about", isAnchor: true },
    { name: "Courses", href: "#courses", isAnchor: true },
    { name: "Blog", href: "#blog", isAnchor: true },
    { name: "Contact", href: "#contact", isAnchor: true },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string, isAnchor: boolean) => {
    if (isAnchor && !isHomePage) {
      e.preventDefault();
      window.location.href = "/" + href;
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:7517401717" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Phone size={14} />
              <span>7517401717 / 7373401717</span>
            </a>
            <a href="mailto:share.master.171@gmail.com" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Mail size={14} />
              <span>share.master.171@gmail.com</span>
            </a>
          </div>
          <div className="text-sm opacity-90">
            Learn Stock Market Trading From Experts
          </div>
        </div>
      </div>

      {/* Main Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass shadow-lg" : "bg-background/95 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a
              href="#home"
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <img src={logo} alt="ShareMaster" className="h-12 md:h-14 w-auto" />
            </motion.a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                link.isAnchor ? (
                  <motion.a
                    key={link.name}
                    href={isHomePage ? link.href : "/" + link.href}
                    className="text-foreground/80 hover:text-primary font-medium transition-colors relative group"
                    whileHover={{ y: -2 }}
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  </motion.a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-foreground/80 hover:text-primary font-medium transition-colors relative group"
                  >
                    <motion.span whileHover={{ y: -2 }} className="inline-block">
                      {link.name}
                    </motion.span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                )
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <User className="h-4 w-4" />
                        <span className="max-w-32 truncate">{user.email?.split("@")[0]}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="text-muted-foreground text-xs">
                        {user.email}
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : null}
              {/* Login button hidden – use /login or /signup URL directly
              ) : (
                <Button variant="outline" className="font-medium" onClick={() => setAuthModalOpen(true)}>
                  Login
                </Button>
              )}
              */}
              <motion.a
                href={isHomePage ? "#contact" : "/#contact"}
                className="btn-hero text-base px-6 py-3 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  onGetInTouchClick?.();
                  if (isHomePage) {
                    window.location.hash = "contact";
                  } else {
                    navigate("/#contact");
                  }
                }}
              >
                Get in Touch
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background border-t"
            >
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
                {navLinks.map((link) => (
                  link.isAnchor ? (
                    <a
                      key={link.name}
                      href={isHomePage ? link.href : "/" + link.href}
                      className="text-foreground/80 hover:text-primary font-medium py-2 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="text-foreground/80 hover:text-primary font-medium py-2 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )
                ))}
                {user ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 text-foreground/80 hover:text-primary font-medium py-2 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-destructive font-medium py-2 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </>
                ) : null}
                {/* Login button hidden – use /login or /signup URL directly
                ) : (
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => { setAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                    >
                      Login
                    </Button>
                  </div>
                )}
                */}
                <a
                  href={isHomePage ? "#contact" : "/#contact"}
                  className="btn-hero text-center mt-2 block"
                  onClick={(e) => {
                    e.preventDefault();
                    onGetInTouchClick?.();
                    setIsMobileMenuOpen(false);
                    if (isHomePage) {
                      window.location.hash = "contact";
                    } else {
                      navigate("/#contact");
                    }
                  }}
                >
                  Get in Touch
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      {/* AuthModal – Login/Signup via /login or /signup URL directly
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      */}
    </>
  );
};

export default Header;
