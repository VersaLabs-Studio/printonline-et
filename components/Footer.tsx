// components/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-pana-gradient border-t border-border/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="relative w-64 h-64 shrink-0">
                <Image
                  src="/footer-logo.png"
                  alt="Print Online ET Footer Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Devoted to Quality printing and branding solutions in Ethiopia
              since 2016.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/digital-paper-prints"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Digital Paper Prints
                </Link>
              </li>
              <li>
                <Link
                  href="/signage-solutions"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Signage Solutions
                </Link>
              </li>
              <li>
                <Link
                  href="/flex-banners"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Flex Banners
                </Link>
              </li>
              <li>
                <Link
                  href="/vinyl-prints"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Vinyl Prints & Wraps
                </Link>
              </li>
              <li>
                <Link
                  href="/fabric-prints"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Fabric Prints
                </Link>
              </li>
              <li>
                <Link
                  href="/promotional-items"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Promotional Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Hayahulet Rd. Infront of Worku Bld, Wakero Bld. Addis Ababa,
                  Ethiopia
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">
                  +251 116 68 69 40
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">
                  +251 911 00 52 55
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">
                  +251 924 10 67 67
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">
                  +251 983 26 75 43
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">
                  panapromotionplc@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-pana my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} printonline.et. All rights reserved.
          </p>

          {/* 
          <div className="flex items-center gap-15 mt-4 md:mt-0 bg-neutral-900 px-4 py-2.5 rounded-lg border border-white/10 shadow-sm hover:bg-black transition-colors group cursor-pointer">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest group-hover:text-white/60 transition-colors">
              Built by
            </span>
            <div className="flex items-center opacity-100 group-hover:opacity-100 transition-opacity">
              <img
                src="/yonniny.png"
                alt="Yonniny - Digital Service"
                className="h-10 w-auto bg bg-neutral-900"
              />
            </div>
          </div>
          */}

          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
