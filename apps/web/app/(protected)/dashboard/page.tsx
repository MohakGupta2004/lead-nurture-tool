import { GettingStarted } from "@/components/dashboard/GettingStarted";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                {/* TODO: Take this from Clerk */}
                <p className="text-muted-foreground">Welcome back, Mohak Gupta!</p>
            </div>

            <GettingStarted />

            <StatsCards />

            <Card className="overflow-hidden border-none shadow-sm ring-1 ring-black/5">
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Campaign Performance</CardTitle>
                    <p className="text-sm text-muted-foreground">Last 30 days</p>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center border-t bg-muted/10">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <BarChart3 className="h-8 w-8" />
                        <p>Chart data coming soon</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
