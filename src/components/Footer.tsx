import { Phone, Mail, MapPin, Instagram } from "lucide-react";
import { FaTiktok, FaLinkedin } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="gradient-hero text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Spurmount Trading & Investments</h3>
            <p className="text-sm text-primary-foreground/80 mb-4">
              Eat Quality, Live Quality
            </p>
            <p className="text-sm text-primary-foreground/70">
              Your trusted wholesale partner for quality groceries and household products.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/how-to-order" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  How to Order
                </Link>
              </li>
              <li>
                <Link to="/payments" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  Payments
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-primary-foreground/80">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+254 740 581156</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-primary-foreground/80">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>spurmounttradinginvestment@gmail.com</span>
              </li>
              <li className="flex items-start space-x-2 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/spur.mounttradingwholesalers/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Visit our Instagram"
                title="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/spurmount-trading-and-investments-a4968b389" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Connect with us on LinkedIn"
                title="Connect with us on LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@spurmountradinginvestmet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Visit our TikTok"
                title="Follow us on TikTok"
              >
                <FaTiktok className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/70">
          <p>&copy; {new Date().getFullYear()} Spurmount Trading & Investments Wholesalers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
