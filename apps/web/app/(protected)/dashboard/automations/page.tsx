"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";
import { AutomationCard } from "@/components/automations/AutomationCard";
import { Loader2 } from "lucide-react";

interface Campaign {
    id: string;
    name: string;
    totalLeads: number;
    createdAt: string;
    status: string;
    objective: string;
    targetPersona: string;
    description: string
}

export default function AutomationsPage() {
    const { getToken } = useAuth();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const token = await getToken();
                const response = await api.get('/api/campaigns/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCampaigns(response.data);
            } catch (error) {
                console.error("Failed to fetch campaigns", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, [getToken]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Automations</h2>
                <p className="text-muted-foreground">
                    Manage your campaign automations and generate AI content.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {campaigns.map((campaign) => (
                    <AutomationCard key={campaign.id} campaign={campaign} />
                ))}
            </div>

            {campaigns.length === 0 && (
                <div className="flex h-48 items-center justify-center rounded-md border border-dashed">
                    <p className="text-muted-foreground">No campaigns found</p>
                </div>
            )}
        </div>
    );
}
