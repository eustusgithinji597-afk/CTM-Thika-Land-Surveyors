"use client";

import { useEffect, useState } from "react";
import { Property } from "@/types";
import { supabasePublic } from "@/lib/supabase-client";
import { PropertyDetailModal } from "./property-detail-modal";

export function PropertiesGrid({
  initialProperties,
}: {
  initialProperties: Property[];
}) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    // Keep local component state in sync with server data loads
    setProperties(initialProperties);

    if (!supabasePublic) return;

    // Subscribe to any row alterations inside the properties table live
    const channel = supabasePublic
      .channel("realtime-plots-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "properties" },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;

          setProperties((currentPlots) => {
            if (eventType === "INSERT") {
              return [newRecord as Property, ...currentPlots];
            }
            if (eventType === "UPDATE") {
              return currentPlots.map((plot) =>
                plot.id === (newRecord as Property).id
                  ? (newRecord as Property)
                  : plot,
              );
            }
            if (eventType === "DELETE") {
              return currentPlots.filter((plot) => plot.id !== oldRecord.id);
            }
            return currentPlots;
          });
        },
      )
      .subscribe();

    // Safely unbind from the WebSocket stream when the user leaves the page
    return () => {
      channel.unsubscribe();
    };
  }, [initialProperties]);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-[#0F294A]">
        📍 Verified Plots for Sale
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {properties.length === 0 ? (
          <p className="text-gray-500 col-span-3 text-center py-10">
            No active listings available. Check back soon!
          </p>
        ) : (
          properties.map((plot) => {
            const displayImage =
              plot.image_url ||
              (plot.image_urls && plot.image_urls.length > 0
                ? plot.image_urls[0]
                : null);

            return (
              <div
                key={plot.id}
                onClick={() => {
                  setSelectedProperty(plot);
                  setIsDetailOpen(true);
                }}
                className="border rounded-lg overflow-hidden shadow-sm bg-white transition hover:shadow-lg hover:scale-105 cursor-pointer"
              >
                {/* Image */}
                <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={plot.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <div className="text-center">
                        <p className="text-4xl mb-2">🔍</p>
                        <p className="text-sm text-gray-600">
                          Verification in Progress
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-[#0F294A]">
                    {plot.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{plot.location}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="font-bold text-[#F5A623]">
                      KES {Number(plot.price).toLocaleString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        plot.status === "available"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {plot.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <PropertyDetailModal
        property={selectedProperty}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </section>
  );
}
