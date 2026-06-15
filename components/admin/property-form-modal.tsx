"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Property } from "@/lib/db-schema";

const propertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  location: z.string().min(3, "Location is required"),
  price: z.string().regex(/^\d+(\.\d{2})?$/, "Enter valid price"),
  description: z.string().optional(),
  status: z.enum(["available", "sold"]),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: PropertyFormData & { amenities: string[] },
    imageFiles?: File[],
  ) => Promise<void>;
  property?: Property;
}

const AMENITIES = [
  "water",
  "electricity",
  "ready_title",
  "beacons_set",
  "fenced",
];

export function PropertyFormModal({
  isOpen,
  onClose,
  onSubmit,
  property,
}: PropertyFormModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    property?.amenities || [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: property
      ? {
          title: property.title,
          location: property.location,
          price: String(property.price),
          description: property.description ?? undefined,
          status: property.status,
        }
      : undefined,
  });

  const handleFormSubmit: SubmitHandler<PropertyFormData> = async (data) => {
    setSubmitting(true);
    try {
      await onSubmit(
        { ...data, amenities: selectedAmenities },
        imageFiles.length > 0 ? imageFiles : undefined,
      );
      reset();
      setImageFiles([]);
      setSelectedAmenities([]);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleMultipleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-primary">
            {property ? "Edit Property" : "Add New Property"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close property form"
            className="p-1 hover:bg-muted rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Property Title
            </label>
            <input
              type="text"
              placeholder="e.g., Plot in Thika Town"
              {...register("title")}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="Thika Town"
                {...register("location")}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {errors.location && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Price (KES)
              </label>
              <input
                type="text"
                placeholder="1500000.00"
                {...register("price")}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {errors.price && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Status
            </label>
            <select
              {...register("status")}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Description
            </label>
            <textarea
              placeholder="Detailed description of the property..."
              {...register("description")}
              rows={3}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-primary mb-2"
              htmlFor="property-images"
            >
              Property Images (Multiple)
            </label>
            <input
              id="property-images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleMultipleImages}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            {imageFiles.length > 0 && (
              <p className="text-sm text-accent mt-2">
                {imageFiles.length} image(s) selected
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-3">
              Amenities
            </label>
            <div className="grid grid-cols-2 gap-3">
              {AMENITIES.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAmenities([...selectedAmenities, amenity]);
                      } else {
                        setSelectedAmenities(
                          selectedAmenities.filter((a) => a !== amenity),
                        );
                      }
                    }}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm text-primary capitalize">
                    {amenity.replace("_", " ")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {submitting ? "Saving..." : "Save Property"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
