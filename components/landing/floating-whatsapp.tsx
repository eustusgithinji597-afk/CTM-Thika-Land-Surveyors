'use client';

import { MessageCircle } from 'lucide-react';

export function FloatingWhatsApp() {
  const whatsappNumber = '254769311896';
  const whatsappMessage = encodeURIComponent(
    'Hi CTM Thika Land Surveyors, I am interested in your services.'
  );

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
}
