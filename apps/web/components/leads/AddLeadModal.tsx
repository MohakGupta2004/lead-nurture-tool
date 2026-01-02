"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { publishLeadAdded } from "@/lib/events";

export function AddLeadModal() {
    const [campaigns, setCampaigns] = useState<Array<{ id: string, name: string }>>([]);
    const [selectedCampaign, setSelectedCampaign] = useState<{ id: string, name: string } | undefined>(undefined);
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false);
    const { getToken } = useAuth()
    useEffect(() => {
        // This useEffect is for fetching the campaigns from the backend when the modal opens 
        // And put those campaigns into the SelectItem component
        const fetchCampaigns = async () => {
            if (!isOpen) return;
            try {
                const response = await api.get('/api/campaigns/all', {
                    headers: {
                        'Authorization': `Bearer ${await getToken()}`
                    },
                });
                setCampaigns(response.data);
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            }
        }
        fetchCampaigns();
    }, [isOpen, getToken]);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle manual lead addition logic here
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);
        if (selectedCampaign === undefined) {
            toast.error("Please select a campaign");
            return;
        }
        const response = await api.post('/api/leads/create', {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            campaignId: selectedCampaign.id,
        }, {
            headers: {
                'Authorization': `Bearer ${await getToken()}`
            }
        });
        toast.success("Lead added successfully");

        // Publish the newly created lead to other parts of the app (and other tabs)
        try {
            publishLeadAdded(response.data.lead ?? response.data);
        } catch (e) {
            // ignore publish errors
        }

        setIsOpen(false);
        router.refresh();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Lead
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Add Lead</DialogTitle>
                    <DialogDescription>
                        Manually add a new lead to a campaign.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="campaign">Select Campaign</Label>
                            <>
                                <Select
                                    required
                                    name="campaign"
                                    value={selectedCampaign?.id}
                                    onValueChange={(val: string) => {
                                        const campaign = campaigns.find(c => c.id === val);
                                        setSelectedCampaign(campaign);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select campaign" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {campaigns.map((campaign) => (
                                            <SelectItem key={campaign.id} value={campaign.id}>
                                                {campaign.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {/* Hidden input ensures FormData picks up the selected campaign value */}
                                <input type="hidden" name="campaign" value={selectedCampaign?.id ?? ""} />
                            </>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder="John Doe" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" name="address" placeholder="123 Main St, City, Country" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add Lead</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
