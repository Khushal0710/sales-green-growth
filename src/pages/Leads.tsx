import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Filter, Plus, Mail, Phone, Calendar } from "lucide-react";

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const leads = [
    {
      id: 1,
      name: "Jennifer Martinez",
      company: "TechFlow Solutions",
      email: "j.martinez@techflow.com",
      phone: "+1 (555) 123-4567",
      status: "hot",
      value: "$45,000",
      source: "Website",
      lastContact: "2 hours ago",
      nextAction: "Follow-up call scheduled"
    },
    {
      id: 2,
      name: "Robert Chen",
      company: "Digital Innovations Inc",
      email: "r.chen@diginnovations.com",
      phone: "+1 (555) 234-5678",
      status: "warm",
      value: "$23,500",
      source: "LinkedIn",
      lastContact: "1 day ago",
      nextAction: "Send proposal"
    },
    {
      id: 3,
      name: "Sarah Thompson",
      company: "Global Enterprises",
      email: "s.thompson@globalent.com",
      phone: "+1 (555) 345-6789",
      status: "cold",
      value: "$78,000",
      source: "Cold Outreach",
      lastContact: "1 week ago",
      nextAction: "Schedule demo"
    },
    {
      id: 4,
      name: "Michael Davis",
      company: "StartupX",
      email: "m.davis@startupx.com",
      phone: "+1 (555) 456-7890",
      status: "hot",
      value: "$12,300",
      source: "Referral",
      lastContact: "3 hours ago",
      nextAction: "Contract review"
    },
    {
      id: 5,
      name: "Lisa Rodriguez",
      company: "Enterprise Solutions",
      email: "l.rodriguez@entsolutions.com",
      phone: "+1 (555) 567-8901",
      status: "warm",
      value: "$56,700",
      source: "Trade Show",
      lastContact: "2 days ago",
      nextAction: "Technical discussion"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hot": return "bg-success-gradient text-primary-foreground";
      case "warm": return "bg-yellow-500 text-white";
      case "cold": return "bg-blue-500 text-white";
      default: return "bg-muted";
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const leadStats = {
    total: leads.length,
    hot: leads.filter(l => l.status === "hot").length,
    warm: leads.filter(l => l.status === "warm").length,
    cold: leads.filter(l => l.status === "cold").length
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Lead Management</h1>
            <p className="text-muted-foreground">Track and manage your sales prospects</p>
          </div>
          <Button className="bg-sales-gradient text-primary-foreground hover:opacity-90 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add New Lead</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground mb-1">{leadStats.total}</div>
              <div className="text-sm text-muted-foreground">Total Leads</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-3"></div>
              <div className="text-2xl font-bold text-foreground mb-1">{leadStats.hot}</div>
              <div className="text-sm text-muted-foreground">Hot Leads</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-3"></div>
              <div className="text-2xl font-bold text-foreground mb-1">{leadStats.warm}</div>
              <div className="text-sm text-muted-foreground">Warm Leads</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-3"></div>
              <div className="text-2xl font-bold text-foreground mb-1">{leadStats.cold}</div>
              <div className="text-sm text-muted-foreground">Cold Leads</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search leads by name or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leads List */}
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="hover:shadow-shadow-soft transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{lead.name}</h3>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{lead.company}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{lead.email}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{lead.phone}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="text-center sm:text-right">
                      <div className="text-lg font-bold text-primary">{lead.value}</div>
                      <div className="text-sm text-muted-foreground">Potential Value</div>
                    </div>
                    
                    <div className="text-center sm:text-right">
                      <div className="text-sm font-medium text-foreground">{lead.source}</div>
                      <div className="text-xs text-muted-foreground">Source</div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    Last contact: {lead.lastContact}
                  </div>
                  <div className="text-sm font-medium text-primary">
                    Next: {lead.nextAction}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leads;