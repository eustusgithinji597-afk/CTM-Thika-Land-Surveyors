"use client";

import { useState } from "react";
import { Property } from "@/lib/db-schema";
import { PropertiesTable } from "@/components/admin/properties-table";
import { PropertyFormModal } from "@/components/admin/property-form-modal";

export default function PropertiesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<
    Property | undefined
  >();

  const handleAddClick = () => {
    setEditingProperty(undefined);
    setIsModalOpen(true);
  };

  const MAX_IMAGE_FILE_SIZE = 50 * 1024 * 1024; // 50MB per file

  const handleEditClick = (property: Property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any, imageFiles?: File[]) => {
    try {
      let imageUrls: string[] = editingProperty?.imageUrls || [];
      let imageUrl = editingProperty?.imageUrl;

      if (imageFiles && imageFiles.length > 0) {
        const oversized = imageFiles.filter(
          (file) => file.size > MAX_IMAGE_FILE_SIZE,
        );
        if (oversized.length > 0) {
          alert(`File too large: ${oversized[0].name}. Max size: 50MB`);
          return;
        }

        const formData = new FormData();
        imageFiles.forEach((file) => {
          formData.append("file", file);
        });

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json().catch(() => null);
          alert(errorData?.error || "Image upload failed");
          return;
        }

        const response = await uploadRes.json();
        // Handle both single file (url) and multiple files (urls)
        if (response.urls) {
          imageUrls = response.urls;
          imageUrl = response.urls[0]; // Set first URL as main image
        } else if (response.url) {
          imageUrls = [response.url];
          imageUrl = response.url;
        }
      }

      const payload = {
        ...data,
        price: Number(data.price),
        imageUrl,
        imageUrls,
        amenities: data.amenities,
      };

      const url = editingProperty ? `/api/properties` : `/api/properties`;
      const method = editingProperty ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingProperty ? { id: editingProperty.id, ...payload } : payload,
        ),
      });

      if (!response.ok) {
        const responseBody = await response.json().catch(() => null);
        console.error("Property save failed", response.status, responseBody);
        alert(
          `Error saving property: ${responseBody?.error ?? response.statusText}`,
        );
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error saving property");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/properties?id=${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Error deleting property");
    }
  };

  return (
    <>
      <PropertiesTable
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onDelete={handleDelete}
      />
      <PropertyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        property={editingProperty}
      />
    </>
  );
}
