"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

export function AutomationCard({ campaign }: { campaign: Campaign }) {
    return (
        <Link href={`/dashboard/automations/${campaign.id}`}>
            <Card className="group relative overflow-hidden transition-all hover:border-primary/50 cursor-pointer hover:shadow-md h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-bold">{campaign.name}</CardTitle>
                    <Badge
                        variant={campaign.status === "active" ? "default" : "secondary"}
                        className={campaign.status === "active" ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                        {campaign.status}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <CardDescription>
                        {campaign.description.length > 50
                            ? campaign.description.slice(0, 50) + '...'
                            : campaign.description}
                    </CardDescription>
                    <div className="mt-4 rounded-md bg-muted p-4">
                        <div className="text-sm font-medium text-muted-foreground">Total Leads</div>
                        <div className="text-2xl font-bold">{campaign.totalLeads}</div>
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground">Created {new Date(campaign.createdAt).toLocaleDateString()}</p>
                </CardContent>
            </Card>
        </Link>
    );
}
