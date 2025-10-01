import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Eye, Edit3, Save, X, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EmailTemplate {
  row_number: number;
  Company: string;
  Description?: string;
  "Why Salesforce ? "?: string;
  "Email Templet 1"?: string;
  "Subject 1"?: string;
  "Status 1"?: string;
  "Email Templet 2"?: string;
  "Subject 2"?: string;
  "Status 2"?: string;
  "Email Templet 3"?: string;
  "Subject 3"?: string;
  "Status 3"?: string;
  "Email Templet 4"?: string;
  "Subject 4"?: string;
  "Status 4"?: string;
  "Email Templet 5"?: string;
  "Subject 5"?: string;
  "Status 5"?: string;
  "Email Templet 6"?: string;
  "Subject 6"?: string;
  "Status 6"?: string;
  [key: string]: string | number | undefined;
}

interface ProcessedTemplate {
  id: string;
  company: string;
  templateNumber: number;
  subject: string;
  content: string;
  status: 'Approved' | 'Rejected' | 'Pending';
  changeRequest?: string;
  originalStatus?: string; // Track original status for change detection
}

interface SavePayload {
  "Company name": string;
  "Templet Number": number;
  "Status": string;
  "Change Request": string;
  "Email templet": string;
}

const EmailTemplates = () => {
  const { toast } = useToast();
  const [rawTemplates, setRawTemplates] = useState<EmailTemplate[]>([]);
  const [processedTemplates, setProcessedTemplates] = useState<ProcessedTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<'Approved' | 'Rejected' | 'Pending'>('Pending');
  const [editingChangeRequest, setEditingChangeRequest] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      console.log('Fetching email templates from webhook...');

      const response = await fetch('https://n8n.warpdrivetech.in/webhook/get-email-templets', {
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
        setRawTemplates([]);
        setProcessedTemplates([]);
      } else {
        setRawTemplates(data);
        processTemplatesData(data);
      }
    } catch (err) {
      console.error('Error fetching email templates:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch templates. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const processTemplatesData = (data: EmailTemplate[]) => {
    const processed: ProcessedTemplate[] = [];

    data.forEach((template) => {
      // Process each of the 6 templates per company
      for (let i = 1; i <= 6; i++) {
        const emailKey = `Email Templet ${i}` as keyof EmailTemplate;
        const subjectKey = `Subject ${i}` as keyof EmailTemplate;
        const statusKey = `Status ${i}` as keyof EmailTemplate;

        const content = template[emailKey] as string;
        const subject = template[subjectKey] as string;
        const status = template[statusKey] as string;

        if (content && subject) {
          const currentStatus = status ? (status as 'Approved' | 'Rejected' | 'Pending') : 'Pending';
          processed.push({
            id: `${template.row_number}-${i}`,
            company: template.Company.replace(/^\d+\.\s*/, '').trim(), // Remove number prefix
            templateNumber: i,
            subject: subject,
            content: content,
            status: currentStatus,
            originalStatus: currentStatus, // Store original status for change tracking
            changeRequest: ''
          });
        }
      }
    });

    setProcessedTemplates(processed);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const processTemplateContent = (template: string) => {
    if (!template) return '';

    // Remove DOCTYPE and html tags for preview, keep the content clean
    let processed = template.replace(/<!DOCTYPE[^>]*>/gi, '');
    processed = processed.replace(/<\/?html[^>]*>/gi, '');
    processed = processed.replace(/<\/?head[^>]*>/gi, '');
    processed = processed.replace(/<\/?body[^>]*>/gi, '');
    processed = processed.replace(/<meta[^>]*>/gi, '');
    processed = processed.replace(/<title[^>]*>.*?<\/title>/gi, '');

    return processed;
  };

  const handlePreview = (template: ProcessedTemplate) => {
    const processedTemplate = processTemplateContent(template.content);
    setSelectedTemplate(processedTemplate);
    setSelectedCompany(template.company);
  };

  const handleSaveAll = async () => {
    if (processedTemplates.length === 0) {
      setSaveStatus({ type: 'error', message: 'No templates to save' });
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    try {
      // Find templates with changed status
      const changedTemplates = processedTemplates.filter(template =>
        template.status !== template.originalStatus
      );

      if (changedTemplates.length === 0) {
        setSaveStatus({ type: 'success', message: 'No changes to save' });
        toast({
          title: 'No Changes',
          description: 'No template changes were detected',
          variant: 'default',
        });
        return;
      }

      // Create payload with required format
      const payload: SavePayload[] = changedTemplates.map(template => ({
        "Company name": template.company,
        "Templet Number": template.templateNumber,
        "Status": template.status,
        "Change Request": template.changeRequest || '',
        "Email templet": template.content
      }));

      console.log('Sending changed templates to webhook:', JSON.stringify(payload, null, 2));

      // Send data to the webhook
      const response = await fetch('https://n8n.warpdrivetech.in/webhook/45626219-5341-4b7d-a524-1aeeaa70c204', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Save successful:', result);

      // Update original status to current status after successful save
      const updatedTemplates = processedTemplates.map(template => ({
        ...template,
        originalStatus: template.status
      }));
      setProcessedTemplates(updatedTemplates);

      setSaveStatus({ type: 'success', message: `${changedTemplates.length} template(s) saved successfully!` });
      toast({
        title: 'Success',
        description: `${changedTemplates.length} template(s) have been saved successfully`,
        variant: 'default',
      });

    } catch (error) {
      console.error('Error saving templates:', error);
      let errorMessage = 'Failed to save templates';

      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error: Could not connect to the server. Please check your internet connection.';
        } else if (error.message.includes('CORS')) {
          errorMessage = 'CORS error: The server is not configured to accept requests from this domain.';
        } else {
          errorMessage = error.message;
        }
      }

      setSaveStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "flex items-center gap-1 font-medium";
    switch (status) {
      case 'Approved':
        return <Badge className={`${baseClasses} bg-green-100 text-green-800 hover:bg-green-200`}>
          {getStatusIcon(status)} Approved
        </Badge>;
      case 'Rejected':
        return <Badge className={`${baseClasses} bg-red-100 text-red-800 hover:bg-red-200`}>
          {getStatusIcon(status)} Rejected
        </Badge>;
      default:
        return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800 hover:bg-yellow-200`}>
          {getStatusIcon(status)} Pending
        </Badge>;
    }
  };

  const getTemplateTypeName = (templateNumber: number) => {
    const types = [
      'Welcome Email',
      'Follow-up Email',
      'Product Demo',
      'Case Study',
      'Pricing Information',
      'Final Follow-up'
    ];
    return types[templateNumber - 1] || `Template ${templateNumber}`;
  };

  const truncateSubject = (subject: string, maxLength: number = 40) => {
    if (subject.length <= maxLength) return subject;
    return subject.substring(0, maxLength) + '...';
  };

  // Group templates by company
  const groupedTemplates = processedTemplates.reduce((acc, template) => {
    if (!acc[template.company]) {
      acc[template.company] = [];
    }
    acc[template.company].push(template);
    return acc;
  }, {} as Record<string, ProcessedTemplate[]>);

  // Count changed templates
  const changedTemplatesCount = processedTemplates.filter(template =>
    template.status !== template.originalStatus
  ).length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-green-200">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Preview Overlay */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      <div className="relative z-50">
        {selectedTemplate && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 max-h-[80vh] bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-green-200 flex flex-col">
            <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Email Preview</h3>
                <p className="text-green-100 text-sm">{selectedCompany}</p>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-white hover:text-green-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
              <div
                className="flex-1 overflow-y-auto p-6"
                style={{
                  maxHeight: 'calc(80vh - 120px)',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#9CA3AF #F3F4F6',
                  msOverflowStyle: 'none'
                }}
              >
                <div
                  className="prose max-w-none"
                  style={{
                    maxWidth: '100%',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                  dangerouslySetInnerHTML={{ __html: selectedTemplate || '' }}
                />
              </div>
              <style jsx>{`
                .prose {
                  max-width: 100%;
                }
                .prose img {
                  max-width: 100%;
                  height: auto;
                }
                ::-webkit-scrollbar {
                  width: 8px;
                  height: 8px;
                }
                ::-webkit-scrollbar-track {
                  background: #F3F4F6;
                  border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb {
                  background: #9CA3AF;
                  border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                  background: #6B7280;
                }
              `}</style>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: '#28921f' }}>
                Email Templates Manager
              </h1>
              <p className="text-lg" style={{ color: '#000000' }}>
                Manage and approve email templates for all companies
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchTemplates}
                disabled={loading}
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={handleSaveAll}
                disabled={isSaving || changedTemplatesCount === 0}
                className="bg-[#28921f] hover:bg-[#1f6f19] text-white shadow-lg"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save All Templates {changedTemplatesCount > 0 && `(${changedTemplatesCount})`}
                  </>
                )}
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
                className="bg-[#28921f] hover:bg-[#1f6f19] text-white shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Generating...
                  </>
                ) : (
                  'Generate Templates'
                )}
              </Button>
            </div>
          </div>

          {saveStatus && (
            <div className={`mb-6 p-4 rounded-lg border ${saveStatus.type === 'success'
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
              }`}>
              <div className="flex items-center gap-2">
                {saveStatus.type === 'success' ?
                  <CheckCircle className="w-5 h-5" /> :
                  <XCircle className="w-5 h-5" />
                }
                {saveStatus.message}
              </div>
            </div>
          )}
        </div>

        {/* Company Cards */}
        <div className="space-y-8">
          {Object.entries(groupedTemplates).map(([company, companyTemplates]) => (
            <Card key={company} className="border-green-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-[#28921f] text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center justify-between">
                  <span>{company}</span>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {companyTemplates.length} Templates
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-green-50">
                        <TableHead className="text-green-800 font-semibold">Template Type</TableHead>
                        <TableHead className="text-green-800 font-semibold w-80">Subject</TableHead>
                        <TableHead className="text-green-800 font-semibold">Status</TableHead>
                        <TableHead className="text-green-800 font-semibold">Change Request</TableHead>
                        <TableHead className="text-green-800 font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companyTemplates.map((template) => (
                        <TableRow
                          key={template.id}
                          className={`hover:bg-green-50 transition-colors ${template.status !== template.originalStatus ? 'bg-yellow-50' : ''
                            }`}
                        >
                          <TableCell className="font-medium text-gray-900">
                            {getTemplateTypeName(template.templateNumber)}
                            {template.status !== template.originalStatus && (
                              <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                                Changed
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="w-80">
                            <div
                              className="text-sm cursor-help"
                              title={template.subject}
                            >
                              {truncateSubject(template.subject)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {editingTemplate === template.id ? (
                              <Select
                                value={editingStatus}
                                onValueChange={(value: 'Approved' | 'Rejected' | 'Pending') => setEditingStatus(value)}
                              >
                                <SelectTrigger className="w-[140px] border-green-300 focus:border-green-500">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="Approved">Approved</SelectItem>
                                  <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              getStatusBadge(template.status)
                            )}
                          </TableCell>
                          <TableCell>
                            {editingTemplate === template.id && editingStatus === 'Rejected' ? (
                              <Input
                                value={editingChangeRequest}
                                onChange={(e) => setEditingChangeRequest(e.target.value)}
                                placeholder="Enter change request"
                                className="border-green-300 focus:border-green-500"
                              />
                            ) : template.status === 'Rejected' && template.changeRequest ? (
                              <div className="max-w-xs">
                                <p className="text-sm text-red-700 bg-red-50 p-2 rounded border border-red-200">
                                  {template.changeRequest}
                                </p>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">No change request</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {editingTemplate === template.id ? (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      const updatedTemplates = processedTemplates.map(t =>
                                        t.id === template.id
                                          ? {
                                            ...t,
                                            status: editingStatus,
                                            changeRequest: editingStatus === 'Rejected' ? editingChangeRequest : undefined
                                          }
                                          : t
                                      );
                                      setProcessedTemplates(updatedTemplates);
                                      setEditingTemplate(null);
                                      toast({
                                        title: 'Template Updated',
                                        description: `Status changed to ${editingStatus}`,
                                        variant: 'default',
                                      });
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <Save className="w-4 h-4 mr-1" />
                                    Save
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingTemplate(null)}
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                  >
                                    <X className="w-4 h-4 mr-1" />
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
                                      setEditingTemplate(template.id);
                                      setEditingStatus(template.status);
                                      setEditingChangeRequest(template.changeRequest || '');
                                    }}
                                    className="border-green-300 text-green-700 hover:bg-green-50"
                                  >
                                    <Edit3 className="w-4 h-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePreview(template);
                                    }}
                                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
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
              </CardContent>
            </Card>
          ))}
        </div>

        {processedTemplates.length === 0 && !loading && (
          <Card className="border-green-200 text-center py-12">
            <CardContent>
              <div className="text-green-600 mb-4">
                <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Templates Found</h3>
              <p className="text-gray-600 mb-6">Generate new templates to get started with email management.</p>
              <Button
                onClick={() => {
                  setIsGenerating(true);
                  setTimeout(() => {
                    fetchTemplates();
                    setIsGenerating(false);
                  }, 2000);
                }}
                className="bg-[#28921f] hover:bg-[#1f6f19] text-white shadow-lg"
              >
                Generate Templates
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <style jsx global>{`
        /* Hide scrollbars globally for preview modal */
        .prose::-webkit-scrollbar {
          display: none;
        }
        .prose {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </div>
  );
};

export default EmailTemplates;