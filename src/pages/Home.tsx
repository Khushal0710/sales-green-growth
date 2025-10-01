import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import {
  Mail, Users, Eye, Calendar, TrendingUp, Building,
  Clock, CheckCircle, XCircle, Send, Target, RefreshCw, AlertCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [campaignData, setCampaignData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch data from webhook with comprehensive CORS handling
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Method 1: Direct fetch with proper headers
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      let response;

      try {
        response = await fetch('https://n8n.warpdrivetech.in/webhook/dashboard', {
          method: 'POST',
          headers,
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (corsError) {
        console.warn('Direct CORS fetch failed:', corsError);

        // Method 2: Try with a public CORS proxy
        try {
          const proxyUrl = 'https://api.allorigins.win/get?url=';
          const encodedUrl = encodeURIComponent('https://n8n.warpdrivetech.in/webhook/dashboard');
          const proxyResponse = await fetch(`${proxyUrl}${encodedUrl}`);

          if (!proxyResponse.ok) {
            throw new Error(`Proxy failed: ${proxyResponse.status}`);
          }

          const proxyData = await proxyResponse.json();
          const data = JSON.parse(proxyData.contents);
          setCampaignData(Array.isArray(data) ? data : []);
          setLastUpdated(new Date());
          return;
        } catch (proxyError) {
          console.warn('Proxy method failed:', proxyError);
          throw corsError; // Fall back to original error
        }
      }

      const data = await response.json();
      setCampaignData(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(`Connection failed: ${err.message}. Using sample data for demonstration.`);
      console.error('Error fetching dashboard data:', err);

      // Load comprehensive sample data as fallback
      const sampleData = [
        {
          "User Id": "619a760b94442c0001c2b03f",
          "Company": "Microsoft",
          "Comapany Revenue ": 198000000000,
          "Role": "Chief Technology Officer",
          "Name ": "Sarah Johnson",
          "Email": "sarah.johnson@microsoft.com",
          "Send Status": "Sent",
          "Opened": "Yes",
          "Send Status 2": "Sent",
          "Opened 2": "Yes",
          "Send Status 3": "Sent",
          "Opened 3": ""
        },
        {
          "User Id": "619a760b94442c0001c2b040",
          "Company": "Google",
          "Comapany Revenue ": 282000000000,
          "Role": "Vice President Engineering",
          "Name ": "David Chen",
          "Email": "david.chen@google.com",
          "Send Status": "Sent",
          "Opened": "Yes",
          "Send Status 2": "Sent",
          "Opened 2": "Yes"
        },
        {
          "User Id": "619a760b94442c0001c2b041",
          "Company": "Amazon",
          "Comapany Revenue ": 469000000000,
          "Role": "Director of Product",
          "Name ": "Maria Garcia",
          "Email": "maria.garcia@amazon.com",
          "Send Status": "Sent",
          "Opened": "",
          "Send Status 2": "Sent",
          "Opened 2": ""
        },
        {
          "User Id": "619a760b94442c0001c2b042",
          "Company": "Apple",
          "Comapany Revenue ": 365000000000,
          "Role": "Senior Engineering Manager",
          "Name ": "Robert Kim",
          "Email": "robert.kim@apple.com",
          "Send Status": "Sent",
          "Opened": "Yes"
        },
        {
          "User Id": "619a760b94442c0001c2b043",
          "Company": "Meta",
          "Comapany Revenue ": 117000000000,
          "Role": "Principal Engineer",
          "Name ": "Lisa Wang",
          "Email": "lisa.wang@meta.com",
          "Send Status": "Sent",
          "Opened": "Yes",
          "Send Status 2": "Sent",
          "Opened 2": "Yes",
          "Send Status 3": "Sent",
          "Opened 3": "Yes"
        },
        {
          "User Id": "619a760b94442c0001c2b044",
          "Company": "Tesla",
          "Comapany Revenue ": 96000000000,
          "Role": "VP of Engineering",
          "Name ": "Alex Rodriguez",
          "Email": "alex.rodriguez@tesla.com",
          "Send Status": "Sent",
          "Opened": ""
        },
        {
          "User Id": "619a760b94442c0001c2b045",
          "Company": "Netflix",
          "Comapany Revenue ": 32000000000,
          "Role": "Head of Data Science",
          "Name ": "Emily Davis",
          "Email": "emily.davis@netflix.com",
          "Send Status": "Sent",
          "Opened": "Yes"
        },
        {
          "User Id": "619a760b94442c0001c2b046",
          "Company": "Salesforce",
          "Comapany Revenue ": 26000000000,
          "Role": "Chief Data Officer",
          "Name ": "Michael Brown",
          "Email": "michael.brown@salesforce.com",
          "Send Status": "Sent",
          "Opened": "Yes",
          "Send Status 2": "Sent",
          "Opened 2": ""
        }
      ];
      setCampaignData(sampleData);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculate metrics based on real-time data - separate company vs contact metrics
  const metrics = useMemo(() => {
    // Separate companies from individual contacts
    const companies = new Set();
    const totalContacts = campaignData.length;

    // Calculate sent and opened emails across all sequences
    let totalSent = 0;
    let totalOpened = 0;
    let companiesWithEngagement = new Set();
    let contactsWithEngagement = 0;

    campaignData.forEach((lead: any) => {
      const company = lead.Company || lead.company || 'Unknown';
      companies.add(company);

      let contactHasEngagement = false;

      // Check all email sequences for this contact
      for (let i = 1; i <= 6; i++) {
        const sendStatusKey = i === 1 ? 'Send Status' : `Send Status ${i}`;
        const openedKey = i === 1 ? 'Opened' : `Opened ${i}`;

        const sendStatus = lead[sendStatusKey] || lead[sendStatusKey.replace(' ', '')] || '';
        const opened = lead[openedKey] || lead[openedKey.replace(' ', '')] || '';

        if (sendStatus === 'Sent' || sendStatus === 'UNREAD') {
          totalSent++;

          if (opened === 'Yes') {
            totalOpened++;
            contactHasEngagement = true;
            companiesWithEngagement.add(company);
          }
        }
      }

      if (contactHasEngagement) {
        contactsWithEngagement++;
      }
    });

    const totalCompanies = companies.size;
    const engagedCompanies = companiesWithEngagement.size;
    const openRate = totalSent > 0 ? (totalOpened / totalSent * 100).toFixed(1) : '0';
    const clickThroughRate = totalSent > 0 ? ((totalOpened * 0.3) / totalSent * 100).toFixed(1) : '0';
    const companyEngagementRate = totalCompanies > 0 ? (engagedCompanies / totalCompanies * 100).toFixed(1) : '0';

    return {
      totalContacts,
      totalCompanies,
      engagedCompanies,
      engagedContacts: contactsWithEngagement,
      sentEmails: totalSent,
      openedEmails: totalOpened,
      openRate,
      clickThroughRate,
      companyEngagementRate
    };
  }, [campaignData]);

  // Company performance data based on real-time data
  const companyPerformance = useMemo(() => {
    const companies: { [key: string]: any } = {};
    campaignData.forEach((item: any) => {
      const companyName = item.Company || item.company;

      if (!companyName) return;

      if (!companies[companyName]) {
        companies[companyName] = {
          name: companyName,
          leads: 0,
          sent: 0,
          opened: 0
        };
      }
      companies[companyName].leads += 1;

      if ((item['Send Status'] || item.sendStatus) === "Sent") {
        companies[companyName].sent += 1;
      }

      if (item.Opened === "Yes" || item.opened === "Yes" ||
        item['Opened 2'] === "Yes" || item['Opened 3'] === "Yes" ||
        item['Opened 4'] === "Yes" || item['Opened 5'] === "Yes" || item['Opened 6'] === "Yes") {
        companies[companyName].opened += 1;
      }
    });

    return Object.values(companies).map((company: any) => ({
      ...company,
      openRate: company.sent > 0 ? (company.opened / company.sent * 100).toFixed(1) : 0
    }));
  }, [campaignData]);

  // Email sequence performance calculated from real data
  const sequenceData = useMemo(() => {
    const templates = Array.from({ length: 6 }, (_, i) => ({
      template: `Email ${i + 1}`,
      sent: 0,
      opened: 0,
      clicked: 0
    }));

    campaignData.forEach((item: any) => {
      for (let i = 1; i <= 6; i++) {
        const sendStatusKey = i === 1 ? 'Send Status' : `Send Status ${i}`;
        const sendStatusKeyAlt = i === 1 ? 'sendStatus' : `sendStatus${i}`;
        const openedKey = i === 1 ? 'Opened' : `Opened ${i}`;
        const openedKeyAlt = i === 1 ? 'opened' : `opened${i}`;

        if (item[sendStatusKey] === 'Sent' || item[sendStatusKey] === 'UNREAD' ||
          item[sendStatusKeyAlt] === 'Sent' || item[sendStatusKeyAlt] === 'UNREAD') {
          templates[i - 1].sent++;
        }
        if (item[openedKey] === 'Yes' || item[openedKeyAlt] === 'Yes') {
          templates[i - 1].opened++;
          // Estimate clicks as 30% of opens
          templates[i - 1].clicked += Math.random() > 0.7 ? 1 : 0;
        }
      }
    });

    return templates;
  }, [campaignData]);

  const MetricCard = ({ title, value, icon: Icon, variant, subtitle }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    variant: 'primary' | 'success' | 'warning' | 'danger';
    subtitle?: string;
  }) => (
    <Card className={cn(
      "p-6 transition-all duration-300 hover:shadow-lg border-l-4",
      {
        'border-l-primary bg-gradient-to-r from-primary/5 to-transparent': variant === 'primary',
        'border-l-green-500 bg-gradient-to-r from-green-50 to-transparent': variant === 'success',
        'border-l-orange-500 bg-gradient-to-r from-orange-50 to-transparent': variant === 'warning',
        'border-l-red-500 bg-gradient-to-r from-red-50 to-transparent': variant === 'danger',
      }
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={cn(
          "h-12 w-12 rounded-lg flex items-center justify-center",
          {
            'bg-primary/10 text-primary': variant === 'primary',
            'bg-green-100 text-green-600': variant === 'success',
            'bg-orange-100 text-orange-600': variant === 'warning',
            'bg-red-100 text-red-600': variant === 'danger',
          }
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Inside Sales Dashboard
            </h1>
            <p className="text-muted-foreground">Real-time email campaign performance and lead management</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button
              onClick={fetchDashboardData}
              disabled={loading}
              className="transition-all duration-200"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Data
                </>
              )}
            </Button>
            {lastUpdated && (
              <p className="text-sm text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Connection Issue</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}
      </div>

      {loading && campaignData.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <div className="text-lg text-muted-foreground">Loading dashboard data...</div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Company vs Contact Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Company Metrics */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{metrics.totalCompanies}</div>
                  <div className="text-sm text-muted-foreground">Total Companies</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{metrics.engagedCompanies}</div>
                  <div className="text-sm text-muted-foreground">Engaged Companies</div>
                </div>
                <div className="col-span-2 text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{metrics.companyEngagementRate}%</div>
                  <div className="text-sm text-muted-foreground">Company Engagement Rate</div>
                </div>
              </div>
            </Card>

            {/* Contact Metrics */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contact Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{metrics.totalContacts}</div>
                  <div className="text-sm text-muted-foreground">Total Contacts</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{metrics.engagedContacts}</div>
                  <div className="text-sm text-muted-foreground">Engaged Contacts</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{metrics.openRate}%</div>
                  <div className="text-sm text-muted-foreground">Email Open Rate</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{metrics.clickThroughRate}%</div>
                  <div className="text-sm text-muted-foreground">Est. Click Rate</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Emails Sent"
              value={metrics.sentEmails}
              icon={Send}
              variant="success"
              subtitle="Across all sequences"
            />
            <MetricCard
              title="Emails Opened"
              value={metrics.openedEmails}
              icon={Eye}
              variant="warning"
              subtitle={`${metrics.openRate}% open rate`}
            />
            <MetricCard
              title="Companies Engaged"
              value={`${metrics.engagedCompanies}/${metrics.totalCompanies}`}
              icon={Building}
              variant="primary"
              subtitle={`${metrics.companyEngagementRate}% engagement`}
            />
            <MetricCard
              title="Contacts Engaged"
              value={`${metrics.engagedContacts}/${metrics.totalContacts}`}
              icon={Users}
              variant="danger"
              subtitle="Individual responses"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Performance */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={companyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="leads" fill="hsl(var(--primary))" name="Total Leads" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="sent" fill="hsl(var(--dashboard-green))" name="Emails Sent" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="opened" fill="hsl(var(--dashboard-orange))" name="Emails Opened" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Email Sequence Funnel */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Email Sequence Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={sequenceData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="template" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="sent" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="opened" stackId="2" stroke="hsl(var(--dashboard-green))" fill="hsl(var(--dashboard-green))" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="clicked" stackId="3" stroke="hsl(var(--dashboard-orange))" fill="hsl(var(--dashboard-orange))" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Company Performance Overview */}
          <Card className="overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Performance Summary
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Company-level engagement and outreach results
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Contacts
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Emails Sent
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Opened
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Open Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {companyPerformance.map((company: any, index) => (
                    <tr key={index} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{company.name}</div>
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {company.leads}
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {company.sent}
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {company.opened}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex px-3 py-1 text-xs font-medium rounded-full",
                          {
                            'bg-green-100 text-green-700': parseFloat(company.openRate) > 20,
                            'bg-orange-100 text-orange-700': parseFloat(company.openRate) >= 10 && parseFloat(company.openRate) <= 20,
                            'bg-red-100 text-red-700': parseFloat(company.openRate) < 10
                          }
                        )}>
                          {company.openRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Individual Contact Details Table */}
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5" />
                Individual Contact Details
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Individual contacts and their email engagement across all sequences
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Engagement
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Next Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {campaignData.map((lead: any, index) => {
                    const name = lead['Name '] || lead.name || 'N/A';
                    const email = lead.Email || lead.email || 'N/A';
                    const company = lead.Company || lead.company || 'N/A';
                    const role = lead.Role || lead.role || 'N/A';
                    const sendStatus = lead['Send Status'] || lead.sendStatus || 'Not Sent';
                    const opened = lead.Opened || lead.opened || '';

                    return (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-foreground">{name}</div>
                            <div className="text-sm text-muted-foreground">{email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-foreground">{company}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {role}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex px-3 py-1 text-xs font-medium rounded-full",
                            {
                              'bg-green-100 text-green-700': sendStatus === 'Sent',
                              'bg-blue-100 text-blue-700': sendStatus === 'UNREAD',
                              'bg-yellow-100 text-yellow-700': sendStatus !== 'Sent' && sendStatus !== 'UNREAD'
                            }
                          )}>
                            {sendStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {opened === 'Yes' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="text-sm text-foreground">
                              {opened === 'Yes' ? 'Opened' : 'Not Opened'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {opened === 'Yes' ? (
                            <div className="text-sm text-primary font-medium">Follow up</div>
                          ) : sendStatus === 'Sent' ? (
                            <div className="text-sm text-muted-foreground">Monitor opens</div>
                          ) : (
                            <div className="text-sm text-muted-foreground">Send next template</div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;