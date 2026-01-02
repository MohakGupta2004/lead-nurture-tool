"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BarChart3, Users, Megaphone, Zap } from "lucide-react";

const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
    { title: "Leads", href: "/dashboard/leads", icon: Users },
    { title: "Automations", href: "/dashboard/automations", icon: Zap },
    { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

export function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight">LeadNurture</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-1 rounded-full border bg-muted/30 p-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-background text-foreground shadow-sm ring-1 ring-black/5"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-4">
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "h-9 w-9 ring-2 ring-white/20"
                            }
                        }}
                    />
                </div>
            </div>
        </header>
    );
}
