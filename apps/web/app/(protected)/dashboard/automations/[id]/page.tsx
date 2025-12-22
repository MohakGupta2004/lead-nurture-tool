"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft, Loader2, Mail, Send, Lock, Gift } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

interface EmailData {
    mail: {
        mailNo: number;
        subject: string;
        body: string;
    };
}

interface APIMailStep {
    stepId: string;
    step: number;
    subject: string;
    body: string;
}

interface APIMail {
    _id: string;
    campaignId: string;
    templateStyle: string;
    steps: APIMailStep[];
}

export default function AutomationDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { getToken } = useAuth();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [emails, setEmails] = useState<EmailData[]>([]);
    const [hasEmails, setHasEmails] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [selectedFestival, setSelectedFestival] = useState<string>("none");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getToken();

                // First, check if emails exist in API (confirmed emails)
                const mailsResponse = await api.get(`/api/mail/getMailsByCampaignId/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (mailsResponse.data && mailsResponse.data.length > 0) {
                    // Emails confirmed - convert API format to display format
                    const apiMail: APIMail = mailsResponse.data[0];
                    const confirmedEmails: EmailData[] = apiMail.steps.map((step) => ({
                        mail: {
                            mailNo: step.step + 1,
                            subject: step.subject,
                            body: step.body,
                        }
                    }));
                    setEmails(confirmedEmails);
                    setHasEmails(true);
                    setIsConfirmed(true);
                } else {
                    // No confirmed emails, check localStorage for drafts
                    const storedEmails = localStorage.getItem(`campaign_${id}_emails`);
                    if (storedEmails) {
                        try {
                            const parsedEmails = JSON.parse(storedEmails);
                            setEmails(parsedEmails);
                            setHasEmails(true);
                            setIsConfirmed(false);
                        } catch (e) {
                            console.error("Failed to parse stored emails", e);
                        }
                    }
                }

                // Fetch campaign details
                const campaignResponse = await api.get('/api/campaigns/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCampaign(campaignResponse.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, getToken]);

    const handleGenerateEmails = async () => {
        if (!campaign) return;

        setIsGenerating(true);
        try {
            const token = await getToken();
            const response = await api.post('/api/mail/generate', null, { headers: { Authorization: `Bearer ${token}` } });

            if (response.data && response.data.mails) {
                const emailsData = JSON.stringify(response.data.mails);
                // Store in localStorage with campaign-specific key
                localStorage.setItem(`campaign_${id}_emails`, emailsData);
                setEmails(response.data.mails);
                setHasEmails(true);
                setIsConfirmed(false);
                toast.success("Emails generated successfully!");
            }
        } catch (error) {
            console.error("Failed to generate emails", error);
            toast.error("Failed to generate emails");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleEmailClick = (mailNo: number) => {
        router.push(`/dashboard/automations/${id}/emails/${mailNo}`);
    };

    const handleConfirmAndSend = async () => {
        setIsSending(true);
        try {
            const token = await getToken();

            // 1. Confirm Emails
            const confirmResponse = await api.post('/api/mail/confirm', {
                campaignId: id,
                mails: emails
            }, { headers: { Authorization: `Bearer ${token}` } });

            if (!confirmResponse.data.success) {
                toast.error("Failed to confirm emails");
                setIsSending(false);
                return;
            }

            // 2. Handle Festive Trigger if selected
            if (selectedFestival !== "none") {
                try {
                    await api.post('/api/mail/festiveTrigger', {
                        festival: selectedFestival,
                        enabled: true
                    }, { headers: { Authorization: `Bearer ${token}` } });
                    toast.success(`${selectedFestival.charAt(0).toUpperCase() + selectedFestival.slice(1)} trigger enabled!`);
                } catch (festiveError) {
                    console.error("Failed to enable festive trigger", festiveError);
                    toast.error("Emails confirmed, but failed to enable festive trigger");
                }
            }

            toast.success("Emails confirmed and scheduled for sending!");

            // Clear only this campaign's localStorage
            localStorage.removeItem(`campaign_${id}_emails`);

            // Re-fetch from API to get confirmed emails
            const mailsResponse = await api.get(`/api/mail/getMailsByCampaignId/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (mailsResponse.data && mailsResponse.data.length > 0) {
                const apiMail: APIMail = mailsResponse.data[0];
                const confirmedEmails: EmailData[] = apiMail.steps.map((step) => ({
                    mail: {
                        mailNo: step.step + 1,
                        subject: step.subject,
                        body: step.body,
                    }
                }));
                setEmails(confirmedEmails);
                setIsConfirmed(true);
            } else {
                setIsConfirmed(true);
            }
        } catch (error) {
            console.error("Failed to confirm emails", error);
            toast.error("Failed to confirm and send emails");
        } finally {
            setIsSending(false);
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
                        {isConfirmed
                            ? "Emails confirmed and scheduled"
                            : hasEmails
                                ? "Your generated emails (draft)"
                                : "Manage automation and generate emails"}
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    {hasEmails && !isConfirmed && (
                        <div className="flex items-center gap-2">
                            <Select value={selectedFestival} onValueChange={setSelectedFestival}>
                                <SelectTrigger className="w-[180px]">
                                    <Gift className="mr-2 h-4 w-4 text-primary" />
                                    <SelectValue placeholder="Festival Trigger" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No Festival Trigger</SelectItem>
                                    <SelectItem value="christmas">Christmas</SelectItem>
                                    <SelectItem value="newyear">New Year</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button onClick={handleConfirmAndSend} disabled={isSending}>
                                {isSending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Confirm & Send
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                    {isConfirmed && (
                        <div className="flex items-center gap-2">
                            {selectedFestival !== "none" && (
                                <Badge variant="outline" className="flex items-center gap-1 border-primary/50 text-primary">
                                    <Gift className="h-3 w-3" />
                                    {selectedFestival.charAt(0).toUpperCase() + selectedFestival.slice(1)} Enabled
                                </Badge>
                            )}
                            <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                                <Lock className="mr-1 h-3 w-3" />
                                Confirmed
                            </Badge>
                        </div>
                    )}
                    <Badge
                        variant={campaign.status === "active" ? "default" : "secondary"}
                        className={campaign.status === "active" ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                        {campaign.status}
                    </Badge>
                </div>
            </div>

            {/* Show emails if they exist */}
            {hasEmails ? (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {emails.map((item) => (
                            <Card
                                key={item.mail.mailNo}
                                className={`transition-all ${isConfirmed
                                    ? "cursor-default opacity-90"
                                    : "cursor-pointer hover:shadow-lg hover:border-primary"}`}
                                onClick={() => !isConfirmed && handleEmailClick(item.mail.mailNo)}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <Mail className="h-5 w-5 text-primary" />
                                        <div className="flex items-center gap-2">
                                            {isConfirmed && <Lock className="h-3 w-3 text-muted-foreground" />}
                                            <span className="text-xs text-muted-foreground">
                                                Mail #{item.mail.mailNo}
                                            </span>
                                        </div>
                                    </div>
                                    <CardTitle className="mt-4">{item.mail.subject}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {item.mail.body}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>

                    {/* Option to regenerate emails - only if NOT confirmed */}
                    {!isConfirmed && (
                        <div className="flex justify-center pt-4">
                            <Button
                                variant="outline"
                                onClick={handleGenerateEmails}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Regenerating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Regenerate Emails
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </>
            ) : (
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
            )}
        </div>
    );
}
