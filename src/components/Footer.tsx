import { Link } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-card py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoIcon} alt="HungerConnect" className="h-9 w-9" />
              <span className="font-heading text-xl font-bold text-primary">HungerConnect</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Empowering communities across India to reduce food waste and combat hunger through AI-driven logistics and local volunteer networks.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4 text-primary-light">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a></li>
              <li><a href="#impact" className="hover:text-primary transition-colors">Impact</a></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Join Community</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4 text-primary-light">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>hello@hungerconnect.in</li>
              <li>+91 98765 43210</li>
              <li>India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-muted-foreground/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2026 HungerConnect Platform. All rights reserved.</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart size={12} className="text-primary" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
