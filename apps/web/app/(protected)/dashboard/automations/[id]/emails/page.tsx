"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

interface EmailData {
    mail: {
        mailNo: number;
        subject: string;
        body: string;
    };
}

export default function EmailsListPage() {
    const { id } = useParams();
    const router = useRouter();
    const [emails, setEmails] = useState<EmailData[]>([]);

    useEffect(() => {
        // Retrieve emails from sessionStorage
        const storedEmails = sessionStorage.getItem('generatedEmails');
        if (storedEmails) {
            setEmails(JSON.parse(storedEmails));
        } else {
            // If no emails found, redirect back
            router.push(`/dashboard/automations/${id}`);
        }
    }, [id, router]);

    const handleEmailClick = (mailNo: number) => {
        router.push(`/dashboard/automations/${id}/emails/${mailNo}`);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-4">
                <Button asChild variant="ghost" size="icon">
                    <Link href={`/dashboard/automations/${id}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Generated Emails</h2>
                    <p className="text-muted-foreground">
                        Click on any email to view and edit
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {emails.map((item) => (
                    <Card
                        key={item.mail.mailNo}
                        className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
                        onClick={() => handleEmailClick(item.mail.mailNo)}
                    >
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <Mail className="h-5 w-5 text-primary" />
                                <span className="text-xs text-muted-foreground">
                                    Mail #{item.mail.mailNo}
                                </span>
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
    );
}
