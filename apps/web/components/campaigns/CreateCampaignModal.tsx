"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import { City } from 'country-state-city'
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function CreateCampaignModal() {
    const [open, setOpen] = useState(false);
    const { getToken } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data = Object.fromEntries(formData);

        try {
            const token = await getToken();
            const response = await api.post('/api/campaigns/create', {
                name: data.name,
                objective: data.objective,
                targetPersona: data.persona,
                description: data.description,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })

            console.log(response.data)
            toast.success("Campaign created successfully")
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to create campaign");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> New Campaign
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Campaign</DialogTitle>
                    <DialogDescription>
                        Set up a new campaign to nurture your leads.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Campaign Name</Label>
                            <Input id="name" name="name" placeholder="e.g., Summer Buyer Outreach" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="objective">Objective</Label>
                            <Select name="objective" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select objective" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="nurture">Nurture Leads</SelectItem>
                                    <SelectItem value="reengage">Re-engage Cold Leads</SelectItem>
                                    <SelectItem value="promote">Promote Listing</SelectItem>
                                    <SelectItem value="event">Event Invitation</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Select name="city" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select city" />
                                </SelectTrigger>
                                <SelectContent>
                                    {City.getCitiesOfCountry('CA')?.map((city) => (

                                        <SelectItem key={`${city.name}-${city.stateCode}`} value={city.name}>
                                            {city.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="persona">Target Persona</Label>
                            <Input id="persona" name="persona" placeholder="e.g., First-time Homebuyers" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea id="description" name="description" placeholder="Briefly describe the campaign..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create Campaign</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
