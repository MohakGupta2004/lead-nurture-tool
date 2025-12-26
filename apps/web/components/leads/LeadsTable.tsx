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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<any>(null);
    const [editFormData, setEditFormData] = useState({
        name: "",
        email: "",
        phNo: "",
        address: ""
    });
    const { getToken } = useAuth();

    const fetchLeads = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(campaigns && campaigns.id !== "all" ? `/api/leads/getLeadbyCampaign?campaignId=${campaigns.id}` : '/api/leads/all', {
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                },
            })
            // Normalize lead data if coming from different endpoints
            const normalizedLeads = response.data.leads.map((lead: any) => ({
                ...lead,
                id: lead.id || lead._id // Ensure we have a consistent id field
            }));
            setLeads(normalizedLeads);
        } catch (error) {
            console.error("Error fetching leads:", error);
            toast.error("Failed to fetch leads");
        } finally {
            setIsLoading(false);
        }
    }

    const handleDelete = async (leadId: string) => {
        if (!confirm("Are you sure you want to delete this lead?")) return;

        try {
            await api.post('/api/leads/delete', { leadId }, {
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                }
            });
            toast.success("Lead deleted successfully");
            fetchLeads();
        } catch (error) {
            console.error("Error deleting lead:", error);
            toast.error("Failed to delete lead");
        }
    };

    const handleEditClick = (lead: any) => {
        setSelectedLead(lead);
        setEditFormData({
            name: lead.name,
            email: lead.email,
            phNo: lead.phNo,
            address: lead.address
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        try {
            await api.post('/api/leads/update', {
                leadId: selectedLead.id,
                name: editFormData.name,
                email: editFormData.email,
                phone: editFormData.phNo,
                address: editFormData.address
            }, {
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                }
            });
            toast.success("Lead updated successfully");
            setIsEditDialogOpen(false);
            fetchLeads();
        } catch (error) {
            console.error("Error updating lead:", error);
            toast.error("Failed to update lead");
        }
    };

    useEffect(() => {
        let unsubSingle: (() => void) | undefined;
        let unsubBatch: (() => void) | undefined;

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
    }, [campaigns, getToken]);

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
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leads.map((lead) => (
                        <TableRow key={lead.id || lead.email}>
                            <TableCell className="font-medium">{lead.name}</TableCell>
                            <TableCell>{lead.email}</TableCell>
                            <TableCell>{lead.phNo}</TableCell>
                            <TableCell>{campaigns.id === "all" ? lead.campaignId?.campaignName : lead.campaign}</TableCell>
                            <TableCell>{lead.address}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleEditClick(lead)}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit Lead
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={() => handleDelete(lead.id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Lead
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Lead</DialogTitle>
                        <DialogDescription>
                            Make changes to the lead's information here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={editFormData.email}
                                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                Phone
                            </Label>
                            <Input
                                id="phone"
                                value={editFormData.phNo}
                                onChange={(e) => setEditFormData({ ...editFormData, phNo: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                                Address
                            </Label>
                            <Input
                                id="address"
                                value={editFormData.address}
                                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleUpdate}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
