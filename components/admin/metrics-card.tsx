import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color?: 'primary' | 'accent' | 'secondary';
}

export function MetricsCard({ icon: Icon, label, value, color = 'primary' }: MetricsCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    secondary: 'bg-secondary/10 text-secondary',
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold text-primary">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
