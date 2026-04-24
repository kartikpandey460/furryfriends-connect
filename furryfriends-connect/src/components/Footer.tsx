import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t bg-card">
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-3">
            <Heart className="h-6 w-6 text-primary" fill="currentColor" />
            <span className="font-display text-lg font-bold text-foreground">
              Furry<span className="text-primary">Souls</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Connecting furry souls with loving homes since 2020.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/dogs" className="hover:text-primary transition-colors">Adopt a Dog</Link>
            <Link to="/shelters" className="hover:text-primary transition-colors">Shelters</Link>
            <Link to="/donate" className="hover:text-primary transition-colors">Donate</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>hello@furrysouls.org</span>
            <span>+91 80 1234 5678</span>
            <span>New Delhi, India</span>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Follow Us</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>Instagram</span>
            <span>Twitter</span>
            <span>Facebook</span>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
        © 2026 FurrySouls. All rights reserved. Made with ❤️ for every stray.
      </div>
    </div>
  </footer>
);

export default Footer;
