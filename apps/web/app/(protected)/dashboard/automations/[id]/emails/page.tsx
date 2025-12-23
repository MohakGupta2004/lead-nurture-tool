"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Send, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";

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

export default function EmailsListPage() {
    const { id } = useParams();
    const router = useRouter();
    const { getToken } = useAuth();
    const [emails, setEmails] = useState<EmailData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [templateStyle, setTemplateStyle] = useState<string | null>(null);

    useEffect(() => {
        const checkStatusAndLoadEmails = async () => {
            try {
                const token = await getToken();

                // 1. Check if emails are already confirmed in API
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
                    setTemplateStyle(apiMail.templateStyle || null);
                    setLoading(false);
                    return;
                }

                // 2. Fallback to localStorage for drafts
                let storedEmails = localStorage.getItem(`campaign_${id}_emails`);
                if (!storedEmails) {
                    storedEmails = sessionStorage.getItem('generatedEmails');
                }

                if (storedEmails) {
                    setEmails(JSON.parse(storedEmails));
                    setIsConfirmed(false);
                    // Try to read the persisted template style
                    const storedTemplate = localStorage.getItem(`campaign_${id}_template`) || sessionStorage.getItem(`campaign_${id}_template`);
                    if (storedTemplate) setTemplateStyle(storedTemplate);
                } else {
                    router.push(`/dashboard/automations/${id}`);
                }
            } catch (error) {
                console.error("Failed to load emails", error);
                toast.error("Failed to load emails");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            checkStatusAndLoadEmails();
        }
    }, [id, router, getToken]);

    const handleEmailClick = (mailNo: number) => {
        router.push(`/dashboard/automations/${id}/emails/${mailNo}`);
    };

    const handleSend = async () => {
        setIsSending(true);
        try {
            const token = await getToken();
            if (!token) {
                toast.error("Failed to get token");
                return;
            }

            const confirmResponse = await api.post(`/api/mail/confirm`, {
                campaignId: id,
                mails: emails,
                templateStyle: templateStyle || 'basic'
            }, { headers: { Authorization: `Bearer ${token}` } });

            if (confirmResponse.data.success) {
                toast.success("Emails confirmed successfully!");
                localStorage.removeItem(`campaign_${id}_emails`);
                setIsConfirmed(true);
                // Redirect back to main page which will now show read-only state
                router.push(`/dashboard/automations/${id}`);
            } else {
                toast.error("Failed to confirm emails");
            }
        } catch (error) {
            console.error("Error confirming emails:", error);
            toast.error("Failed to confirm emails");
        } finally {
            setIsSending(false);
        }
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-4 justify-between">
                <div className="flex">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={`/dashboard/automations/${id}`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            {isConfirmed ? "Confirmed Emails" : "Generated Emails"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isConfirmed
                                ? "These emails are scheduled and cannot be edited"
                                : "Click on any email to view and edit"}
                        </p>
                    </div>
                </div>
                {!isConfirmed && (
                    <div className="flex gap-2">
                        <Button onClick={handleSend} disabled={isSending}>
                            {isSending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Confirming...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Confirm
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {emails.map((item) => (
                    <Card
                        key={item.mail.mailNo}
                        className={`transition-all ${isConfirmed
                            ? "opacity-90 cursor-default"
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

            {emails.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No emails generated yet</p>
                    <Button asChild variant="outline" className="mt-4">
                        <Link href={`/dashboard/automations/${id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
