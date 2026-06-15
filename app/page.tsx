import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { TrustAnchors } from "@/components/landing/trust-anchors";
import { PropertiesGrid } from "@/components/landing/properties-grid";
import { Services } from "@/components/landing/services";
import { LeadForm } from "@/components/landing/lead-form";
import { LandsNewsWidget } from "@/components/landing/lands-news-widget";
import { PropertyFAQ } from "@/components/landing/property-faq";
import { Footer } from "@/components/landing/footer";
import { Property } from "@/types";
import { supabasePublic } from "@/lib/supabase-client";

export const revalidate = 0; // Forces Next.js to always fetch fresh records on every page load

export default async function Home() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  // Fetch properties from your database sorted by newest
  const { data: initialProperties, error } = await supabasePublic
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Supabase fetch failed: ${error.message}`);
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <TrustAnchors />

      {/* 📍 Inject initial database records directly into the real-time grid */}
      <PropertiesGrid
        initialProperties={(initialProperties as Property[]) || []}
      />

      <Services />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto">
        <LandsNewsWidget />
        <PropertyFAQ />
      </div>

      <LeadForm />
      <Footer />
    </main>
  );
}
