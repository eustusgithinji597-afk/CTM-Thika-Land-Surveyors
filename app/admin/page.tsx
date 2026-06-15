'use client';

import { useEffect, useState } from 'react';
import { Home, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { MetricsCard } from '@/components/admin/metrics-card';
import { Property } from '@/lib/db-schema';
import { Lead } from '@/lib/db-schema';

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propsRes, leadsRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/leads'),
        ]);

        if (propsRes.ok) {
          setProperties(await propsRes.json());
        }
        if (leadsRes.ok) {
          setLeads(await leadsRes.json());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalListings = properties.length;
  const availablePlots = properties.filter(p => p.status === 'available').length;
  const soldPlots = properties.filter(p => p.status === 'sold').length;
  const newLeads = leads.filter(l => l.status === 'new').length;

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-8">Dashboard</h1>

      {loading ? (
        <div className="text-center text-muted-foreground">Loading metrics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            icon={Home}
            label="Total Listings"
            value={totalListings}
            color="primary"
          />
          <MetricsCard
            icon={CheckCircle2}
            label="Available Plots"
            value={availablePlots}
            color="accent"
          />
          <MetricsCard
            icon={CheckCircle2}
            label="Sold Plots"
            value={soldPlots}
            color="secondary"
          />
          <MetricsCard
            icon={AlertCircle}
            label="New Leads"
            value={newLeads}
            color="accent"
          />
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-primary mb-4">Recent Properties</h2>
          {properties.length === 0 ? (
            <p className="text-muted-foreground">No properties listed yet</p>
          ) : (
            <ul className="space-y-3">
              {properties.slice(0, 5).map((prop) => (
                <li key={prop.id} className="flex justify-between items-start pb-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-primary">{prop.title}</p>
                    <p className="text-sm text-muted-foreground">{prop.location}</p>
                  </div>
                  <span className="text-sm font-semibold text-accent">
                    KES {parseFloat(prop.price).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-primary mb-4">Recent Leads</h2>
          {leads.length === 0 ? (
            <p className="text-muted-foreground">No leads yet</p>
          ) : (
            <ul className="space-y-3">
              {leads.slice(0, 5).map((lead) => (
                <li key={lead.id} className="pb-3 border-b border-border last:border-0">
                  <p className="font-medium text-primary">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">{lead.phone}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {lead.serviceType.replace('_', ' ')} • {lead.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
