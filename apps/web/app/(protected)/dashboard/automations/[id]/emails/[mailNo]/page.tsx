"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Eye, Save, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";

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

export default function ComposeEmailPage() {
    const { id, mailNo } = useParams();
    const router = useRouter();
    const { getToken } = useAuth();
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [templateStyle, setTemplateStyle] = useState("basic");
    const [loading, setLoading] = useState(true);
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        const loadEmailData = async () => {
            try {
                const token = await getToken();

                // 1. Check if emails are confirmed in API
                const mailsResponse = await api.get(`/api/mail/getMailsByCampaignId/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (mailsResponse.data && mailsResponse.data.length > 0) {
                    const apiMail: APIMail = mailsResponse.data[0];
                    const emailStep = apiMail.steps.find(s => s.step === Number(mailNo) - 1);

                    if (emailStep) {
                        setSubject(emailStep.subject);
                        setBody(emailStep.body);
                        setTemplateStyle(apiMail.templateStyle || "basic");
                        setIsConfirmed(true);
                        setLoading(false);
                        return;
                    }
                }

                // 2. Fallback to localStorage for drafts
                let storedEmails = localStorage.getItem(`campaign_${id}_emails`);
                if (!storedEmails) {
                    storedEmails = sessionStorage.getItem('generatedEmails');
                }

                if (storedEmails) {
                    const emails: EmailData[] = JSON.parse(storedEmails);
                    const email = emails.find(e => e.mail.mailNo === Number(mailNo));

                    if (email) {
                        setSubject(email.mail.subject);
                        setBody(email.mail.body);
                        setIsConfirmed(false);
                    } else {
                        toast.error("Email not found");
                        router.push(`/dashboard/automations/${id}/emails`);
                    }
                } else {
                    router.push(`/dashboard/automations/${id}`);
                }
            } catch (error) {
                console.error("Failed to load email", error);
                toast.error("Failed to load email data");
            } finally {
                setLoading(false);
            }
        };

        if (id && mailNo) {
            loadEmailData();
        }
    }, [id, mailNo, router, getToken]);

    const handleSave = () => {
        if (isConfirmed) return;

        let storedEmails = localStorage.getItem(`campaign_${id}_emails`);
        if (!storedEmails) {
            storedEmails = sessionStorage.getItem('generatedEmails');
        }

        if (!storedEmails) {
            toast.error("No emails found to save");
            return;
        }

        const emails: EmailData[] = JSON.parse(storedEmails);
        const emailIndex = emails.findIndex(e => e.mail.mailNo === Number(mailNo));

        if (emailIndex !== -1) {
            emails[emailIndex].mail.subject = subject;
            emails[emailIndex].mail.body = body;

            const updatedEmailsData = JSON.stringify(emails);
            localStorage.setItem(`campaign_${id}_emails`, updatedEmailsData);
            sessionStorage.setItem('generatedEmails', updatedEmailsData);
            toast.success("Email saved successfully!");
        } else {
            toast.error("Email not found");
        }
    }

    const handlePreview = async () => {
        try {
            const token = await getToken();
            const response = await api.get(`/api/mail/preview?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&templateStyle=${templateStyle}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const previewWindow = window.open('', '_blank', 'width=800,height=600');
            if (previewWindow) {
                previewWindow.document.write(response.data);
                previewWindow.document.close();
            } else {
                toast.error('Please allow pop-ups to view the preview');
            }
        } catch (error: any) {
            console.error('Error generating preview:', error);
            if (error.response?.status === 403) {
                toast.error(error.response?.data?.message || 'Template access denied');
            } else {
                toast.error('Failed to generate preview');
            }
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
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={`/dashboard/automations/${id}/emails`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            {isConfirmed ? "View Email" : "Compose Email"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isConfirmed
                                ? "This email is confirmed and cannot be modified"
                                : "Edit and customize your email"}
                        </p>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle>Mail #{mailNo}</CardTitle>
                        <CardDescription>
                            {isConfirmed ? "Confirmed content" : "Edit the subject and body of your email"}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePreview}>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                        </Button>

                        {!isConfirmed && (
                            <Button onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4" />
                                Save
                            </Button>
                        )}
                        {isConfirmed && (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                                <Lock className="mr-1 h-3 w-3" />
                                Confirmed
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                            Subject
                        </label>
                        <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter email subject"
                            className="text-lg"
                            disabled={isConfirmed}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="body" className="text-sm font-medium">
                            Body
                        </label>
                        <Textarea
                            id="body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Enter email body"
                            className="min-h-[400px] font-mono text-sm"
                            disabled={isConfirmed}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="template" className="text-sm font-medium">
                            Template Style
                        </label>
                        <Select
                            value={templateStyle}
                            onValueChange={setTemplateStyle}
                            disabled={isConfirmed}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="branded">Branded</SelectItem>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="modern">Modern</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            {isConfirmed
                                ? "Template style used for this email"
                                : "Select the template style for your email preview"}
                        </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            {body.length} characters
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
