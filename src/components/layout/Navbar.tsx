import { useState, useEffect } from "react";
import { Shield, Menu, X, LogIn, UserPlus, LogOut, User } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const homeLinks = [
  { label: "Home", href: "#hero", isRoute: false },
  { label: "Overview", href: "#overview", isRoute: false },
  { label: "Demo", href: "#demo", isRoute: false },
  { label: "Documentation", href: "/documentation", isRoute: true },
  { label: "Workflow", href: "#workflow", isRoute: false },
];

const docLinks = [
  { label: "Home", href: "/", isRoute: true },
  { label: "Documentation", href: "/documentation", isRoute: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const navLinks = location.pathname === "/documentation" ? docLinks : homeLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glassmorphism shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Shield className="w-6 h-6 text-primary transition-all group-hover:drop-shadow-[0_0_8px_hsl(155_100%_45%/0.6)]" />
          <span className="text-lg font-bold tracking-tight">
            Secure<span className="text-primary">Flow</span>
          </span>
        </Link>

        {/* Desktop nav + auth */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.isRoute ? (
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Auth buttons */}
          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border/40">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/80 font-medium max-w-[120px] truncate">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-primary/10"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-1.5 rounded-md transition-all duration-200 shadow-[0_0_15px_hsl(155_100%_45%/0.25)] hover:shadow-[0_0_25px_hsl(155_100%_45%/0.4)]"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glassmorphism border-t border-border">
          <ul className="flex flex-col p-4 gap-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.isRoute ? (
                  <Link
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}

            {/* Mobile auth */}
            <li className="pt-3 mt-1 border-t border-border/40">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm text-foreground/80 font-medium truncate">
                      {user?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors px-3 py-1.5 rounded-md"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center text-sm text-muted-foreground hover:text-primary py-2 rounded-md border border-border/40 hover:border-primary/40 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 py-2 rounded-md transition-all shadow-[0_0_15px_hsl(155_100%_45%/0.25)]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
