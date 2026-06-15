'use client';

import { useState, useEffect } from 'react';
import { Lead } from '@/lib/db-schema';
import { Download, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Papa from 'papaparse';

export function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        setLeads(await res.json());
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleContactedStatus = async (lead: Lead) => {
    setUpdatingId(lead.id);
    try {
      const newStatus = lead.status === 'new' ? 'contacted' : 'new';
      const response = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, status: newStatus }),
      });

      if (response.ok) {
        setLeads(
          leads.map((l) =>
            l.id === lead.id ? { ...l, status: newStatus } : l
          )
        );
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const exportToCSV = () => {
    const csvData = leads.map((lead) => ({
      Name: lead.name,
      Phone: lead.phone,
      'Service Type': lead.serviceType.replace('_', ' '),
      Status: lead.status,
      'Date': new Date(lead.createdAt).toLocaleDateString(),
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-primary">Leads</h1>
        <Button
          onClick={exportToCSV}
          className="bg-accent hover:bg-accent/90 flex items-center gap-2"
          disabled={leads.length === 0}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-12">
          Loading leads...
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center bg-white rounded-lg border border-border p-12">
          <p className="text-muted-foreground">No leads yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-primary">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/50 transition">
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-primary">{lead.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-sm text-accent hover:underline"
                      >
                        {lead.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="capitalize">
                        {lead.serviceType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          lead.status === 'new' ? 'default' : 'secondary'
                        }
                      >
                        {lead.status === 'new' ? 'New' : 'Contacted'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        onClick={() => toggleContactedStatus(lead)}
                        disabled={updatingId === lead.id}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 mx-auto"
                      >
                        {lead.status === 'new' ? (
                          <>
                            <Circle className="w-4 h-4" />
                            Mark Contacted
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Contacted
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-muted px-6 py-3 text-sm text-muted-foreground">
            Total: {leads.length} leads | New: {leads.filter(l => l.status === 'new').length} | Contacted: {leads.filter(l => l.status === 'contacted').length}
          </div>
        </div>
      )}
    </div>
  );
}
