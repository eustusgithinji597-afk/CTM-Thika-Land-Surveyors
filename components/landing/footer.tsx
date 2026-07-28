import { Phone, MessageCircle, MapPin, Mail, Share2, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-primary to-primary/95 text-white py-16 px-4 sm:px-6 lg:px-8 border-t-4 border-accent">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-bold text-xl mb-3 text-accent">CTM Thika Land Surveyors</h3>
            <p className="text-white/80 text-sm mb-4 leading-relaxed">
              Professional land surveying and property documentation services in Thika, Kenya.
            </p>
            <p className="text-accent font-semibold text-sm">Licensed & Certified Surveyors</p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#properties" className="text-white/80 hover:text-accent transition">
                  Available Properties
                </a>
              </li>
              <li>
                <a href="#services" className="text-white/80 hover:text-accent transition">
                  Our Services
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white/80 hover:text-accent transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
            <div className="space-y-4 text-sm">
              <a
                href="tel:+254769311896"
                className="flex items-center gap-2 text-white/80 hover:text-accent transition"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                +254 769 311 896
              </a>
              <a
                href={`https://wa.me/254769311896`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/80 hover:text-accent transition"
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                Message on WhatsApp
              </a>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                Thika, Johana Center, RM 201
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-sm text-white/60">
              © {new Date().getFullYear()} CTM Thika Land Surveyors. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/ctmthika"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-accent/30 rounded-full flex items-center justify-center transition text-white hover:text-accent"
                title="Instagram"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <circle cx="17.5" cy="6.5" r="1.5"></circle>
                </svg>
              </a>
              <a
                href="https://facebook.com/ctmthika"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-accent/30 rounded-full flex items-center justify-center transition text-white hover:text-accent"
                title="Facebook"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                </svg>
              </a>
              <a
                href="https://x.com/ctmthika"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-accent/30 rounded-full flex items-center justify-center transition text-white hover:text-accent"
                title="X (Twitter)"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.207-6.802-5.997 6.802H2.25l7.73-8.835L2.25 2.25h6.826l4.707 6.217 5.456-6.217zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>
              <a
                href="https://tiktok.com/@ctmthika"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-accent/30 rounded-full flex items-center justify-center transition text-white hover:text-accent"
                title="TikTok"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.889 2.889 0 0 1 2.31-4.64 2.849 2.849 0 0 1 .64.08v-3.45a6.26 6.26 0 0 0-5.63 5.63v9.12a6.26 6.26 0 0 0 10.88-3.71 6.28 6.28 0 0 0 7.45-6.16v-5.02a6.26 6.26 0 0 0 3.74-5.88z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
