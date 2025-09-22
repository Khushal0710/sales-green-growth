import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, BookOpen, Cloud, FileText, Server, Settings, Shield, Users } from "lucide-react";

const SalesforceUpdates = () => {
  // Latest Salesforce updates and releases
  const latestUpdates = [
    {
      id: 1,
      title: "Winter '24 Release Notes",
      description: "Explore the latest features and updates in the Winter '24 release.",
      category: "Release",
      date: "October 2023",
      url: "https://help.salesforce.com/s/articleView?id=release-notes.rn_sf.htm&type=5&release=244"
    },
    {
      id: 2,
      title: "Einstein AI for Sales Cloud",
      description: "New AI-powered insights and recommendations for sales teams.",
      category: "AI",
      date: "September 2023",
      url: "https://www.salesforce.com/products/sales-cloud/features/einstein/"
    },
    {
      id: 3,
      title: "Field Service Lightning Updates",
      description: "Enhanced scheduling and mobile capabilities for field service teams.",
      category: "FSL",
      date: "August 2023",
      url: "https://www.salesforce.com/products/field-service-lightning/overview/"
    },
    {
      id: 4,
      title: "CPQ Spring '24 Preview",
      description: "Upcoming features for Configure, Price, Quote solutions.",
      category: "CPQ",
      date: "July 2023",
      url: "https://help.salesforce.com/s/articleView?id=release-notes.rn_cpq.htm&type=5&release=244"
    }
  ];

  // Salesforce Clouds and Products
  const salesforceProducts = [
    {
      name: "Sales Cloud",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      description: "Close more deals faster with the world's #1 CRM platform.",
      link: "https://www.salesforce.com/products/sales/overview/"
    },
    {
      name: "Service Cloud",
      icon: <Shield className="w-6 h-6 text-green-500" />,
      description: "Deliver smarter, faster, and more personalized customer service.",
      link: "https://www.salesforce.com/products/service-cloud/overview/"
    },
    {
      name: "Field Service Lightning",
      icon: <Settings className="w-6 h-6 text-purple-500" />,
      description: "Deliver exceptional on-site service with intelligent scheduling and mobile tools.",
      link: "https://www.salesforce.com/products/field-service-lightning/overview/"
    },
    {
      name: "CPQ",
      icon: <FileText className="w-6 h-6 text-orange-500" />,
      description: "Streamline your quote-to-cash process with Configure, Price, Quote solutions.",
      link: "https://www.salesforce.com/products/quote-cpq/overview/"
    },
    {
      name: "Platform",
      icon: <Server className="w-6 h-6 text-cyan-500" />,
      description: "Build, deploy, and manage custom apps with the world's #1 CRM platform.",
      link: "https://www.salesforce.com/products/platform/overview/"
    },
    {
      name: "Einstein AI",
      icon: <Cloud className="w-6 h-6 text-pink-500" />,
      description: "Artificial intelligence for everyone, built into the Salesforce Platform.",
      link: "https://www.salesforce.com/products/einstein/overview/"
    }
  ];

  // Helpful resources and documentation
  const resources = [
    {
      title: "Salesforce Help & Training",
      description: "Official documentation and training resources",
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
      url: "https://help.salesforce.com/"
    },
    {
      title: "Developer Documentation",
      description: "APIs, SDKs, and developer guides",
      icon: <FileText className="w-5 h-5 text-green-500" />,
      url: "https://developer.salesforce.com/docs/"
    },
    {
      title: "Trailhead",
      description: "Learn in-demand skills with fun, hands-on challenges",
      icon: <ArrowUpRight className="w-5 h-5 text-purple-500" />,
      url: "https://trailhead.salesforce.com/"
    },
    {
      title: "IdeaExchange",
      description: "Suggest and vote on new Salesforce features",
      icon: <ArrowUpRight className="w-5 h-5 text-orange-500" />,
      url: "https://ideas.salesforce.com/"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4" style={{ color: '#11ad3b' }}>
          Salesforce Resources & Updates
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Stay updated with the latest Salesforce news, updates, and product information
        </p>
      </div>

      {/* Latest Updates Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Latest Updates</h2>
          <Button variant="outline" size="sm" asChild>
            <a href="https://releasenotes.docs.salesforce.com/" target="_blank" rel="noopener noreferrer">
              View All Updates <ArrowUpRight className="ml-1 w-4 h-4" />
            </a>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {latestUpdates.map((update) => (
            <Card key={update.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2">{update.category}</Badge>
                  <span className="text-xs text-muted-foreground">{update.date}</span>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  <a href={update.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    {update.title} <ArrowUpRight className="ml-1 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{update.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Salesforce Products Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-foreground mb-6">Salesforce Products</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {salesforceProducts.map((product, index) => (
            <Card key={index} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-muted/50 rounded-lg">
                    {product.icon}
                  </div>
                  <h3 className="text-lg font-semibold">
                    <a href={product.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      {product.name} <ArrowUpRight className="ml-1 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Resources Section */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Helpful Resources</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {resource.icon}
                </div>
                <div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    {resource.title}
                    <ArrowUpRight className="inline ml-1 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SalesforceUpdates;
