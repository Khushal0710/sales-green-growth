import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import IndustryAnalysisForm from "./IndustryAnalysisForm";
import AnalysisResults from "@/components/AnalysisResult";

const Analysis = () => {
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [companyFormData, setCompanyFormData] = useState<any>(null);

  const handleAnalysisGenerated = (result: string) => {
    // Store the result in state so it updates the right panel
    setAnalysisResult(result);
  };

  const handleCompanyFormDataChange = (data: any) => {
    setCompanyFormData(data);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto" >
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#11ad3b' }}>Industry Analysis</h1>
          <p className="text-muted-foreground">Fill out the form to receive a customized industry analysis for your business needs.</p>
        </div>


        {/* Split Screen */}
        <ResizablePanelGroup direction="horizontal" className="min-h-[600px] border rounded-lg overflow-hidden">
          {/* Left Panel - Form */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="p-6 h-full overflow-auto" >
              <IndustryAnalysisForm
                onAnalysisComplete={handleAnalysisGenerated}
                onCompanyFormDataChange={handleCompanyFormDataChange}
                initialCompanyFormData={companyFormData}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Results */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full bg-muted/20">
              <AnalysisResults result={analysisResult} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Analysis;
