import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResultProps {
  result: string;
  onBackToForm?: () => void;
}

const AnalysisResult = ({ result, onBackToForm }: AnalysisResultProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [parsedData, setParsedData] = useState<Record<string, any> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(800); // default bigger
  const { toast } = useToast();

  // Parse HTML and extract data when result changes
  useEffect(() => {
    if (!result) return;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(result, "text/html");
      const data: Record<string, any> = {};

      // Extract data from tables
      const tables = doc.querySelectorAll("table");
      tables.forEach((table, index) => {
        const rows = table.querySelectorAll("tr");
        const tableData: Record<string, string> = {};

        rows.forEach((row) => {
          const cells = row.querySelectorAll("td, th");
          if (cells.length >= 2) {
            const key = cells[0].textContent?.trim() || "";
            const value = cells[1].textContent?.trim() || "";
            if (key) tableData[key] = value;
          }
        });

        if (Object.keys(tableData).length > 0) {
          data[`table_${index + 1}`] = tableData;
        }
      });

      // Extract data from paragraphs/headings
      const paragraphs = doc.querySelectorAll("p, h1, h2, h3, h4, h5, h6");
      const textData: string[] = [];
      paragraphs.forEach((p) => {
        const text = p.textContent?.trim();
        if (text) textData.push(text);
      });

      if (textData.length > 0) {
        data["text_content"] = textData;
      }

      setParsedData(data);
    } catch (error) {
      console.error("Error parsing HTML:", error);
      setParsedData(null);
    }
  }, [result]);

  // Resize iframe to fit the provided HTML content
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;
        setTimeout(() => {
          const body = doc.body;
          const html = doc.documentElement;
          const height = Math.max(
            body?.scrollHeight || 0,
            body?.offsetHeight || 0,
            html?.clientHeight || 0,
            html?.scrollHeight || 0,
            html?.offsetHeight || 0
          );
          if (height > 0) setIframeHeight(Math.min(height + 40, 750)); // increased cap
        }, 50);
      } catch (e) {
        setIframeHeight(1200);
      }
    };

    iframe.addEventListener("load", handleLoad);
    handleLoad();

    return () => iframe.removeEventListener("load", handleLoad);
  }, [result]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 px-6 pt-6">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-success" />
          <h3 className="text-lg font-semibold text-foreground">Analysis Results</h3>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-6 pb-6">
        <Card className="shadow-lg border-0 bg-card h-full">
          <CardContent className="p-0 h-full">
            {result ? (
              <div className="h-full">
                <iframe
                  ref={iframeRef}
                  title="analysis-html"
                  srcDoc={`<!DOCTYPE html>
                    <html>
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                        html, body {
                          height: 100%;
                          margin: 0;
                          padding: 0;
                          overflow: hidden;
                        }
                        body {
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                          line-height: 1.5;
                          color: #333;
                          padding: 24px;
                          margin: 0;
                          overflow-y: auto;
                          height: 100%;
                          box-sizing: border-box;
                        }
                        h1, h2, h3, h4, h5, h6 {
                          margin-top: 1.5em;
                          margin-bottom: 0.5em;
                          line-height: 1.3;
                        }
                        p {
                          margin: 0 0 1em 0;
                        }
                        table {
                          border-collapse: collapse;
                          width: 100%;
                          margin: 1em 0;
                        }
                        th, td {
                          border: 1px solid #ddd;
                          padding: 8px 12px;
                          text-align: left;
                        }
                        th {
                          background-color: #f5f5f5;
                        }
                        pre {
                          background: #f5f5f5;
                          padding: 1em;
                          border-radius: 4px;
                          overflow-x: auto;
                        }
                        code {
                          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
                          font-size: 0.9em;
                        }
                      </style>
                    </head>
                    <body>
                      ${result}
                    </body>
                    </html>`}
                  sandbox="allow-same-origin allow-forms allow-scripts allow-popups allow-top-navigation"
                  className="w-full h-full border-0 bg-white rounded-md"
                  style={{ minHeight: '100%' }}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
                <CheckCircle className="w-12 h-12 mb-4 opacity-50" />
                <p>No analysis results to display</p>
                <p className="text-sm mt-1">Generate an analysis to see the results here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisResult;
