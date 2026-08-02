import { Award, Users, MapPin, CheckCircle, Target, Shield } from 'lucide-react';

export function About() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" id="about">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-block px-4 py-2 bg-[#FFF3B0] rounded-full border border-[#E3C34F]/50 mb-6">
              <p className="text-[#0B3D66] font-semibold text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Licensed & Registered
              </p>
            </div>

            <h2 className="text-4xl font-bold text-primary mb-6">
              About CTM Thika Land Surveyors
            </h2>

            <p className="text-[#344B5F] leading-relaxed mb-4">
              CTM Thika Land Surveyors is a professional land surveying firm based in Thika, Kiambu County, Kenya. We specialize in cadastral surveys, property documentation, and land advisory services.
            </p>

            <p className="text-[#344B5F] leading-relaxed mb-6">
              With over a decade of experience serving clients across Kiambu County and beyond, we combine modern surveying technology with deep local knowledge to deliver accurate, reliable results for every project.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#E3C34F]/20 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-[#8A6A00]" />
                </div>
                <div>
                  <p className="font-bold text-primary text-sm">Licensed</p>
                  <p className="text-xs text-[#65798A]">Board of Registration</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#E3C34F]/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-[#8A6A00]" />
                </div>
                <div>
                  <p className="font-bold text-primary text-sm">1000+ Clients</p>
                  <p className="text-xs text-[#65798A]">Served Nationwide</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#E3C34F]/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#8A6A00]" />
                </div>
                <div>
                  <p className="font-bold text-primary text-sm">Thika Based</p>
                  <p className="text-xs text-[#65798A]">Local Expertise</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#E3C34F]/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#8A6A00]" />
                </div>
                <div>
                  <p className="font-bold text-primary text-sm">Fast Turnaround</p>
                  <p className="text-xs text-[#65798A]">Quick Delivery</p>
                </div>
              </div>
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-[#0B3D66] hover:bg-[#0B3D66]/90 text-white font-bold px-6 py-3 rounded-lg transition-colors duration-300"
            >
              <Target className="w-4 h-4" />
              Get Free Consultation
            </a>
          </div>

          {/* Right: Visual Card */}
          <div className="bg-gradient-to-br from-[#0B3D66] to-[#0F294A] rounded-2xl p-8 text-white">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Our Mission</h3>
              <div className="w-16 h-1 bg-[#E3C34F] rounded-full" />
            </div>

            <p className="text-white/90 leading-relaxed mb-8">
              To provide accurate, reliable, and professional land surveying services that protect our clients&apos; investments and simplify property transactions across Kenya.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                <CheckCircle className="w-5 h-5 text-[#E3C34F] flex-shrink-0" />
                <p className="text-sm">100% accurate boundary measurements</p>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                <CheckCircle className="w-5 h-5 text-[#E3C34F] flex-shrink-0" />
                <p className="text-sm">Full legal compliance guaranteed</p>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                <CheckCircle className="w-5 h-5 text-[#E3C34F] flex-shrink-0" />
                <p className="text-sm">Transparent pricing with no hidden fees</p>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                <CheckCircle className="w-5 h-5 text-[#E3C34F] flex-shrink-0" />
                <p className="text-sm">Dedicated project manager for every client</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
