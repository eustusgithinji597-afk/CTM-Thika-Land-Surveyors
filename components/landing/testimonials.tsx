import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Grace Wanjiru',
    role: 'Property Owner, Thika',
    text: 'CTM Thika Surveyors made the entire process of buying my plot seamless. Their due diligence was thorough, and I received my title deed within weeks. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Peter Mwangi',
    role: 'Real Estate Developer',
    text: 'We have used CTM for multiple cadastral surveys across Kiambu County. Their professionalism and accuracy is unmatched. They handle everything from start to finish.',
    rating: 5,
  },
  {
    name: 'Mary Njeri',
    role: 'First-Time Land Buyer',
    text: 'I was nervous about buying land for the first time. CTM guided me through every step — from plot verification to title transfer. They truly care about their clients.',
    rating: 5,
  },
  {
    name: 'James Kariuki',
    role: 'Business Owner, Juja',
    text: 'Needed a mutation form for subdividing my property. CTM handled all the documentation and survey work professionally. Saved me so much time and stress.',
    rating: 5,
  },
  {
    name: 'Alice Wambui',
    role: 'Landlord, Gatanga Road',
    text: 'The team at CTM is trustworthy and efficient. They helped me transfer property ownership to my children with zero complications. Outstanding service!',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#EDF4F7]" id="testimonials">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-3">What Our Clients Say</h2>
          <p className="text-lg text-[#27415C]">Trusted by over 1000+ clients across Kenya</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#FAFCFD] rounded-xl border-2 border-[#D8E5EB] hover:border-[#E3C34F] hover:shadow-xl transition-all duration-300 p-6"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#E3C34F] text-[#E3C34F]" />
                ))}
              </div>

              {/* Quote */}
              <div className="relative mb-4">
                <Quote className="w-8 h-8 text-[#E3C34F]/30 absolute -top-1 -left-1" />
                <p className="text-sm text-[#344B5F] leading-relaxed pl-6 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="border-t border-[#D8E5EB] pt-4 mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0B3D66] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-primary">{testimonial.name}</p>
                    <p className="text-xs text-[#65798A]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
