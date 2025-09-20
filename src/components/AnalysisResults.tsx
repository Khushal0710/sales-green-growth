import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus } from "lucide-react";

interface AnalysisResultsProps {
  result: string | null;
}

const AnalysisResults = ({ result }: AnalysisResultsProps) => {
  const handleAddToCRM = () => {
    // Add to CRM functionality
    console.log("Adding to CRM...");
  };

  if (!result) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Analysis results will appear here after generation</p>
            <p className="text-sm mt-1">Fill out a form and click "Generate Analysis" to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Analysis Results
        </CardTitle>
        <Button onClick={handleAddToCRM} size="sm" className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add to CRM
        </Button>
      </CardHeader>
      <CardContent>
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: result }}
        />
      </CardContent>
    </Card>
  );
};

export default AnalysisResults;