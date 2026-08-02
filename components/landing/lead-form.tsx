'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+?254\d{9}$/, 'Enter valid Kenyan phone number'),
  email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
  serviceType: z.enum(['survey', 'plot_booking', 'mutation_forms']),
  message: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

export function LeadForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
        reset();
        setTimeout(() => setSuccess(false), 3000);

        const whatsappMessage = encodeURIComponent(
          `Hi, I just submitted a lead for ${data.serviceType.replace('_', ' ')} service.\n\nName: ${data.name}\nPhone: ${data.phone}${data.email ? `\nEmail: ${data.email}` : ''}${data.message ? `\nMessage: ${data.message}` : ''}`
        );
        window.open(
          `https://wa.me/254769311896?text=${whatsappMessage}`,
          '_blank'
        );
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8F4EA]" id="contact">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info Side */}
          <div className="bg-[#0B3D66] rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
            <p className="text-white/80 mb-8">
              Tell us about your land surveying needs and we&apos;ll contact you shortly
            </p>

            <div className="space-y-6">
              <a href="tel:+254769311896" className="flex items-center gap-4 text-white/90 hover:text-accent transition">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Call Us</p>
                  <p className="text-sm text-white/70">+254 769 311 896</p>
                </div>
              </a>

              <a href="mailto:ctmthika@gmail.com" className="flex items-center gap-4 text-white/90 hover:text-accent transition">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Email Us</p>
                  <p className="text-sm text-white/70">ctmthika@gmail.com</p>
                </div>
              </a>

              <a href="https://wa.me/254769311896" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/90 hover:text-accent transition">
                <div className="w-12 h-12 rounded-full bg-[#25D366]/80 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-sm text-white/70">Chat with us instantly</p>
                </div>
              </a>

              <div className="flex items-center gap-4 text-white/90">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Visit Us</p>
                  <p className="text-sm text-white/70">Thika, Johana Center, RM 201</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-[#FFFDF7] rounded-lg border border-[#E7DDAF] p-8 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  required
                  {...register('name')}
                  className="w-full px-4 py-2 bg-white border border-[#D6DCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+254721398102 or 0721398102"
                  required
                  {...register('phone')}
                  className="w-full px-4 py-2 bg-white border border-[#D6DCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  {...register('email')}
                  className="w-full px-4 py-2 bg-white border border-[#D6DCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Service Type *
                </label>
                <select
                  {...register('serviceType')}
                  required
                  className="w-full px-4 py-2 bg-white border border-[#D6DCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Select a service</option>
                  <option value="survey">Land Surveying</option>
                  <option value="plot_booking">Plot Booking</option>
                  <option value="mutation_forms">Mutation Forms</option>
                </select>
                {errors.serviceType && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.serviceType.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Message
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your project..."
                  {...register('message')}
                  className="w-full px-4 py-2 bg-white border border-[#D6DCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                  Thanks for reaching out! We&apos;ll contact you soon via WhatsApp.
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#25D366] hover:bg-[#20BA5A] flex items-center justify-center gap-2 text-white font-bold"
              >
                <MessageCircle className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Send via WhatsApp'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
