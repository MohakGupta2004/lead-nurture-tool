"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { subscribeLeadAdded, subscribeLeadsBatchAdded } from "@/lib/events";

export function LeadsTable({ campaigns }: { campaigns: { id: string; name: string } }) {
    const [leads, setLeads] = useState<Array<{
        id: string;
        name: string;
        email: string;
        phNo: string;
        address: string;
        campaign?: string;
        campaignId?: { campaignName: string };
        date: string;
    }>>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { getToken } = useAuth();
    useEffect(() => {
        let unsubSingle: (() => void) | undefined;
        let unsubBatch: (() => void) | undefined;

        const fetchLeads = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(campaigns && campaigns.id !== "all" ? `/api/leads/getLeadbyCampaign?campaignId=${campaigns.id}` : '/api/leads/all', {
                    headers: {
                        'Authorization': `Bearer ${await getToken()}`
                    },
                })
                setLeads(response.data.leads);
            } catch (error) {
                console.error("Error fetching leads:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchLeads();

        // Subscribe to lead additions and trigger a re-fetch
        unsubSingle = subscribeLeadAdded(() => {
            fetchLeads();
        });

        unsubBatch = subscribeLeadsBatchAdded(() => {
            fetchLeads();
        });

        return () => {
            if (unsubSingle) unsubSingle();
            if (unsubBatch) unsubBatch();
        };
    }, [campaigns, getToken])
    if (isLoading) {
        return (
            <div className="flex h-75 items-center justify-center rounded-lg border border-dashed">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <LoadingSpinner className="h-8 w-8" />
                    <p className="text-sm">Loading leads...</p>
                </div>
            </div>
        );
    }

    if (!leads || leads.length === 0) {
        return (
            <div className="flex h-75 items-center justify-center rounded-lg border border-dashed">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <p>No leads yet</p>
                    <p className="text-sm">Start by adding your first lead or importing leads from a file</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Address</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leads.map((lead) => (
                        <TableRow key={lead.email}>
                            <TableCell className="font-medium">{lead.name}</TableCell>
                            <TableCell>{lead.email}</TableCell>
                            <TableCell>{lead.phNo}</TableCell>
                            <TableCell>{campaigns.id === "all" ? lead.campaignId?.campaignName : lead.campaign}</TableCell>
                            <TableCell>{lead.address}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
