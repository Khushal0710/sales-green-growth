import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap } from "lucide-react";

interface IndustryFormProps {
  onAnalysisGenerated: (result: string) => void;
}

const IndustryForm = ({ onAnalysisGenerated }: IndustryFormProps) => {
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [researchInstruction, setResearchInstruction] = useState("");
  const [outputSize, setOutputSize] = useState("");
  const [researchNotes, setResearchNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const industries = [
    "Technology", "Healthcare", "Finance", "Manufacturing", "Retail", 
    "Education", "Real Estate", "Automotive", "Energy", "Other"
  ];

  const durations = ["3 months", "6 months", "9 months", "12 months"];
  const outputSizes = ["5", "10", "15", "20", "25", "30", "35", "40", "45", "50"];

  const handleGenerateAnalysis = async () => {
    setIsLoading(true);
    try {
      const payload = {
        type: "industry",
        Industry: selectedIndustry === "Other" ? customIndustry : selectedIndustry,
        Duration: selectedDuration,
        ResearchInstruction: researchInstruction,
        OutputSize: outputSize,
        Notes: researchNotes || ""
      };

      const response = await fetch("https://n8n.warpdrivetech.in/webhook/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
          <Zap className="w-5 h-5 text-primary" />
          Industry Analysis Request
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="industry">Industry *</Label>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedIndustry === "Other" && (
          <div>
            <Label htmlFor="customIndustry">Custom Industry *</Label>
            <Input
              id="customIndustry"
              value={customIndustry}
              onChange={(e) => setCustomIndustry(e.target.value)}
              placeholder="Enter custom industry"
            />
          </div>
        )}

        <div>
          <Label htmlFor="duration">Duration *</Label>
          <Select value={selectedDuration} onValueChange={setSelectedDuration}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {durations.map((dur) => (
                <SelectItem key={dur} value={dur}>
                  {dur}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="research">Research Instruction *</Label>
          <Textarea
            id="research"
            value={researchInstruction}
            onChange={(e) => setResearchInstruction(e.target.value)}
            placeholder="Enter research instructions..."
            className="min-h-[100px]"
          />
        </div>

        <div>
          <Label htmlFor="output">Output Size *</Label>
          <Select value={outputSize} onValueChange={setOutputSize}>
            <SelectTrigger>
              <SelectValue placeholder="Select output size" />
            </SelectTrigger>
            <SelectContent>
              {outputSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={researchNotes}
            onChange={(e) => setResearchNotes(e.target.value)}
            placeholder="Additional notes (optional)..."
            className="min-h-[80px]"
          />
        </div>

        <Button 
          onClick={handleGenerateAnalysis}
          disabled={!selectedIndustry || (selectedIndustry === "Other" && !customIndustry) || !selectedDuration || !researchInstruction || !outputSize || isLoading}
          className="w-full bg-primary hover:bg-primary/90"
        >
          <Zap className="w-4 h-4 mr-2" />
          {isLoading ? "Generating..." : "Generate Analysis"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default IndustryForm;