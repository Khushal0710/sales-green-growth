import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Input } from "@/components/ui/input";

interface Contact {
  row_number: number;
  'User Id': string;
  'Name ': string;
  Email: string;
  Role: string;
  'Role Details': string;
  Phone: string;
  'linkedin': string;
  'Send Status': string;
  Time: string;
  Opened: string;
  OpenedAt: string;
  'Company': string;
  'Comapany Revenue': string;
  'Description': string;
  'Sector': string;
  'Why Salesforce ?': string;
}

interface Company {
  company_name: string;
  description: string;
  why_salesforce: string;
}

const WEBHOOK_URL = "https://n8n.warpdrivetech.in/webhook/leads";

const LeadCompaniesTable = () => {
  const [isScrapDialogOpen, setIsScrapDialogOpen] = useState(false);
  const [selectedScrapCompany, setSelectedScrapCompany] = useState<Company | null>(null);
  const [availableRoles, setAvailableRoles] = useState<string[]>([
    'CEO',
    'CTO',
    'CFO',
    'VP of Sales',
    'Sales Director',
    'Sales Manager',
    'Other'
  ]);
  const [customRole, setCustomRole] = useState('');
  const [showCustomRoleInput, setShowCustomRoleInput] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const [scrapFormData, setScrapFormData] = useState({});

  const handleScrapFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // No longer needed as we've removed the form fields
  };

  const handleRoleSelect = (role: string) => {
    if (role === 'Other') {
      setShowCustomRoleInput(true);
      return;
    }

    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const addCustomRole = () => {
    if (customRole.trim() && !availableRoles.includes(customRole)) {
      setAvailableRoles(prev => [...prev, customRole]);
      setSelectedRoles(prev => [...prev, customRole]);
      setCustomRole('');
      // Don't hide the input field after adding a role
    }
  };

  const removeRole = (roleToRemove: string) => {
    setSelectedRoles(prev => prev.filter(role => role !== roleToRemove));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScrapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedScrapCompany?.company_name) {
      toast({
        title: 'Error',
        description: 'No company selected',
        variant: 'destructive',
      });
      return;
    }

    if (selectedRoles.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one role to scrape',
        variant: 'destructive',
      });
      return;
    }

    // Disable form while submitting
    setIsSubmitting(true);

    const formData = {
      company: selectedScrapCompany.company_name,
      roles: selectedRoles,
      timestamp: new Date().toISOString()
    };

    // Show loading toast that we'll update
    const loadingToast = toast({
      title: 'Sending data...',
      description: 'Please wait while we process your request',
      variant: 'default',
      duration: 10000, // Longer duration for long-running operations
    });

    try {
      // Send data to webhook with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('https://n8n.warpdrivetech.in/webhook/scrap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Webhook response:', result);

      // Show success message
      toast.dismiss(loadingToast);
      toast({
        title: 'Success',
        description: `Successfully started scraping for ${selectedScrapCompany.company_name}`,
        variant: 'default',
      });

      // Only close the dialog and reset form on success
      setIsScrapDialogOpen(false);
      setSelectedRoles([]);
      setCustomRole('');
      setShowCustomRoleInput(false);

    } catch (error) {
      console.error('Error sending data to webhook:', error);

      // Update the existing toast with error details
      toast.dismiss(loadingToast);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to start scraping. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Contact[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_companies" }), // tell n8n this is a fetch
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData = await response.json();
        console.log("Webhook POST response (fetch):", rawData);

        // Normalize webhook data and clean company name
        const normalizedData: Company[] = rawData.map((item: any) => ({
          company_name: item.Company?.replace(/^\d+\.\s*/, "").trim() || "N/A",
          description: item.Description || "No description available.",
          why_salesforce: item["Why Salesforce ? "]?.trim() || "",
        }));

        setCompanies(normalizedData);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to load companies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Handle company click to fetch contact details
  const handleCompanyClick = async (companyName: string) => {
    try {
      setIsLoadingContacts(true);
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "company_click",
          company_name: companyName.replace(/^\d+\.\s*/, "").trim()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Contact details response:", result);

      // Check if result is an array, if not, wrap it in an array
      const contacts = Array.isArray(result) ? result : [result];
      setSelectedCompany(contacts);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching contact details:", err);
      setError("Failed to load contact details. Please try again later.");
    } finally {
      setIsLoadingContacts(false);
    }
  };

  // Close modal handler
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 border rounded-md bg-red-50">
        {error}
      </div>
    );
  }

  if (companies.length === 0) {
    return <div className="m-[5%] text-muted-foreground p-4 text-center">No companies found</div>;
  }

  return (
    <div className="m-[5%]">
      <div className="rounded-md border">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Company Name</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[400px]">Why Salesforce?</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company, index) => (
            <TableRow key={index}>
              <TableCell className="align-top font-medium">
                <button
                  onClick={() => handleCompanyClick(company.company_name)}
                  className="text-blue-600 hover:underline"
                >
                  {company.company_name}
                </button>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white border-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedScrapCompany(company);
                    setIsScrapDialogOpen(true);
                  }}
                >
                  Scrap
                </Button>
              </TableCell>
              <TableCell className="align-top text-sm text-muted-foreground">
                {company.description}
              </TableCell>
              <TableCell className="align-top text-sm text-muted-foreground">
                {company.why_salesforce}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Toaster />

      {/* Scrap Dialog */}
      <Dialog open={isScrapDialogOpen} onOpenChange={setIsScrapDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Scrap Data</DialogTitle>
            <DialogDescription>
              Enter the details you want to scrape for {selectedScrapCompany?.company_name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleScrapSubmit} className="space-y-4">
            {/* Company Name (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input
                value={selectedScrapCompany?.company_name || ''}
                readOnly
                className="bg-gray-100"
              />
            </div>

            {/* Roles Multi-select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Roles to Scrape</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                {availableRoles.map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`role-${role}`}
                      checked={selectedRoles.includes(role)}
                      onChange={() => handleRoleSelect(role)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor={`role-${role}`} className="text-sm text-gray-700">
                      {role}
                    </label>
                  </div>
                ))}
              </div>

              {/* Custom Role Input */}
              {showCustomRoleInput && (
                <div className="flex space-x-2 mt-2">
                  <Input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="Enter custom role"
                    className="flex-1 border-green-400 focus:ring-green-500 focus:border-green-500"
                  />
                  <Button
                    type="button"
                    onClick={addCustomRole}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Add
                  </Button>
                </div>
              )}

              {/* Selected Roles */}
              {selectedRoles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Selected Roles:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoles.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {role}
                        <button
                          type="button"
                          onClick={() => removeRole(role)}
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none focus:bg-green-500 focus:text-white"
                        >
                          <span className="sr-only">Remove {role}</span>
                          <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>


            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsScrapDialogOpen(false);
                  setShowCustomRoleInput(false);
                  setCustomRole('');
                }}
                className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Scrap Data'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contact Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-0">
          <div className="relative">
            {/* Header */}
            <div className="bg-white border-b p-4 sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {selectedCompany?.[0]?.['Company'] || 'Contact Details'}
                </DialogTitle>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="default"
                    size="sm"
                    disabled={isSending}
                    onClick={async () => {
                      const companyName = selectedCompany?.[0]?.['Company'] || 'Unknown Company';
                      console.log('Sending message to company:', companyName);
                      setIsSending(true);

                      try {
                        const response = await fetch('https://n8n.warpdrivetech.in/webhook/Send-Emails', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            name: companyName
                          })
                        });

                        if (!response.ok) {
                          throw new Error(`HTTP error! status: ${response.status}`);
                        }

                        const result = await response.json();
                        console.log('Email sent successfully:', result);

                        // Show success toast
                        toast({
                          title: 'Success',
                          description: `Email sent successfully to ${companyName}`,
                          variant: 'default',
                        });

                        // Refresh the contact details
                        if (selectedCompany?.[0]?.['Company']) {
                          handleCompanyClick(selectedCompany[0]['Company']);
                        }
                      } catch (error) {
                        console.error('Error sending email:', error);
                        toast({
                          title: 'Error',
                          description: `Failed to send email to ${companyName}. Please try again.`,
                          variant: 'destructive',
                        });
                      } finally {
                        setIsSending(false);
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSending ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : 'Send'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Contacts Table */}
            <div className="p-6">
              {isLoadingContacts ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : selectedCompany && selectedCompany.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[180px] font-medium text-gray-700">Name</TableHead>
                        <TableHead className="font-medium text-gray-700">Email</TableHead>
                        <TableHead className="w-[150px] font-medium text-gray-700">Role</TableHead>
                        <TableHead className="font-medium text-gray-700">Phone</TableHead>
                        <TableHead className="font-medium text-gray-700">Status</TableHead>
                        <TableHead className="w-[120px] font-medium text-gray-700">Sent Time</TableHead>
                        <TableHead className="w-[100px] font-medium text-gray-700">Opened</TableHead>
                        <TableHead className="w-[150px] font-medium text-gray-700">Opened At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCompany.map((contact, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            {contact['Name ']?.trim() || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {contact.Email ? (
                              <a
                                href={`mailto:${contact.Email}`}
                                className="text-blue-600 hover:underline"
                              >
                                {contact.Email}
                              </a>
                            ) : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {contact.Role || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {contact.Phone ? (
                              <a
                                href={`tel:${contact.Phone}`}
                                className="hover:underline"
                              >
                                {contact.Phone}
                              </a>
                            ) : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${contact['Send Status'] === 'Sent'
                              ? 'bg-green-100 text-green-800'
                              : contact['Send Status'] === 'Opened'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                              }`}>
                              {contact['Send Status'] || 'N/A'}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {contact['Time'] || 'N/A'}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {contact['Opened'] || 'No'}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {contact['OpenedAt'] || 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-400">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <line x1="19" x2="19" y1="8" y2="14"></line>
                      <line x1="22" x2="16" y1="11" y2="11"></line>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No contacts found</h3>
                  <p className="mt-1 text-gray-500">There are no contacts available for this company.</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LeadCompaniesTable;
