"use client";

import { Users, Zap, Mail, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
    {
        title: "Total Leads",
        value: "0",
        icon: Users,
    },
    {
        title: "Active Campaigns",
        value: "0",
        icon: Zap,
    },
    {
        title: "Response Rate",
        value: "0%",
        icon: Mail,
    },
    {
        title: "Conversion Rate",
        value: "0%",
        icon: BarChart,
    },
];

export function StatsCards() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index} className="overflow-hidden border-none shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <div className="rounded-full bg-primary/5 p-2 text-primary">
                            <stat.icon className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
