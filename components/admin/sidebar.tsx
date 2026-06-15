"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Home, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminSidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Properties", href: "/admin/properties", icon: Home },
    { label: "Leads", href: "/admin/leads", icon: Users },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-screen flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CTM%20Logo-oPjzX4abj1S3rVa9Kv4TUOXlK05pJE.png"
            alt="CTM Logo"
            className="h-12 w-auto"
          />
          <div>
            <h2 className="font-bold text-sidebar-foreground text-sm">
              CTM Thika
            </h2>
            <p className="text-xs text-sidebar-foreground/70">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/20 transition"
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 text-sidebar-foreground"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
