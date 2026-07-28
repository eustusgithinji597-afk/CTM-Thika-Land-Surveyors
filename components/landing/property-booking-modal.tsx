"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { X, MessageCircle } from "lucide-react";

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\+?254\d{9}$/, "Enter valid Kenyan phone number"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface PropertyBookingModalProps {
  propertyTitle: string;
  propertyLocation: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyBookingModal({
  propertyTitle,
  propertyLocation,
  isOpen,
  onClose,
}: PropertyBookingModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          serviceType: "plot_booking",
          propertyTitle: `${propertyTitle} — ${propertyLocation}`,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        reset();

        const whatsappMessage = encodeURIComponent(
          `Hi, I'd like to book ${propertyTitle} at ${propertyLocation}. My phone is ${data.phone}.`,
        );
        window.open(
          `https://wa.me/254769311896?text=${whatsappMessage}`,
          "_blank",
        );

        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2500);
      }
    } catch {
      console.error("Error submitting booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-[#0F294A]">
            Book This Property
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Requesting:{" "}
            <span className="font-semibold text-[#0F294A]">
              {propertyTitle}
            </span>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                {...register("name")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+254721398102"
                {...register("phone")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Service Type
              </label>
              <input
                type="text"
                value="Plot Booking"
                disabled
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                Booking request sent! We&apos;ll contact you shortly.
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#F5A623] hover:bg-[#F5A623]/90 text-[#0F294A] font-bold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              {submitting ? "Submitting..." : "Submit Booking Request"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}