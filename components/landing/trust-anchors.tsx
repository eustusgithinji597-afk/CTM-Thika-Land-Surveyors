import { CheckCircle2, Users, Award, MapPin } from 'lucide-react';

export function TrustAnchors() {
  return (
    <section className="bg-primary/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex flex-col items-center text-center">
            <Award className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-semibold text-primary mb-1">Licensed Surveyors</h3>
            <p className="text-sm text-muted-foreground">Professionally qualified team</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Users className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-semibold text-primary mb-1">1000+ Clients</h3>
            <p className="text-sm text-muted-foreground">Trusted by property owners</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <MapPin className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-semibold text-primary mb-1">Local Expertise</h3>
            <p className="text-sm text-muted-foreground">Deep knowledge of Thika plots</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-semibold text-primary mb-1">Fast Service</h3>
            <p className="text-sm text-muted-foreground">Quick turnaround times</p>
          </div>
        </div>
      </div>
    </section>
  );
}
