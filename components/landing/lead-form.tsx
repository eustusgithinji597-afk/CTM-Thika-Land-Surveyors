'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+?254\d{9}$/, 'Enter valid Kenyan phone number'),
  serviceType: z.enum(['survey', 'plot_booking', 'mutation_forms']),
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
          `Hi, I just submitted a lead for ${data.serviceType.replace('_', ' ')} service. Phone: ${data.phone}`
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#FFFDF7] rounded-lg border border-[#E7DDAF] p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-primary mb-2">Get in Touch</h2>
          <p className="text-[#40576A] mb-8">
            Tell us about your land surveying needs and we&apos;ll contact you shortly
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                {...register('name')}
                className="w-full px-4 py-2 bg-white border border-[#D6DCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+254721398102 or 0721398102"
                {...register('phone')}
                className="w-full px-4 py-2 bg-white border border-[#D6DCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Service Type
              </label>
              <select
                {...register('serviceType')}
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

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                Thanks for reaching out! We&apos;ll contact you soon via WhatsApp.
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit Inquiry'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
