import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EmailTemplate {
  row_number: number;
  "Email Templet ": string;
  Company: string;
  "Created At": string;
  status?: 'Approved' | 'Rejected';
  changeRequest?: string;
}

const EmailTemplates = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editingStatus, setEditingStatus] = useState<'Approved' | 'Rejected'>('Approved');
  const [editingChangeRequest, setEditingChangeRequest] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      console.log('Fetching email templates from webhook...');
      const response = await fetch('https://n8n.warpdrivetech.in/webhook/get-email-templet', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (!Array.isArray(data)) {
        console.warn('Expected an array of templates but received:', data);
        setTemplates([]);
      } else {
        setTemplates(data);
      }
    } catch (err) {
      console.error('Error fetching email templates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch when component mounts
    const timer = setTimeout(() => {
      fetchTemplates();
    }, 100);
  }, []);

  const processTemplate = (template: string) => {
    if (!template) return '';

    // Remove 'code' text
    let processed = template.replace(/<p>code<\/p>/gi, '');

    // Make subject line bold
    processed = processed.replace(/(<p>Subject:)(.*?)(<\/p>)/gi,
      (match, p1, p2, p3) =>
        `<p><strong>${p1}${p2}${p3}</strong></p>`
    );

    return processed;
  };

  const handlePreview = (template: EmailTemplate) => {
    const processedTemplate = processTemplate(template["Email Templet "]);
    setSelectedTemplate(processedTemplate);
    setSelectedCompany(template.Company);
  };

  const handleSaveAll = async () => {
    if (templates.length === 0) {
      setSaveStatus({ type: 'error', message: 'No templates to save' });
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    try {
      // Prepare the request data as a direct array
      const requestData = templates.map(template => ({
        row_number: template.row_number,
        "Company": template.Company,
        "Email Templet ": template["Email Templet "],
        "status": template.status || 'Pending',
        "changeRequest": template.changeRequest || ''
      }));

      console.log('Sending data:', JSON.stringify(requestData, null, 2));

      const response = await fetch('https://n8n.warpdrivetech.in/webhook/c1bba515-a9e4-44ca-a8a0-bfa7f31e050e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      try {
        const result = await response.json();
        console.log('Save successful:', result);
        setSaveStatus({ type: 'success', message: 'Templates saved successfully!' });
      } catch (e) {
        console.log('Response was not JSON, but request might have succeeded');
        setSaveStatus({ type: 'success', message: 'Templates saved successfully!' });
      }
    } catch (error) {
      console.error('Error saving templates:', error);
      setSaveStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to save templates'
      });
    } finally {
      setIsSaving(false);
      // Clear the status message after 5 seconds
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative m-[5%]">
      {/* Preview Overlay */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      <div className="relative z-50">
        {selectedTemplate && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 max-h-[80vh] bg-white rounded-lg shadow-xl overflow-hidden z-50 mt-8">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="font-semibold">Email Preview</h3>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-auto" style={{ maxHeight: 'calc(80vh - 60px)' }}>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedTemplate || '' }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <Tabs defaultValue="templates" className="w-full">
          <TabsList>
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchTemplates}
            disabled={loading}
            title="Refresh Templates"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            onClick={handleSaveAll}
            disabled={isSaving || templates.length === 0}
            variant="outline"
            className="mr-2"
          >
            {isSaving ? 'Saving...' : 'Save All Templates'}
          </Button>
          <Button
            onClick={async () => {
              setIsGenerating(true);
              try {
                const response = await fetch('https://n8n.warpdrivetech.in/webhook/generate-templet', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ action: 'generate' })
                });

                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Generate template response:', result);

                toast({
                  title: 'Success',
                  description: 'Template generation started successfully',
                  variant: 'default',
                });

                // Refresh the templates after a short delay
                setTimeout(fetchTemplates, 2000);

              } catch (error) {
                console.error('Error generating template:', error);
                toast({
                  title: 'Error',
                  description: 'Failed to generate template. Please try again.',
                  variant: 'destructive',
                });
              } finally {
                setIsGenerating(false);
              }
            }}
            disabled={isGenerating}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate Template'
            )}
          </Button>
        </div>
      </div>
      {saveStatus && (
        <div className={`mb-4 p-3 rounded-md ${saveStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {saveStatus.message}
        </div>
      )}
      <Tabs defaultValue="templates" className="w-full">

        <TabsContent value="templates">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Change Request</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow
                    key={template.row_number}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>{template.Company}</TableCell>
                    <TableCell>
                      {editingRow === template.row_number ? (
                        <Select
                          value={editingStatus}
                          onValueChange={(value: 'Approved' | 'Rejected') => setEditingStatus(value)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className={template.status === 'Rejected' ? 'text-red-600' : 'text-green-600'}>
                          {template.status || 'Pending'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === template.row_number && editingStatus === 'Rejected' ? (
                        <Input
                          value={editingChangeRequest}
                          onChange={(e) => setEditingChangeRequest(e.target.value)}
                          placeholder="Enter change request"
                          className="w-full"
                        />
                      ) : template.status === 'Rejected' ? (
                        <div className="max-w-xs truncate" title={template.changeRequest}>
                          {template.changeRequest}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {editingRow === template.row_number ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => {
                                const updatedTemplates = templates.map(t =>
                                  t.row_number === template.row_number
                                    ? {
                                      ...t,
                                      status: editingStatus,
                                      changeRequest: editingStatus === 'Rejected' ? editingChangeRequest : undefined
                                    }
                                    : t
                                );
                                setTemplates(updatedTemplates);
                                setEditingRow(null);
                              }}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingRow(null)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingRow(template.row_number);
                                setEditingStatus(template.status || 'Approved');
                                setEditingChangeRequest(template.changeRequest || '');
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreview(template);
                              }}
                            >
                              Preview
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailTemplates;
