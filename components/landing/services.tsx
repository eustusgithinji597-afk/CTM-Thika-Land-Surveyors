'use client';

import { Search } from 'lucide-react';

export function Services() {
  const services = [
    {
      title: 'Cadastral Survey',
      description: 'Professional cadastral surveys with accurate property boundary measurements',
    },
    {
      title: 'Topographical Survey',
      description: 'Detailed topographical surveys for accurate terrain mapping and documentation',
    },
    {
      title: 'Engineering Survey',
      description: 'Specialized engineering surveys for infrastructure and construction projects',
    },
    {
      title: 'Map Production',
      description: 'Professional map production and cartographic services for property records',
    },
    {
      title: 'Sectional Properties',
      description: 'Surveys and documentation for sectional property divisions and strata titles',
    },
    {
      title: 'Equipment Hire',
      description: 'Professional surveying equipment rental and technical support services',
    },
    {
      title: 'Transfer & Succession',
      description: 'Land transfer and succession documentation with legal compliance',
    },
    {
      title: 'Agreement & GIS',
      description: 'Land agreements, boundary agreements, and GIS mapping services',
    },
    {
      title: 'Drone Mapping & Topographical GIS Profiling',
      description: 'Advanced drone technology for aerial surveys and 3D terrain modeling with precision GIS analysis',
    },
  ];

  const handleServiceClick = (serviceTitle: string) => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#EDF4F7]" id="services">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-3">Our Services</h2>
          <p className="text-lg text-[#27415C]">Complete surveying solutions for all your property needs</p>
          <div className="inline-block mt-4 px-4 py-2 bg-[#FFF3B0] rounded-full border border-[#E3C34F]/50">
            <p className="text-[#0B3D66] font-semibold text-sm">Licensed & Registered Surveyors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => handleServiceClick(service.title)}
              className="bg-[#FAFCFD] rounded-xl border-2 border-[#D8E5EB] hover:border-[#E3C34F] hover:shadow-xl transition-all duration-300 group overflow-hidden block p-6 cursor-pointer"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#0B3D66]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#E3C34F]/20 transition-colors duration-300">
                  <Search className="w-5 h-5 text-[#0B3D66] group-hover:text-[#8A6A00] transition-colors duration-200" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary group-hover:text-[#8A6A00] transition-colors duration-200">
                    {service.title}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-[#344B5F] leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
