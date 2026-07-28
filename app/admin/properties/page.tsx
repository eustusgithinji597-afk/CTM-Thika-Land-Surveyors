"use client";

import { useState } from "react";
import type { Property } from "@/lib/db-schema";
import { PropertiesTable } from "@/components/admin/properties-table";
import { PropertyFormModal } from "@/components/admin/property-form-modal";

const MAX_COMPRESSED_WIDTH = 1600;
const JPEG_QUALITY = 0.8;

function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > MAX_COMPRESSED_WIDTH) {
        height = Math.round(height * (MAX_COMPRESSED_WIDTH / width));
        width = MAX_COMPRESSED_WIDTH;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Compression failed"));
          const name = file.name.replace(/\.[^.]+$/, ".jpg");
          resolve(new File([blob], name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        JPEG_QUALITY,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for compression"));
    };
    img.src = url;
  });
}

export default function PropertiesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<
    Property | undefined
  >();

  const handleAddClick = () => {
    setEditingProperty(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (property: Property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any, imageFiles?: File[]) => {
    try {
      let imageUrls: string[] = (editingProperty as any)?.image_urls || [];
      let imageUrl = (editingProperty as any)?.image_url;

      if (imageFiles && imageFiles.length > 0) {
        const compressed = await Promise.all(imageFiles.map(compressImage));

        const formData = new FormData();
        compressed.forEach((file) => {
          formData.append("file", file);
        });

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json().catch(() => null);
          const message =
            errorData?.error ||
            errorData?.details?.message ||
            `Upload failed (HTTP ${uploadRes.status})`;
          alert(message);
          return;
        }

        const response = await uploadRes.json();
        if (response.urls) {
          imageUrls = response.urls;
          imageUrl = response.urls[0];
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

      const url = `/api/properties`;
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
