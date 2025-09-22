import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BarChart3, Loader2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompanyFormData {
  companyName: string;
  analysisDescription: string;
  companyLocation: string;
  roles: string;
  researchNotes: string;
}

interface IndustryAnalysisFormProps {
  onAnalysisComplete?: (result: string) => void;
  onCompanyFormDataChange?: (data: CompanyFormData) => void;
  initialCompanyFormData?: CompanyFormData | null;
  showForm?: boolean;
  onFormShow?: () => void;
}

const IndustryAnalysisForm = ({
  onAnalysisComplete,
  onCompanyFormDataChange,
  initialCompanyFormData,
  showForm: externalShowForm,
  onFormShow
}: IndustryAnalysisFormProps) => {
  const [isLoadingIndustries, setIsLoadingIndustries] = useState(false);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [industries, setIndustries] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [researchNotes, setResearchNotes] = useState("");
  const [showCustomIndustry, setShowCustomIndustry] = useState(false);
  const [customIndustry, setCustomIndustry] = useState("");
  const [analysisType, setAnalysisType] = useState<"industry" | "company" | "ai">("ai");
  const [companyName, setCompanyName] = useState("");
  const [analysisDescription, setAnalysisDescription] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [roles, setRoles] = useState("");
  const [researchInstruction, setResearchInstruction] = useState("");
  const [outputSize, setOutputSize] = useState("10");
  const [industryName, setIndustryName] = useState("");
  const [aiRoles, setAiRoles] = useState("");
  const { toast } = useToast();

  const durations = ["3 Months", "6 Months", "9 Months", "12 Months"];

  const loadAnalysisForm = async (type: "industry" | "company" | "ai") => {
    setAnalysisType(type);

    if (onFormShow) {
      onFormShow();
    }

    if (type === "industry") {
      setIsLoadingIndustries(true);
      try {
        const response = await fetch("https://n8n.warpdrivetech.in/webhook/analysis", {
          method: "POST",
        });
        const data = await response.json();
        const industryList = Object.values(data) as string[];
        setIndustries(industryList);
        setShowForm(true);
        toast({
          title: "Industries loaded successfully",
          description: `${industryList.length} industries available for analysis`,
        });
      } catch (error) {
        console.error("Error fetching industries:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load industries. Please try again.",
        });
      } finally {
        setIsLoadingIndustries(false);
      }
    } else {
      // AI or Company just show form directly
      setShowForm(true);
    }
  };

  useEffect(() => {
    if (externalShowForm !== undefined) {
      setShowForm(externalShowForm);
    }
  }, [externalShowForm]);

  useEffect(() => {
    if (initialCompanyFormData) {
      setCompanyName(initialCompanyFormData.companyName);
      setAnalysisDescription(initialCompanyFormData.analysisDescription);
      setCompanyLocation(initialCompanyFormData.companyLocation);
      setRoles(initialCompanyFormData.roles);
      setResearchNotes(initialCompanyFormData.researchNotes);
      setAnalysisType("company");
      setShowForm(true);
    }
  }, [initialCompanyFormData]);

  const notifyFormDataChange = () => {
    if (analysisType === "company" && onCompanyFormDataChange) {
      onCompanyFormDataChange({
        companyName,
        analysisDescription,
        companyLocation,
        roles,
        researchNotes,
      });
    }
  };

  const generateAnalysis = async () => {
    // ✅ validation
    if (analysisType === 'ai') {
      if (!industryName || !outputSize) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields for AI analysis",
          variant: "destructive",
        });
        return;
      }
    } else if (analysisType === 'industry') {
      const industryToUse = selectedIndustry === 'Other' ? customIndustry : selectedIndustry;
      if (!industryToUse || !selectedDuration || !researchInstruction || !outputSize) {
        toast({
          title: "Missing information",
          description: "Please select Industry, Duration, and Output Size",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!companyName) {
        toast({
          title: "Missing information",
          description: "Please enter a company name",
          variant: "destructive",
        });
        return;
      }
    }

    setIsGeneratingAnalysis(true);
    try {
      let payload;
      if (analysisType === 'ai') {
        payload = {
          type: 'ai',
          IndustryName: industryName,
          ResearchInstruction: researchInstruction,
          OutputSize: outputSize,
          Role: aiRoles || "",
        };
      } else if (analysisType === 'industry') {
        payload = {
          type: 'industry',
          Industry: selectedIndustry === 'Other' ? customIndustry : selectedIndustry,
          Duration: selectedDuration,
          ResearchInstruction: researchInstruction,
          OutputSize: outputSize,
          Notes: researchNotes || "",
        };
      } else {
        payload = {
          type: 'company',
          companyName,
          analysisDescription,
          companyLocation,
          roles,
          Notes: researchNotes || "",
        };
      }
      //Khushal
      const response = await fetch("https://n8n.warpdrivetech.in/webhook/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.text();
      notifyFormDataChange();
      onAnalysisComplete?.(result);

      toast({
        title: "Analysis generated successfully",
        description: "Your analysis is ready",
      });
    } catch (error) {
      console.error("Error generating analysis:", error);
      toast({
        title: "Error generating analysis",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-lg border-0 bg-card">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-semibold text-card-foreground">
              Sales Analysis Request
            </CardTitle>
          </div>
          <p className="text-muted-foreground text-sm">
            Fill out the form below to receive a customized analysis for your industry and business needs.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap justify-center gap-4">
              {/*  AI Analysis Button (fixed) */}
              <Button
                onClick={() => loadAnalysisForm("ai")}
                disabled={isLoadingIndustries}
                variant="outline"
                size="lg"
                className={`flex-1 max-w-[200px] transition-colors duration-200 ${analysisType === "ai"
                  ? 'bg-[#11ad3b] text-white border-[#11ad3b] hover:bg-[#0e9a34] hover:text-white'
                  : 'hover:bg-muted/50 hover:text-foreground'
                  }`}
              >
                {analysisType === "ai" && isLoadingIndustries ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Industry
                  </>
                )}
              </Button>

              <Button
                onClick={() => loadAnalysisForm("industry")}
                disabled={isLoadingIndustries}
                variant="outline"
                size="lg"
                className={`flex-1 max-w-[200px] transition-colors duration-200 ${analysisType === "industry"
                  ? 'bg-[#11ad3b] text-white border-[#11ad3b] hover:bg-[#0e9a34] hover:text-white'
                  : 'hover:bg-muted/50 hover:text-foreground'
                  }`}
              >
                {analysisType === "industry" && isLoadingIndustries ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    AI Analysis
                  </>
                )}
              </Button>

              <Button
                onClick={() => loadAnalysisForm("company")}
                disabled={isLoadingIndustries}
                variant="outline"
                size="lg"
                className={`flex-1 max-w-[200px] transition-colors duration-200 ${analysisType === "company"
                  ? 'bg-[#11ad3b] text-white border-[#11ad3b] hover:bg-[#0e9a34] hover:text-white'
                  : 'hover:bg-muted/50 hover:text-foreground'
                  }`}
              >
                <Zap className="w-4 h-4 mr-2" />
                Company
              </Button>
            </div>
          </div>

          {showForm && (
            <div className="space-y-6">
              {analysisType === 'ai' ? (
                <>
                  {/* AI Analysis form */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Industry Name</Label>
                    <input
                      value={industryName}
                      onChange={(e) => setIndustryName(e.target.value)}
                      placeholder="Enter industry name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Research Instruction</Label>
                    <Textarea
                      value={researchInstruction}
                      onChange={(e) => setResearchInstruction(e.target.value)}
                      placeholder="Enter detailed research instructions"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[110px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Output Size *</Label>
                    <Select value={outputSize} onValueChange={setOutputSize}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select output size" />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((size) => (
                          <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Role</Label>
                    <input
                      value={aiRoles}
                      onChange={(e) => setAiRoles(e.target.value)}
                      placeholder="Enter role"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </>
              ) : analysisType === 'industry' ? (
                <>
                  {/* Industry form */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Industry *</Label>
                    <Select
                      value={selectedIndustry}
                      onValueChange={(value) => {
                        setSelectedIndustry(value);
                        setShowCustomIndustry(value === 'Other');
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                        <SelectItem value="Other">Other (please specify)</SelectItem>
                      </SelectContent>
                    </Select>
                    {showCustomIndustry && (
                      <input
                        type="text"
                        value={customIndustry}
                        onChange={(e) => setCustomIndustry(e.target.value)}
                        placeholder="Please specify your industry"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Research Instruction</Label>
                    <Textarea
                      value={researchInstruction}
                      onChange={(e) => setResearchInstruction(e.target.value)}
                      placeholder="Enter specific instructions or focus points for the research"
                      className="min-h-[110px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Analysis Duration *</Label>
                    <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select analysis duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {durations.map((duration) => (
                          <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Output Size *</Label>
                    <Select value={outputSize} onValueChange={setOutputSize}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select output size" />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 20, 30, 40, 50].map((size) => (
                          <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  {/* Company Analysis form */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Company Name</Label>
                    <input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter company name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Research Instruction</Label>
                    <Textarea
                      value={analysisDescription}
                      onChange={(e) => setAnalysisDescription(e.target.value)}
                      placeholder="Enter Detailed Research Instruction"
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Company Location</Label>
                    <input
                      value={companyLocation}
                      onChange={(e) => setCompanyLocation(e.target.value)}
                      placeholder="Enter company location"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Roles</Label>
                    <Textarea
                      value={roles}
                      onChange={(e) => setRoles(e.target.value)}
                      placeholder="Enter roles (comma separated)"
                      className="min-h-[60px]"
                    />
                  </div>
                </>
              )}

              <Button
                onClick={generateAnalysis}
                disabled={
                  isGeneratingAnalysis ||
                  (analysisType === 'ai'
                    ? (!industryName || !outputSize)
                    : analysisType === 'industry'
                      ? (!(selectedIndustry === 'Other' ? customIndustry : selectedIndustry) || !selectedDuration || !outputSize)
                      : !companyName
                  )
                }
                className="w-full bg-[#11ad3b] hover:bg-[#0e9a34] text-white transition-colors duration-200"
                size="lg"
              >
                {isGeneratingAnalysis ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Analysis...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Generate Analysis</span>
                  </div>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IndustryAnalysisForm;
