import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2 } from "lucide-react";

interface CompanyFormProps {
  onAnalysisGenerated: (result: string) => void;
}

const CompanyForm = ({ onAnalysisGenerated }: CompanyFormProps) => {
  const [companyName, setCompanyName] = useState("");
  const [researchInstruction, setResearchInstruction] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [roles, setRoles] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateAnalysis = async () => {
    setIsLoading(true);
    try {
      const payload = {
        type: "company",
        companyName,
        analysisDescription: researchInstruction,
        companyLocation,
        roles,
        notes: ""
      };

      const response = await fetch("https://n8n.warpdrivetech.in/webhook-test/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: payload }),
      });

      const result = await response.text();
      onAnalysisGenerated(result);
    } catch (error) {
      console.error("Error generating analysis:", error);
      onAnalysisGenerated("<div class='text-red-500'>Error generating analysis. Please try again.</div>");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Company Analysis Request
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
          />
        </div>

        <div>
          <Label htmlFor="research">Research Instruction *</Label>
          <Textarea
            id="research"
            value={researchInstruction}
            onChange={(e) => setResearchInstruction(e.target.value)}
            placeholder="Enter analysis description..."
            className="min-h-[100px]"
          />
        </div>

        <div>
          <Label htmlFor="location">Company Location *</Label>
          <Input
            id="location"
            value={companyLocation}
            onChange={(e) => setCompanyLocation(e.target.value)}
            placeholder="Enter company location"
          />
        </div>

        <div>
          <Label htmlFor="roles">Roles *</Label>
          <Textarea
            id="roles"
            value={roles}
            onChange={(e) => setRoles(e.target.value)}
            placeholder="Enter roles (e.g., CEO, CTO, etc.)"
            className="min-h-[80px]"
          />
        </div>

        <Button 
          onClick={handleGenerateAnalysis}
          disabled={!companyName || !researchInstruction || !companyLocation || !roles || isLoading}
          className="w-full bg-primary hover:bg-primary/90"
        >
          <Building2 className="w-4 h-4 mr-2" />
          {isLoading ? "Generating..." : "Generate Analysis"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CompanyForm;