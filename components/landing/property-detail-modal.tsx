"use client";

import { useState } from "react";
import { Property } from "@/types";
import { X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyDetailModal({
  property,
  isOpen,
  onClose,
}: PropertyDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !property) return null;

  const allImages =
    property.image_urls && property.image_urls.length > 0
      ? property.image_urls
      : property.image_url
        ? [property.image_url]
        : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length,
    );
  };

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in booking a viewing for: ${property.title} at ${property.location}`,
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-[#0F294A]">
            {property.title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close property details"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Image Carousel */}
          {allImages.length > 0 && (
            <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-video">
              <img
                src={allImages[currentImageIndex]}
                alt={`Property image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition"
                  >
                    <ChevronLeft className="w-6 h-6 text-[#0F294A]" />
                  </button>
                  <button
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition"
                  >
                    <ChevronRight className="w-6 h-6 text-[#0F294A]" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {allImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        aria-label={`Go to image ${idx + 1}`}
                        className={`w-2 h-2 rounded-full transition ${
                          idx === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Property Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F8F9FA] p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Location</p>
              <p className="text-lg font-semibold text-[#0F294A]">
                {property.location}
              </p>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Price</p>
              <p className="text-lg font-semibold text-[#F5A623]">
KES {Number(property.price).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Status</p>
            <Badge
              className={`${
                property.status === "available"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {property.status === "available" ? "🟢 Available" : "🔴 Sold Out"}
            </Badge>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <p className="text-sm font-medium text-[#0F294A] mb-3">
                Amenities
              </p>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <Badge
                    key={amenity}
                    className="bg-[#F8F9FA] text-[#0F294A] border border-gray-200"
                  >
                    {amenity.replace("_", " ")}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {property.description && (
            <div>
              <p className="text-sm font-medium text-[#0F294A] mb-2">
                Description
              </p>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>
          )}

          {/* CTA Section */}
          <div className="pt-6 border-t border-gray-200 space-y-4">
            <div className="bg-linear-to-r from-[#F5A623]/10 to-[#0F294A]/10 p-4 rounded-lg border border-[#F5A623]/30">
              <h3 className="font-bold text-lg text-[#0F294A] mb-2 flex items-center gap-2">
                📍 Request Site Visit Booking
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Interested in viewing {property.title}? Contact us now to
                schedule your site visit.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href={`https://wa.me/254769311896?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-6 text-base">
                    💬 WhatsApp Booking
                  </Button>
                </a>
                <Button
                  onClick={onClose}
                  className="w-full bg-[#F5A623] hover:bg-[#F5A623]/90 text-[#0F294A] font-bold py-6 text-base"
                >
                  📋 Fill Contact Form
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
