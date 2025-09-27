import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, Mail, Home } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/analysis", label: "Analysis", icon: BarChart3 },
    { path: "/leads", label: "Leads", icon: Users },
    { path: "/email-templates", label: "Email Templates", icon: Mail },
  ];

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-14 w-auto"
            />
            <span className="text-xl font-bold text-primary">Inside Sales Agent</span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`flex items-center space-x-2 ${isActive
                      ? "bg-sales-gradient text-primary-foreground shadow-shadow-success"
                      : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <BarChart3 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;