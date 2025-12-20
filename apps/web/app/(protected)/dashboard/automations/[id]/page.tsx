"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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

export default function AutomationDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { getToken } = useAuth();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const token = await getToken();
                const response = await api.get('/api/campaigns/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setCampaign(response.data);
            } catch (error) {
                console.error("Failed to fetch campaign", error);
                toast.error("Failed to load campaign details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCampaign();
        }
    }, [id, getToken]);

    const handleGenerateEmails = async () => {
        if (!campaign) return;

        setIsGenerating(true);
        try {
            const token = await getToken();
            const response = await api.post('/api/mail/generate', null, { headers: { Authorization: `Bearer ${token}` } });

            // Store generated emails in sessionStorage
            if (response.data && response.data.mails) {
                sessionStorage.setItem('generatedEmails', JSON.stringify(response.data.mails));
                toast.success("Emails generated successfully!");
                // Redirect to emails list page
                router.push(`/dashboard/automations/${id}/emails`);
            }
        } catch (error) {
            console.error("Failed to generate emails", error);
            toast.error("Failed to generate emails");
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <p className="text-muted-foreground">Campaign not found</p>
                <Button asChild variant="outline">
                    <Link href="/dashboard/automations">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Automations
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-4">
                <Button asChild variant="ghost" size="icon">
                    <Link href="/dashboard/automations">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{campaign.name}</h2>
                    <p className="text-muted-foreground">
                        Manage automation and generate emails
                    </p>
                </div>
                <div className="ml-auto">
                    <Badge
                        variant={campaign.status === "active" ? "default" : "secondary"}
                        className={campaign.status === "active" ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                        {campaign.status}
                    </Badge>
                </div>
            </div>

            <div className="flex justify-center items-center min-h-96">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Generate Emails</CardTitle>
                        <CardDescription>
                            Generate personalized emails for {campaign.name} based on your campaign settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-md bg-muted p-4">
                            <div className="flex items-start space-x-4">
                                <Sparkles className="mt-1 h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-medium">Ready to generate</p>
                                    <p className="text-sm text-muted-foreground">
                                        AI will analyze your objective and target persona to create a sequence of emails.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleGenerateEmails}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Generate Emails
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
