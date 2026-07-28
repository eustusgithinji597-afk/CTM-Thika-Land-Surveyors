'use client';

import { useState, useEffect, useRef } from 'react';
import type { Lead } from '@/lib/db-schema';
import { Download, CheckCircle2, Circle, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Papa from 'papaparse';

type ExportRange = 'all' | 'today' | 'week' | 'month';

function filterLeadsByRange(leads: Lead[], range: ExportRange): Lead[] {
  if (range === 'all') return leads;
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let cutoff: Date;
  if (range === 'today') {
    cutoff = startOfDay;
  } else if (range === 'week') {
    cutoff = new Date(startOfDay.getTime() - 6 * 24 * 60 * 60 * 1000);
  } else {
    cutoff = new Date(startOfDay.getTime() - 29 * 24 * 60 * 60 * 1000);
  }
  return leads.filter((l) => new Date((l as any).created_at) >= cutoff);
}

export function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exportRange, setExportRange] = useState<ExportRange>('all');
  const selectRef = useRef<HTMLSelectElement>(null);

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

  const handleDelete = async (lead: Lead) => {
    if (!window.confirm(`Delete lead from ${lead.name}? This cannot be undone.`)) return;
    setDeletingId(lead.id);
    try {
      const res = await fetch(`/api/leads?id=${lead.id}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads(leads.filter((l) => l.id !== lead.id));
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const exportToCSV = () => {
    const filtered = filterLeadsByRange(leads, exportRange);
    const csvData = filtered.map((lead) => ({
      Name: lead.name,
      Phone: `="\t${lead.phone}"`,
      'Service Type': (lead as any).service_type?.replace('_', ' '),
      'Property': (lead as any).property_title || '',
      Status: lead.status,
      'Date': new Date((lead as any).created_at).toLocaleDateString(),
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

  const filteredCount = filterLeadsByRange(leads, exportRange).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-primary">Leads</h1>
        <div className="flex items-center gap-3">
          <select
            ref={selectRef}
            value={exportRange}
            onChange={(e) => setExportRange(e.target.value as ExportRange)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
          >
            <option value="all">All Leads</option>
            <option value="today">Today</option>
            <option value="week">Past 7 Days</option>
            <option value="month">Past 30 Days</option>
          </select>
          <Button
            onClick={exportToCSV}
            className="bg-accent hover:bg-accent/90 flex items-center gap-2"
            disabled={filteredCount === 0}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
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
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-primary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/50 transition">
                    <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                      {new Date((lead as any).created_at).toLocaleDateString()}
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
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-[200px] truncate">
                      {(lead as any).property_title || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="capitalize">
                        {(lead as any).service_type?.replace('_', ' ')}
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
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          onClick={() => toggleContactedStatus(lead)}
                          disabled={updatingId === lead.id}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          {updatingId === lead.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : lead.status === 'new' ? (
                            <Circle className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          )}
                          {lead.status === 'new' ? 'Mark' : 'Done'}
                        </Button>
                        <Button
                          onClick={() => handleDelete(lead)}
                          disabled={deletingId === lead.id}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          {deletingId === lead.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-muted px-6 py-3 text-sm text-muted-foreground">
            {exportRange === 'all'
              ? `Total: ${leads.length} leads`
              : `Showing: ${filteredCount} of ${leads.length} leads`}
            {' | '}
            New: {leads.filter(l => l.status === 'new').length}
            {' | '}
            Contacted: {leads.filter(l => l.status === 'contacted').length}
          </div>
        </div>
      )}
    </div>
  );
}
