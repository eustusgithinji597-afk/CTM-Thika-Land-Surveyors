'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/lib/db-schema';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface PropertiesTableProps {
  onAddClick: () => void;
  onEditClick: (property: Property) => void;
  onDelete: (id: string) => Promise<void>;
}

export function PropertiesTable({
  onAddClick,
  onEditClick,
  onDelete,
}: PropertiesTableProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/properties');
      if (res.ok) {
        setProperties(await res.json());
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    setDeleting(id);
    try {
      await onDelete(id);
      setProperties(properties.filter((p) => p.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-primary">Properties</h1>
        <Button
          onClick={onAddClick}
          className="bg-primary hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-12">
          Loading properties...
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center bg-white rounded-lg border border-border p-12">
          <p className="text-muted-foreground mb-4">No properties yet</p>
          <Button
            onClick={onAddClick}
            className="bg-primary hover:bg-primary/90"
          >
            Add First Property
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {properties.map((property) => (
                  <tr
                    key={property.id}
                    className="hover:bg-muted/50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {property.imageUrl ? (
                          <div className="relative w-10 h-10 bg-muted rounded">
                            <Image
                              src={property.imageUrl}
                              alt={property.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded" />
                        )}
                        <div>
                          <p className="font-medium text-primary line-clamp-1">
                            {property.title}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">
                        {property.location}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-accent">
                        KES {parseFloat(property.price).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          property.status === 'available'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {property.status === 'available'
                          ? 'Available'
                          : 'Sold'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => onEditClick(property)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(property.id)}
                          disabled={deleting === property.id}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
