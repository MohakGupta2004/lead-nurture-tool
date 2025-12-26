"use client";

import { ImportLeadModal } from "@/components/leads/ImportLeadModal";
import { AddLeadModal } from "@/components/leads/AddLeadModal";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";

export default function LeadsPage() {
  const [campaigns, setCampaigns] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<{ id: string; name: string }>({
    id: "all",
    name: "all",
  });
  const { getToken } = useAuth();
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get('/api/campaigns/all', {
          headers: {
            'Authorization': `Bearer ${await getToken()}`
          },
        });
        setCampaigns(response.data);
        // Here you would set the fetched campaigns into state and map them to SelectItem components
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    }
    fetchCampaigns()
  }, [])
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            Manage and track all your leads in one place
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Done & Next
          </Button>
          <ImportLeadModal />
          <AddLeadModal />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by email or name..."
            className="pl-8"
          />
        </div>
        <Select
          onValueChange={(value) => {
            if (value === "all") {
              setSelectedCampaign({ id: "all", name: "all" });
              return;
            }
            const campaign = campaigns.find(c => c.id === value);
            setSelectedCampaign(campaign ? { id: campaign.id, name: campaign.name } : { id: "all", name: "all" });
          }}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="All Campaigns" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            {campaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={campaign.id}>
                {campaign.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>

      <LeadsTable campaigns={selectedCampaign} />
    </div>
  );
}
