import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, RefreshCw, Shield, Zap, CheckCircle, Settings, Users, BarChart3 } from "lucide-react";

const Salesforce = () => {
  const integrationFeatures = [
    {
      icon: RefreshCw,
      title: "Real-time Sync",
      description: "Bi-directional data synchronization ensures your data is always up-to-date across all platforms."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with OAuth 2.0 authentication and encrypted data transmission."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized API calls and smart caching for instant data access and updates."
    },
    {
      icon: Settings,
      title: "Custom Fields",
      description: "Map and sync custom fields, objects, and workflows specific to your business needs."
    }
  ];

  const syncedData = [
    { type: "Contacts", count: "12,847", status: "Synced", icon: Users },
    { type: "Accounts", count: "3,492", status: "Synced", icon: Database },
    { type: "Opportunities", count: "856", status: "Syncing", icon: BarChart3 },
    { type: "Activities", count: "24,123", status: "Synced", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-sales-gradient rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Salesforce Integration</h1>
              <p className="text-muted-foreground">Seamlessly connect your Salesforce CRM with SalesAgent Pro</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-success-gradient text-primary-foreground">
            <CheckCircle className="w-4 h-4 mr-1" />
            Connected & Active
          </Badge>
        </div>

        {/* Connection Status */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {syncedData.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground mb-1">{item.count}</div>
                  <div className="text-sm text-muted-foreground mb-2">{item.type}</div>
                  <Badge 
                    variant={item.status === "Synced" ? "default" : "secondary"}
                    className={item.status === "Synced" ? "bg-primary" : ""}
                  >
                    {item.status}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Integration Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Integration Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrationFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-shadow-soft transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-primary" />
              <span>Integration Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <div>
                  <h4 className="font-medium text-foreground">Auto-sync Frequency</h4>
                  <p className="text-sm text-muted-foreground">How often data should sync between platforms</p>
                </div>
                <Badge variant="outline">Every 15 minutes</Badge>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-border">
                <div>
                  <h4 className="font-medium text-foreground">Conflict Resolution</h4>
                  <p className="text-sm text-muted-foreground">What happens when data conflicts occur</p>
                </div>
                <Badge variant="outline">Salesforce Wins</Badge>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-border">
                <div>
                  <h4 className="font-medium text-foreground">Data Retention</h4>
                  <p className="text-sm text-muted-foreground">How long to keep sync history</p>
                </div>
                <Badge variant="outline">30 days</Badge>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <div>
                  <h4 className="font-medium text-foreground">Webhook Notifications</h4>
                  <p className="text-sm text-muted-foreground">Real-time notifications for data changes</p>
                </div>
                <Badge variant="default" className="bg-primary">Enabled</Badge>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6 pt-6 border-t border-border">
              <Button className="bg-sales-gradient text-primary-foreground hover:opacity-90">
                Update Settings
              </Button>
              <Button variant="outline">
                Test Connection
              </Button>
              <Button variant="ghost" className="text-destructive hover:text-destructive">
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Salesforce;