"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Send } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface EmailData {
    mail: {
        mailNo: number;
        subject: string;
        body: string;
    };
}

export default function ComposeEmailPage() {
    const { id, mailNo } = useParams();
    const router = useRouter();
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Retrieve emails from sessionStorage
        const storedEmails = sessionStorage.getItem('generatedEmails');
        if (storedEmails) {
            const emails: EmailData[] = JSON.parse(storedEmails);
            const email = emails.find(e => e.mail.mailNo === Number(mailNo));

            if (email) {
                setSubject(email.mail.subject);
                setBody(email.mail.body);
            } else {
                toast.error("Email not found");
                router.push(`/dashboard/automations/${id}/emails`);
            }
        } else {
            router.push(`/dashboard/automations/${id}`);
        }
        setLoading(false);
    }, [id, mailNo, router]);

    const handleSave = () => {
        // Update the email in sessionStorage
        const storedEmails = sessionStorage.getItem('generatedEmails');
        if (storedEmails) {
            const emails: EmailData[] = JSON.parse(storedEmails);
            const updatedEmails = emails.map(e =>
                e.mail.mailNo === Number(mailNo)
                    ? { mail: { ...e.mail, subject, body } }
                    : e
            );
            sessionStorage.setItem('generatedEmails', JSON.stringify(updatedEmails));
            toast.success("Email saved successfully!");
        }
    };

    const handleSend = () => {
        handleSave();
        // TODO: Implement actual send functionality
        toast.success("Email sent successfully! (Coming soon)");
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
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
                        <h2 className="text-3xl font-bold tracking-tight">Compose Email</h2>
                        <p className="text-muted-foreground">
                            Edit and customize your email
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                    </Button>
                    <Button onClick={handleSend}>
                        <Send className="mr-2 h-4 w-4" />
                        Send
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Mail #{mailNo}</CardTitle>
                    <CardDescription>Edit the subject and body of your email</CardDescription>
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
                        />
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            {body.length} characters
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Draft
                            </Button>
                            <Button onClick={handleSend}>
                                <Send className="mr-2 h-4 w-4" />
                                Send Email
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
