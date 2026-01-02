"use client";

import Link from "next/link";
import { Layers, Users, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function GettingStarted() {
    // TODO: check if user has campaigns. For now, assume 0.
    const hasCampaigns = false;

    if (hasCampaigns) return null;

    return (
        <Card className="mb-10 overflow-hidden border-none bg-gradient-to-br from-primary/5 via-transparent to-transparent shadow-sm ring-1 ring-black/5">
            <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold tracking-tight">Getting Started</CardTitle>
                <CardDescription className="text-base">Your journey to automation begins here</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                    <Link href="/dashboard/campaigns" className="group block h-full">
                        <div className="flex h-full flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:-translate-y-1">
                            <div className="mb-6 rounded-2xl bg-red-500 p-4 text-white ring-1 ring-red-600/20 transition-colors group-hover:bg-red-600 shadow-lg shadow-red-500/20">
                                <Layers className="h-8 w-8" />
                            </div>
                            {/* TODO: Creating campaigns*/}
                            <h3 className="mb-2 text-lg font-bold tracking-tight">Create Campaign</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">Organize leads and start your outreach journey</p>
                        </div>
                    </Link>
                    <Link href="/dashboard/leads" className="group block h-full">
                        <div className="flex h-full flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:-translate-y-1">
                            <div className="mb-6 rounded-2xl bg-green-500 p-4 text-white ring-1 ring-green-600/20 transition-colors group-hover:bg-green-600 shadow-lg shadow-green-500/20">
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-lg font-bold tracking-tight">Import Leads</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">Add contacts to begin nurturing relationships</p>
                        </div>
                    </Link>
                    <Link href="/dashboard/automations" className="group block h-full">
                        <div className="flex h-full flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:-translate-y-1">
                            <div className="mb-6 rounded-2xl bg-yellow-500 p-4 text-white ring-1 ring-yellow-600/20 transition-colors group-hover:bg-yellow-600 shadow-lg shadow-yellow-500/20">
                                <Zap className="h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-lg font-bold tracking-tight">Setup Automations</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">Launch intelligent campaigns that work for you</p>
                        </div>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
