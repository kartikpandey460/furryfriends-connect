import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, setUser } = useAuth();
  const location = useLocation();

  const baseLinks = [
    { to: "/", label: "Home" },
    { to: "/dogs", label: "Adopt a Dog" },
    { to: "/shelters", label: "Shelters" },
    { to: "/donate", label: "Donate" },
  ];

  const adminLinks = [
    { to: "/admin", label: "Admin Dashboard" },
    { to: "/adoption-requests", label: "Adoption Requests" },
  ];

  const links = user && user.role === 'admin' ? [...baseLinks, ...adminLinks] : baseLinks;

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    // Optional: redirect to home page
    // window.location.href = '/';
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-7 w-7 text-primary" fill="currentColor" />
          <span className="font-display text-xl font-bold text-foreground">
            Furry<span className="text-primary">Souls</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-4 flex items-center gap-2">
            {user ? (
              // Show user info and logout when logged in
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.name}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              // Show login/signup when not logged in
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t bg-card px-4 pb-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              // Show user info and logout when logged in
              <>
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Welcome, {user.name}
                </div>
                <Button variant="ghost" size="sm" className="justify-start" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              // Show login/signup when not logged in
              <>
                <Button asChild variant="ghost" size="sm" className="justify-start">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
                </Button>
                <Button asChild size="sm" className="justify-start">
                  <Link to="/register" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
