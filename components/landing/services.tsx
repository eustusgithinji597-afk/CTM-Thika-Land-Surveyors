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

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-transparent" id="services">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-3">Our Services</h2>
          <p className="text-lg text-foreground/70">Complete surveying solutions for all your property needs</p>
          <div className="inline-block mt-4 px-4 py-2 bg-accent/20 rounded-full">
            <p className="text-accent font-semibold text-sm">Licensed & Registered Surveyors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const searchQuery = encodeURIComponent(service.title + ' Kenya');
            const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
            return (
              <a
                key={index}
                href={searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl border-2 border-transparent hover:border-accent hover:shadow-xl transition-all duration-300 group overflow-hidden block p-6"
              >
                <h3 className="font-bold text-lg text-primary mb-2 group-hover:text-accent transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {service.description}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
