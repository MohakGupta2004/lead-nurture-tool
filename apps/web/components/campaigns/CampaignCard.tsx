"use client";

import { useState } from "react";
import { EditCampaignModal } from "@/components/campaigns/EditCampaignModal";
import { Play, Pause, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

export function CampaignCard({ campaign }: { campaign: Campaign }) {
    const [status, setStatus] = useState(campaign.status);
    const { getToken } = useAuth()
    const router = useRouter()

    const toggleStatus = async () => {
        const token = await getToken()
        if (status === "active") {
            const response = await api.patch('/api/campaigns/update-status', {
                campaignId: campaign.id,
                status: "Paused"
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setStatus("Paused");
                toast.success("Campaign paused successfully");
            } else {
                toast.error("Failed to pause campaign");
            }
        } else {
            const response = await api.patch('/api/campaigns/update-status', {
                campaignId: campaign.id,
                status: "Active"
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setStatus("active");
                toast.success("Campaign resumed successfully");
            } else {
                toast.error("Failed to resume campaign");
            }
        }
    };

    const deleteCampaign = async () => {
        const token = await getToken()
        const response = await api.delete('/api/campaigns/delete', {
            data: {
                campaignId: campaign.id
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.data.success) {
            router.refresh()
            toast.success("Campaign deleted successfully");
        } else {
            toast.error("Failed to delete campaign");
        }
    }



    return (
        <Card className="group relative overflow-hidden border-none shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={deleteCampaign}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">{campaign.name}</CardTitle>
                <Badge variant={status === "active" ? "default" : "secondary"} className={status === "active" ? "bg-green-500 hover:bg-green-600" : ""}>
                    {status}
                </Badge>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    {campaign.description.split('').length > 50
                        ? campaign.description.split('').slice(0, 50).join('') + '...'
                        : campaign.description}
                </CardDescription>
                <div className="mt-4 rounded-md bg-muted p-4">
                    <div className="text-sm font-medium text-muted-foreground">Total Leads</div>
                    <div className="text-2xl font-bold">{campaign.totalLeads}</div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">Created {campaign.createdAt}</p>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2">
                <EditCampaignModal campaign={campaign} />
                <Button
                    variant={status === "active" ? "secondary" : "default"}
                    size="sm"
                    className="w-full"
                    onClick={toggleStatus}
                >
                    {status === "active" ? (
                        <>
                            <Pause className="mr-2 h-4 w-4" /> Pause
                        </>
                    ) : (
                        <>
                            <Play className="mr-2 h-4 w-4" /> Resume
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
