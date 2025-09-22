import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Zap, BarChart3, Clock, Target } from "lucide-react";

const WhyChooseSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with SOC 2 compliance and data encryption"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamlessly collaborate with your sales team in real-time"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get insights and analysis in seconds, not hours"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights with predictive analytics and forecasting"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock support from our sales automation experts"
    },
    {
      icon: Target,
      title: "Proven Results",
      description: "Average 40% increase in sales productivity within 90 days"
    }
  ];

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ color: '#11ad3b' }}>
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for sales professionals who demand excellence and results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mx-auto">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;