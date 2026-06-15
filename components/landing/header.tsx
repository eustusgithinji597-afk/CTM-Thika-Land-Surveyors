import { Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const whatsappNumber = '254769311896';
  const whatsappMessage = encodeURIComponent(
    'Hi CTM Thika Land Surveyors, I am interested in your services.'
  );

  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-primary via-primary to-primary/95 shadow-xl z-40 border-b-4 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <a href="#home" className="flex items-center gap-3 hover:opacity-90 transition">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CTM%20Logo-oPjzX4abj1S3rVa9Kv4TUOXlK05pJE.png" 
            alt="CTM Logo"
            className="h-16 w-auto"
          />
          <div className="hidden sm:flex flex-col">
            <span className="font-bold text-white text-base tracking-wide">CTM Thika</span>
            <span className="text-xs text-white/80">Licensed Land Surveyors</span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-6">
          <a href="#services" className="text-white hover:text-accent transition text-sm font-medium">Services</a>
          <a href="#properties" className="text-white hover:text-accent transition text-sm font-medium">Properties</a>
          <a href="#contact" className="text-white hover:text-accent transition text-sm font-medium">Contact</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <a href={`tel:+${whatsappNumber}`}>
            <Button
              size="sm"
              className="hidden sm:flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border border-white/30"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">+254 769 311 896</span>
            </Button>
          </a>
          <a href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer">
            <Button
              size="sm"
              className="bg-accent hover:bg-accent/90 text-primary font-bold flex items-center gap-2 shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
