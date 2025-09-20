import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart3, Users, Mail, Database, TrendingUp, Target, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const features = [
    {
      icon: Database,
      title: "Salesforce Integration",
      description: "Seamlessly connect and sync with your Salesforce CRM for unified data management.",
      link: "/salesforce"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get deep insights into your sales performance with comprehensive analytics and reporting.",
      link: "/analysis"
    },
    {
      icon: Users,
      title: "Lead Management",
      description: "Track, qualify, and convert leads efficiently with our powerful lead management system.",
      link: "/leads"
    },
    {
      icon: Mail,
      title: "Email Templates",
      description: "Use proven email templates to improve your outreach and conversion rates.",
      link: "/email-templates"
    }
  ];

  const stats = [
    { icon: TrendingUp, value: "150%", label: "Average ROI Increase" },
    { icon: Target, value: "89%", label: "Lead Conversion Rate" },
    { icon: Clock, value: "3x", label: "Faster Sales Cycle" },
    { icon: Users, value: "500+", label: "Happy Customers" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-sales-gradient-soft">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Supercharge Your
            <span className="text-primary block">Inside Sales</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Professional sales automation platform that helps inside sales agents close more deals, 
            manage leads effectively, and scale their revenue operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-sales-gradient text-primary-foreground hover:opacity-90 shadow-shadow-success">
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Link to="/analysis">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                View Analytics Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need to
              <span className="text-primary"> Close More Deals</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed specifically for inside sales professionals to maximize productivity and revenue.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-shadow-soft transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4 group-hover:bg-sales-gradient transition-colors">
                      <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <Link to={feature.link}>
                      <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80">
                        Learn more <ArrowRight className="ml-1 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-sales-gradient">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Sales Process?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of sales professionals who trust SalesAgent Pro to drive their success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;