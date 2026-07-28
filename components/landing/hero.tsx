import { Button } from '@/components/ui/button';
import { MessageCircle, Phone } from 'lucide-react';

export function Hero() {
  const displayPhone = '0769311896';
  const whatsappNumber = '254769311896';
  const whatsappMessage = encodeURIComponent(
    'Hi CTM Thika Land Surveyors, I am interested in your services.'
  );

  return (
    <section className="relative pt-40 pb-20 px-4 sm:px-6 lg:px-8 min-h-[650px] flex items-center justify-center overflow-hidden" id="home">
      {/* Background Banner Container */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner-NPPMV89GDge2U0a7vuGEfcXbI9tYQm.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: ''
        }}
      />
      
      {/* High-Contrast Tint Overlays for Superb Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/75 to-primary/80 z-[1] backdrop-blur-[1px]"></div>
      
      {/* Interactive Content Layout */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Glowing Badge Component */}
        <div className="text-center mb-6">
          <div className="inline-block px-4 py-2 bg-black border border-white/20 rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.7)] hover:shadow-[0_0_25px_rgba(239,68,68,0.9)] transition-all duration-500">
            <p className="font-bold text-sm tracking-wide bg-gradient-to-r from-blue-400 via-white to-red-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]">
              Licensed & Registered Surveyors
            </p>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 text-balance leading-tight drop-shadow-xl">
          Professional Land Survey Services in Thika
        </h1>
        
        <p className="text-lg sm:text-xl text-white/95 mb-8 max-w-2xl mx-auto text-balance font-medium drop-shadow-md">
          Licensed land surveyors providing expert cadastral surveys, property documentation, and plot booking services. Trusted by over 1000+ clients.
        </p>
        
        {/* Dynamic Action Call Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href={`tel:${displayPhone}`} className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-primary font-bold shadow-lg transition-transform hover:scale-[1.02]">
              <Phone className="w-5 h-5" />
              Call Now: {displayPhone}
            </Button>
          </a>
          
          <a href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold shadow-lg transition-transform hover:scale-[1.02]">
              <MessageCircle className="w-5 h-5" />
              Message on WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
