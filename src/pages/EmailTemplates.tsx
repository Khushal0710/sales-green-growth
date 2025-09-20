import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Search, Plus, Copy, Edit, Trash2, Send, Star } from "lucide-react";

const EmailTemplates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const templates = [
    {
      id: 1,
      name: "Cold Outreach - Introduction",
      category: "cold-outreach",
      subject: "Quick question about [Company]'s [Pain Point]",
      preview: "Hi [Name], I noticed that [Company] is working on [specific initiative]. I wanted to reach out because...",
      openRate: "24%",
      responseRate: "8%",
      lastUsed: "2 days ago",
      isStarred: true
    },
    {
      id: 2,
      name: "Follow-up After Demo",
      category: "follow-up",
      subject: "Thanks for your time today - Next steps for [Company]",
      preview: "Hi [Name], Thank you for taking the time to see our demo today. As discussed, I wanted to follow up...",
      openRate: "67%",
      responseRate: "34%",
      lastUsed: "5 hours ago",
      isStarred: false
    },
    {
      id: 3,
      name: "Proposal Follow-up",
      category: "follow-up",
      subject: "Following up on our proposal for [Company]",
      preview: "Hi [Name], I wanted to follow up on the proposal we sent last week. Do you have any questions about...",
      openRate: "45%",
      responseRate: "19%",
      lastUsed: "1 week ago",
      isStarred: true
    },
    {
      id: 4,
      name: "Meeting Request",
      category: "meeting",
      subject: "15-minute call to discuss [specific benefit] for [Company]?",
      preview: "Hi [Name], I'd love to show you how [specific solution] could help [Company] achieve [specific goal]...",
      openRate: "38%",
      responseRate: "15%",
      lastUsed: "3 days ago",
      isStarred: false
    },
    {
      id: 5,
      name: "Re-engagement",
      category: "nurture",
      subject: "Checking in - Has anything changed at [Company]?",
      preview: "Hi [Name], I hope you're doing well. I wanted to reach out because it's been a few months since...",
      openRate: "31%",
      responseRate: "12%",
      lastUsed: "1 week ago",
      isStarred: false
    }
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "cold-outreach", label: "Cold Outreach" },
    { value: "follow-up", label: "Follow-up" },
    { value: "meeting", label: "Meeting Request" },
    { value: "nurture", label: "Nurture" }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "cold-outreach": return "bg-blue-500 text-white";
      case "follow-up": return "bg-success-gradient text-primary-foreground";
      case "meeting": return "bg-purple-500 text-white";
      case "nurture": return "bg-orange-500 text-white";
      default: return "bg-muted";
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Email Templates</h1>
            <p className="text-muted-foreground">Proven email templates to boost your outreach success</p>
          </div>
          <Button className="bg-sales-gradient text-primary-foreground hover:opacity-90 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Template</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground mb-1">{templates.length}</div>
              <div className="text-sm text-muted-foreground">Total Templates</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{templates.filter(t => t.isStarred).length}</div>
              <div className="text-sm text-muted-foreground">Starred</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                <Send className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">42%</div>
              <div className="text-sm text-muted-foreground">Avg Open Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">18%</div>
              <div className="text-sm text-muted-foreground">Avg Response Rate</div>
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
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-shadow-soft transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {template.isStarred && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <Badge className={getCategoryColor(template.category)}>
                      {categories.find(c => c.value === template.category)?.label}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-foreground mb-1">Subject Line:</div>
                    <div className="text-sm text-muted-foreground bg-accent/20 p-2 rounded">
                      {template.subject}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-foreground mb-1">Preview:</div>
                    <div className="text-sm text-muted-foreground">
                      {template.preview}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{template.openRate}</div>
                      <div className="text-xs text-muted-foreground">Open Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{template.responseRate}</div>
                      <div className="text-xs text-muted-foreground">Response Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-foreground">{template.lastUsed}</div>
                      <div className="text-xs text-muted-foreground">Last Used</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button className="flex-1 bg-sales-gradient text-primary-foreground hover:opacity-90">
                      <Send className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
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

export default EmailTemplates;