import { CreateCampaignModal } from "@/components/campaigns/CreateCampaignModal";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { auth } from "@clerk/nextjs/server";
type Campaign = {
    id: string;
    name: string;
    totalLeads: number;
    createdAt: string;
    city: string;
    status: string;
    objective: string;
    targetPersona: string;
    description: string;
}

export default async function CampaignsPage() {
    const { getToken } = await auth();
    const token = await getToken();

    let campaigns: Campaign[] = [];

    try {
        const response = await api.get('/api/campaigns/all', {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        campaigns = response.data;
    } catch (error) {
        console.error("Failed to fetch campaigns", error);
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
                    <p className="text-muted-foreground">
                        Organize and manage your lead campaigns
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Done & Next
                    </Button>
                    <CreateCampaignModal />
                </div>
            </div>

            {campaigns.length === 0 ? (
                <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <h3 className="mt-4 text-lg font-semibold">No campaigns yet</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                            You haven't created any campaigns. Start by creating your first
                            campaign to nurture your leads.
                        </p>
                        <CreateCampaignModal />
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {campaigns.map((campaign) => (
                        <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                </div>
            )}
        </div>
    );
}
