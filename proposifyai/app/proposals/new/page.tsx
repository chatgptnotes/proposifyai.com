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

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    email: "",
    clientWebsite: "",
    value: "",
    additionalContext: "",
    template: templateId || "",
    aiGenerate: false,
  });

  const templates = [
    { id: "1", name: "DRM Hope Software Proposal", IconComponent: LocalHospitalIcon },
    { id: "2", name: "Bettroi Integration Proposal", IconComponent: LinkIcon },
    { id: "3", name: "Hospital Management System", IconComponent: ApartmentIcon },
    { id: "4", name: "SaaS Subscription Proposal", IconComponent: BusinessCenterIcon },
    { id: "5", name: "Custom Development Quote", IconComponent: ComputerIcon },
    { id: "6", name: "Blank Template", IconComponent: DescriptionIcon },
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Create proposal with AI generation
      setLoading(true);
      setError("");

      try {
        // Step 1: Create the proposal in Supabase
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
            total_value: formData.value ? parseInt(formData.value) : 0,
            currency: "USD",
            template_id: formData.template,
            metadata: {
              aiGenerated: formData.aiGenerate,
              createdAt: new Date().toISOString(),
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

          // Generate all sections in parallel for better performance
          const sections = [
            'executive_summary',
            'scope_of_work',
            'pricing_breakdown',
            'timeline',
            'terms'
          ];

          const generatePromises = sections.map(async (sectionType) => {
            try {
              const response = await fetch("/api/ai/generate-content", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  sectionType,
                  clientContext,
                  tone: "professional",
                }),
              });

              if (response.ok) {
                const data = await response.json();
                generatedContent[sectionType] = data.data.content;
              }
            } catch (error) {
              console.error(`Failed to generate ${sectionType}:`, error);
            }
          });

          // Wait for all sections to be generated
          await Promise.all(generatePromises);

          // Update proposal with all generated content
          if (Object.keys(generatedContent).length > 0) {
            await fetch(`/api/proposals/${proposalId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                content: generatedContent,
              }),
            });
          }
        }

        // Redirect to the proposal editor
        window.location.href = `/proposals/${proposalId}`;
      } catch (err) {
        console.error("Error creating proposal:", err);
        setError("Failed to create proposal. Please try again.");
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
              { label: "Template", description: "Choose your starting point" },
              { label: "Details", description: "Client information" },
              { label: "AI Setup", description: "Configure generation" }
            ]}
            currentStep={step}
          />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Choose Template */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Choose a Template
              </h2>
              <p className="text-gray-600 mb-8 text-center">
                Select a template to get started or start from scratch
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, template: template.id })}
                    className={`p-6 rounded-xl border-2 transition text-left ${
                      formData.template === template.id
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-200 bg-white hover:border-primary-300"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <template.IconComponent className="text-primary-600" sx={{ fontSize: 40 }} />
                      <div>
                        <h3 className="font-bold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600">Professional template ready to use</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formData.template}
                  className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Proposal Details */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Proposal Details
              </h2>
              <p className="text-gray-600 mb-8 text-center">
                Tell us about your client and project
              </p>

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

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: AI Setup */}
          {step === 3 && (
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

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
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
