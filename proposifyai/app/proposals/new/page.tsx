"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LinkIcon from '@mui/icons-material/Link';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ComputerIcon from '@mui/icons-material/Computer';
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ProgressIndicator from '@/components/ProgressIndicator';

function NewProposalContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");

  const [step, setStep] = useState(1); // Start at step 1 (Details)
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    email: "",
    clientTRN: "",
    clientTradeLicense: "",
    clientFullAddress: "",
    clientWebsite: "",
    value: "",
    calculateVAT: true, // Default to true for UAE compliance
    documentType: "quotation", // quotation or tax_invoice
    additionalContext: "",
    template: "bettroi", // Always use Bettroi template
    aiGenerate: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generationProgress, setGenerationProgress] = useState({
    current: 0,
    total: 0,
    currentSection: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Create proposal with AI generation
      setLoading(true);
      setError("");

      try {
        // Calculate VAT if enabled
        let subtotal = formData.value ? parseInt(formData.value) : 0;
        let vatAmount = 0;
        let totalWithVAT = subtotal;

        if (formData.calculateVAT && subtotal > 0) {
          const vatResponse = await fetch("/api/compliance/calculate-vat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subtotal: subtotal,
              vatRate: 5,
              currency: "USD",
            }),
          });

          if (vatResponse.ok) {
            const vatData = await vatResponse.json();
            vatAmount = vatData.vatAmount;
            totalWithVAT = vatData.totalWithVAT;
          }
        }

        // Step 1: Create the proposal in Supabase with AML compliance fields
        const proposalResponse = await fetch("/api/proposals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            client_name: formData.client,
            client_email: formData.email,
            client_company: formData.client,
            client_trn: formData.clientTRN,
            client_trade_license: formData.clientTradeLicense,
            client_full_address: formData.clientFullAddress,
            total_value: subtotal,
            subtotal_amount: subtotal,
            vat_amount: vatAmount,
            vat_rate: formData.calculateVAT ? 5 : 0,
            total_with_vat: totalWithVAT,
            currency: "USD",
            document_type: formData.documentType,
            template_id: formData.template,
            metadata: {
              aiGenerated: formData.aiGenerate,
              createdAt: new Date().toISOString(),
              vatCalculated: formData.calculateVAT,
            },
          }),
        });

        if (!proposalResponse.ok) {
          throw new Error("Failed to create proposal");
        }

        const proposalData = await proposalResponse.json();
        const proposalId = proposalData.data.proposal.id;

        // Step 2: If AI generation is enabled, generate ALL sections using Bettroi standards
        if (formData.aiGenerate) {
          const clientContext = {
            name: formData.client,
            company: formData.client,
            industry: "Software Development",
            projectType: formData.title,
            budget: formData.value ? parseInt(formData.value) : undefined,
            additionalInfo: formData.additionalContext || undefined,
            website: formData.clientWebsite || undefined,
          };

          const generatedContent: any = {};

          // Generate sections SEQUENTIALLY to avoid rate limiting
          // Each section takes 10-15 seconds, parallel requests cause failures
          const sections = [
            'executive_summary',
            'scope_of_work',
            'pricing_breakdown',
            'timeline',
            'terms'
          ];

          console.log(`Starting sequential generation of ${sections.length} sections...`);
          setGenerationProgress({ current: 0, total: sections.length, currentSection: "" });

          for (let i = 0; i < sections.length; i++) {
            const sectionType = sections[i];
            const sectionNumber = i + 1;

            setGenerationProgress({
              current: sectionNumber,
              total: sections.length,
              currentSection: sectionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            });

            // Retry logic with exponential backoff
            let retries = 0;
            const maxRetries = 3;
            let success = false;

            while (!success && retries <= maxRetries) {
              try {
                if (retries > 0) {
                  const waitTime = Math.pow(2, retries) * 1000; // 2s, 4s, 8s
                  console.log(`Retry ${retries}/${maxRetries} for ${sectionType} - waiting ${waitTime/1000}s...`);
                  await new Promise(resolve => setTimeout(resolve, waitTime));
                }

                console.log(`[${sectionNumber}/${sections.length}] Generating ${sectionType}...`);

                const response = await fetch("/api/ai/generate-content", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    sectionType,
                    clientContext,
                    tone: "professional",
                    proposalId: proposalId,
                  }),
                });

                if (response.ok) {
                  const data = await response.json();
                  generatedContent[sectionType] = data.data.content;
                  console.log(`✓ [${sectionNumber}/${sections.length}] Generated ${sectionType} (${data.data.content.length} chars)`);
                  success = true;
                } else {
                  const errorData = await response.json();
                  console.error(`✗ [${sectionNumber}/${sections.length}] Failed to generate ${sectionType}:`, response.status, errorData);

                  // Provide more specific error message
                  let errorMsg = errorData.error || errorData.message || 'Unknown error';
                  if (response.status === 429) {
                    errorMsg = 'OpenAI rate limit reached';
                    // Retry on rate limit errors
                    if (retries < maxRetries) {
                      retries++;
                      continue;
                    }
                  } else if (response.status === 401) {
                    errorMsg = 'OpenAI API key is invalid. Please check your configuration.';
                    throw new Error(`${sectionType}: ${errorMsg}`);
                  } else if (response.status === 500) {
                    errorMsg = `Server error: ${errorMsg}`;
                    // Retry on server errors
                    if (retries < maxRetries) {
                      retries++;
                      continue;
                    }
                  }

                  throw new Error(`${sectionType}: ${errorMsg}`);
                }

                // Add a small delay between requests to avoid rate limiting
                if (i < sections.length - 1) {
                  console.log('Waiting 2 seconds before next section...');
                  await new Promise(resolve => setTimeout(resolve, 2000));
                }

              } catch (error) {
                if (retries < maxRetries && (error instanceof Error && (error.message.includes('rate limit') || error.message.includes('Server error')))) {
                  retries++;
                  console.error(`Error on attempt ${retries}:`, error);
                  continue;
                }
                console.error(`✗ Error generating ${sectionType} after ${retries} retries:`, error);
                throw new Error(`Failed to generate ${sectionType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
              }
            }

            if (!success) {
              throw new Error(`Failed to generate ${sectionType} after ${maxRetries} retries`);
            }
          }

          console.log(`✓ All ${sections.length} sections generated successfully!`);

          // Update proposal with all generated content
          if (Object.keys(generatedContent).length > 0) {
            console.log('Saving generated content:', generatedContent);
            const patchResponse = await fetch(`/api/proposals/${proposalId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                content: generatedContent,
              }),
            });

            if (!patchResponse.ok) {
              const errorData = await patchResponse.json();
              console.error('Failed to save generated content:', errorData);
              throw new Error(`Failed to save content: ${errorData.message || errorData.error}`);
            }

            const patchData = await patchResponse.json();
            console.log('Content saved successfully:', patchData);
          } else {
            console.warn('No content was generated!');
            throw new Error('No content was generated. Please check your OpenAI API key and try again.');
          }
        }

        // Redirect to the proposal editor
        console.log('Redirecting to proposal:', proposalId);
        window.location.href = `/proposals/${proposalId}`;
      } catch (err) {
        console.error("Error creating proposal:", err);
        setError(err instanceof Error ? err.message : "Failed to create proposal. Please try again.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Proposify AI</span>
              </Link>
            </div>
            <Link
              href="/proposals"
              className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
            >
              <CloseIcon />
              <span>Cancel</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <ProgressIndicator
            steps={[
              { label: "Details", description: "Client information" },
              { label: "AI Setup", description: "Configure generation" }
            ]}
            currentStep={step}
          />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Proposal Details */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Create New Proposal
              </h2>
              <p className="text-gray-600 mb-4 text-center">
                Tell us about your client and project
              </p>
              <div className="flex items-center justify-center mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-3 flex items-center space-x-3">
                  <LinkIcon className="text-blue-600" sx={{ fontSize: 28 }} />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Using Bettroi Professional Template</p>
                    <p className="text-xs text-blue-700">Industry-standard business proposal format</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposal Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Hospital Management System for City Hospital"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g., City Hospital"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@company.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* AML Compliance Fields */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4">
                    <p className="text-sm font-semibold text-blue-900">🛡️ UAE AML Compliance Information</p>
                    <p className="text-xs text-blue-700 mt-1">Required for all commercial transactions in UAE</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Tax Registration Number (TRN) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.clientTRN}
                        onChange={(e) => setFormData({ ...formData, clientTRN: e.target.value })}
                        placeholder="100123456789012 (15 digits)"
                        maxLength={15}
                        pattern="\d{15}"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                      />
                      <p className="text-xs text-gray-500 mt-1">Must be exactly 15 digits</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Trade License Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.clientTradeLicense}
                        onChange={(e) => setFormData({ ...formData, clientTradeLicense: e.target.value })}
                        placeholder="CN-1234567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Registered Address *
                    </label>
                    <textarea
                      required
                      value={formData.clientFullAddress}
                      onChange={(e) => setFormData({ ...formData, clientFullAddress: e.target.value })}
                      placeholder="Building name, Street, Area, Emirate, UAE"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
                    />
                    <p className="text-xs text-gray-500 mt-1">Complete registered business address in UAE</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Type
                      </label>
                      <select
                        value={formData.documentType}
                        onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="quotation">Quotation</option>
                        <option value="tax_invoice">Tax Invoice</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        VAT Calculation (UAE 5%)
                      </label>
                      <div className="flex items-center h-12 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                        <input
                          type="checkbox"
                          id="calculateVAT"
                          checked={formData.calculateVAT}
                          onChange={(e) => setFormData({ ...formData, calculateVAT: e.target.checked })}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="calculateVAT" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                          Add 5% UAE VAT to total
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    Client Website (Optional)
                    <span className="text-primary-600 text-xs">AI Context Enrichment</span>
                  </label>
                  <input
                    type="url"
                    value={formData.clientWebsite}
                    onChange={(e) => setFormData({ ...formData, clientWebsite: e.target.value })}
                    placeholder="https://clientcompany.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    AI will gather additional context from this website for better proposals
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Project Value (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder="50000"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Additional Context for AI */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Context for AI
                    <span className="text-primary-600 ml-2">✨ AI-Powered</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Provide any extra information to help AI create a better proposal. Include client requirements, special features, industry-specific needs, or project goals.
                  </p>
                  <textarea
                    value={formData.additionalContext}
                    onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
                    placeholder="Example: The client is a 500-bed hospital looking to modernize their patient management system. They need integration with existing lab equipment, HIPAA compliance, mobile app for doctors, and real-time analytics dashboard. Current pain points include long patient wait times and manual record keeping..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <FlashOnIcon sx={{ fontSize: 14 }} className="text-primary-600" />
                    <span className="text-primary-600 font-medium">Pro tip:</span> The more context you provide, the more accurate and personalized your AI-generated proposal will be.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: AI Setup */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                AI-Powered Generation
              </h2>
              <p className="text-gray-600 mb-8 text-center">
                Let AI help you create a personalized proposal
              </p>

              <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                <div className="flex items-start space-x-4 mb-6">
                  <input
                    type="checkbox"
                    id="aiGenerate"
                    checked={formData.aiGenerate}
                    onChange={(e) => setFormData({ ...formData, aiGenerate: e.target.checked })}
                    className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                  />
                  <div className="flex-1">
                    <label htmlFor="aiGenerate" className="font-semibold text-gray-900 cursor-pointer block">
                      Use AI to generate proposal content
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      AI will research {formData.client} and create personalized content based on your template
                    </p>
                  </div>
                </div>

                {formData.aiGenerate && (
                  <div className="bg-primary-50 rounded-lg p-6 space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <FlashOnIcon className="text-primary-600 mr-2" />
                      AI will:
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <CheckCircleIcon className="text-green-600 mr-2 flex-shrink-0" sx={{ fontSize: 20 }} />
                        Research {formData.client || "the company"} (website, news, industry)
                      </li>
                      <li className="flex items-start">
                        <CheckCircleIcon className="text-green-600 mr-2 flex-shrink-0" sx={{ fontSize: 20 }} />
                        Identify pain points and challenges
                      </li>
                      <li className="flex items-start">
                        <CheckCircleIcon className="text-green-600 mr-2 flex-shrink-0" sx={{ fontSize: 20 }} />
                        Generate customized executive summary
                      </li>
                      <li className="flex items-start">
                        <CheckCircleIcon className="text-green-600 mr-2 flex-shrink-0" sx={{ fontSize: 20 }} />
                        Suggest relevant case studies
                      </li>
                      <li className="flex items-start">
                        <CheckCircleIcon className="text-green-600 mr-2 flex-shrink-0" sx={{ fontSize: 20 }} />
                        Recommend optimal pricing
                      </li>
                    </ul>
                    <p className="text-xs text-gray-600 italic flex items-center gap-1">
                      <AccessTimeIcon sx={{ fontSize: 16 }} />
                      This will take approximately 30-60 seconds
                    </p>
                  </div>
                )}
              </div>

              {loading && generationProgress.total > 0 && (
                <div className="mt-6 p-6 bg-primary-50 border border-primary-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <FlashOnIcon className="text-primary-600 mr-2 animate-pulse" />
                      Generating AI Content
                    </h4>
                    <span className="text-sm font-medium text-primary-700">
                      {generationProgress.current} of {generationProgress.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                    <div
                      className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Currently generating: <span className="font-semibold text-primary-700">{generationProgress.currentSection}</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-2 italic">
                    Each section takes 10-15 seconds. Please don&apos;t close this page...
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {formData.aiGenerate ? "Generating with AI..." : "Creating..."}
                    </>
                  ) : formData.aiGenerate ? (
                    <>
                      <FlashOnIcon className="mr-2" />
                      Generate with AI (Bettroi Professional)
                    </>
                  ) : (
                    "Create Proposal"
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default function NewProposalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>}>
      <NewProposalContent />
    </Suspense>
  );
}
