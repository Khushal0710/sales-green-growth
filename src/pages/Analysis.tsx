import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, TrendingDown, Users, DollarSign, Target, Calendar, Download } from "lucide-react";

const Analysis = () => {
  const kpis = [
    {
      title: "Total Revenue",
      value: "$847,293",
      change: "+12.3%",
      trend: "up",
      icon: DollarSign,
      period: "This Quarter"
    },
    {
      title: "Conversion Rate",
      value: "24.8%",
      change: "+3.2%",
      trend: "up",
      icon: Target,
      period: "Last 30 Days"
    },
    {
      title: "Active Leads",
      value: "1,247",
      change: "-2.1%",
      trend: "down",
      icon: Users,
      period: "This Week"
    },
    {
      title: "Avg Deal Size",
      value: "$12,450",
      change: "+8.7%",
      trend: "up",
      icon: BarChart3,
      period: "This Month"
    }
  ];

  const recentActivities = [
    { type: "Deal Closed", client: "Acme Corp", value: "$45,000", time: "2 hours ago" },
    { type: "New Lead", client: "TechStart Inc", value: "$12,000", time: "4 hours ago" },
    { type: "Meeting Scheduled", client: "Global Solutions", value: "$78,000", time: "6 hours ago" },
    { type: "Proposal Sent", client: "Innovation Labs", value: "$23,500", time: "1 day ago" },
    { type: "Follow-up Call", client: "Enterprise Co", value: "$156,000", time: "1 day ago" }
  ];

  const topPerformers = [
    { name: "Sarah Johnson", deals: 23, revenue: "$234,500", conversion: "89%" },
    { name: "Mike Chen", deals: 19, revenue: "$189,200", conversion: "76%" },
    { name: "Emily Davis", deals: 17, revenue: "$167,800", conversion: "71%" },
    { name: "David Wilson", deals: 15, revenue: "$145,300", conversion: "68%" }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Sales Analytics</h1>
            <p className="text-muted-foreground">Comprehensive insights into your sales performance</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Last 30 Days</span>
            </Button>
            <Button className="bg-sales-gradient text-primary-foreground hover:opacity-90 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown;
            return (
              <Card key={index} className="hover:shadow-shadow-soft transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant={kpi.trend === "up" ? "default" : "destructive"} className="flex items-center space-x-1">
                      <TrendIcon className="w-3 h-3" />
                      <span>{kpi.change}</span>
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{kpi.value}</div>
                  <div className="text-sm text-muted-foreground">{kpi.title}</div>
                  <div className="text-xs text-muted-foreground mt-2">{kpi.period}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Activities */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span>Recent Sales Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                    <div>
                      <div className="font-medium text-foreground">{activity.type}</div>
                      <div className="text-sm text-muted-foreground">{activity.client}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">{activity.value}</div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary" />
                <span>Top Performers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div key={index} className="flex items-center space-x-3 py-2">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-medium text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground text-sm">{performer.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {performer.deals} deals • {performer.conversion} rate
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary">{performer.revenue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-accent/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-primary mx-auto mb-3" />
                <p className="text-muted-foreground">Interactive charts and graphs will be displayed here</p>
                <p className="text-sm text-muted-foreground mt-1">Connect your data source to view detailed analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analysis;