import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import AIAnalysisForm from "@/components/forms/AIAnalysisForm";
import CompanyForm from "@/components/forms/CompanyForm";
import IndustryForm from "@/components/forms/IndustryForm";
import AnalysisResults from "@/components/AnalysisResults";

const Analysis = () => {
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleAnalysisGenerated = (result: string) => {
    setAnalysisResult(result);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Sales Analysis Request</h1>
          <p className="text-muted-foreground">Fill out the form below to receive a customized analysis for your industry and business needs.</p>
        </div>

        {/* Split Screen Layout */}
        <ResizablePanelGroup direction="horizontal" className="min-h-[600px] border rounded-lg">
          {/* Left Panel - Forms */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="p-6">
              <Tabs defaultValue="ai-analysis" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ai-analysis" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    AI Analysis
                  </TabsTrigger>
                  <TabsTrigger value="company" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Company
                  </TabsTrigger>
                  <TabsTrigger value="industry" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Industry
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="ai-analysis" className="mt-6">
                  <AIAnalysisForm onAnalysisGenerated={handleAnalysisGenerated} />
                </TabsContent>
                
                <TabsContent value="company" className="mt-6">
                  <CompanyForm onAnalysisGenerated={handleAnalysisGenerated} />
                </TabsContent>
                
                <TabsContent value="industry" className="mt-6">
                  <IndustryForm onAnalysisGenerated={handleAnalysisGenerated} />
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Results */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="p-6">
              <AnalysisResults result={analysisResult} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Analysis;