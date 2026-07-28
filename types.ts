// Define explicit types matching your PostgreSQL ENUM configurations
export type PropertyStatus = 'available' | 'sold';
export type ServiceType = 'survey' | 'plot_booking' | 'mutation_forms';
export type LeadStatus = 'new' | 'contacted';

// Structure for Real Estate Listings (Properties Table)
export interface Property {
  id: string; // UUID mapping
  title: string;
  location: string;
  price: number;
  image_url: string | null;
  image_urls: string[]; // Supports multiple field photos
  description: string;
  status: PropertyStatus;
  amenities: string[];
  created_at: string;
  updated_at: string;
}

// Structure for Contact Form Submissions (Leads Table)
export interface Lead {
  id: string; // UUID mapping
  name: string;
  phone: string;
  service_type: ServiceType;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

// Helper structure for inserting new listings (omits auto-generated database keys)
export type InsertPropertyInput = Omit<Property, 'id' | 'created_at' | 'updated_at'>;
export type InsertLeadInput = Omit<Lead, 'id' | 'created_at' | 'updated_at'>;
