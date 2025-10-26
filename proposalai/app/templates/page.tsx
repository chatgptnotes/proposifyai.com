"use client";

import Link from "next/link";
import { useState } from "react";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LinkIcon from '@mui/icons-material/Link';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ComputerIcon from '@mui/icons-material/Computer';
import BuildIcon from '@mui/icons-material/Build';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function TemplatesPage() {
  // Your actual templates from DRM Hope
  const templates = [
    {
      id: 1,
      name: "DRM Hope Software Proposal",
      description: "Complete software development proposal template for DRM Hope platform",
      category: "Software Development",
      icon: LocalHospitalIcon,
      usageCount: 15,
      lastUsed: "2 days ago",
      sections: ["Executive Summary", "Scope of Work", "Timeline", "Pricing", "Terms"],
    },
    {
      id: 2,
      name: "Bettroi Integration Proposal",
      description: "Template for Bettroi system integration and implementation proposals",
      category: "System Integration",
      icon: LinkIcon,
      usageCount: 8,
      lastUsed: "1 week ago",
      sections: ["Overview", "Technical Requirements", "Implementation Plan", "Pricing", "Support"],
    },
    {
      id: 3,
      name: "Hospital Management System",
      description: "Comprehensive HMS proposal with all features and modules",
      category: "Healthcare IT",
      icon: ApartmentIcon,
      usageCount: 12,
      lastUsed: "3 days ago",
      sections: ["Solution Overview", "Features", "Implementation", "Training", "Pricing"],
    },
    {
      id: 4,
      name: "SaaS Subscription Proposal",
      description: "Monthly/annual subscription model for software services",
      category: "SaaS",
      icon: BusinessCenterIcon,
      usageCount: 20,
      lastUsed: "1 day ago",
      sections: ["Product Overview", "Pricing Tiers", "Features Comparison", "Terms", "Support"],
    },
    {
      id: 5,
      name: "Custom Development Quote",
      description: "Hourly/fixed-price development work quotation template",
      category: "Development",
      icon: ComputerIcon,
      usageCount: 25,
      lastUsed: "Today",
      sections: ["Requirements", "Scope", "Timeline", "Resources", "Pricing", "Payment Terms"],
    },
    {
      id: 6,
      name: "Maintenance & Support Contract",
      description: "Ongoing maintenance and support services agreement",
      category: "Support",
      icon: BuildIcon,
      usageCount: 10,
      lastUsed: "5 days ago",
      sections: ["Service Overview", "SLA", "Response Times", "Pricing", "Terms"],
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Software Development", "System Integration", "Healthcare IT", "SaaS", "Development", "Support"];

  const filteredTemplates =
    selectedCategory === "all"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

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
              <div className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link href="/proposals" className="text-gray-600 hover:text-gray-900">
                  Proposals
                </Link>
                <Link href="/templates" className="text-primary-600 font-medium">
                  Templates
                </Link>
                <Link href="/settings" className="text-gray-600 hover:text-gray-900">
                  Settings
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                <NotificationsIcon />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">JD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proposal Templates</h1>
            <p className="text-gray-600 mt-2">
              Your saved templates including DRM Hope, Bettroi, and more
            </p>
          </div>
          <button className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-md">
            <AddIcon className="mr-2" />
            Create Template
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-3 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                selectedCategory === category
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {category === "all" ? "All Templates" : category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition overflow-hidden group"
            >
              {/* Template Preview */}
              <div className="bg-gradient-to-br from-primary-50 to-purple-50 p-8 flex items-center justify-center border-b border-gray-100">
                {/* Dynamically render the icon component */}
                {(() => {
                  const IconComponent = template.icon;
                  return <IconComponent className="text-primary-600" sx={{ fontSize: 80 }} />;
                })()}
              </div>

              {/* Template Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 flex-1">{template.name}</h3>
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                    {template.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>

                {/* Sections */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Sections:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.sections.slice(0, 3).map((section, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {section}
                      </span>
                    ))}
                    {template.sections.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        +{template.sections.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Used {template.usageCount} times</span>
                  <span>Last: {template.lastUsed}</span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/proposals/new?template=${template.id}`}
                    className="px-4 py-2 bg-primary-600 text-white text-center font-semibold rounded-lg hover:bg-primary-700 transition text-sm"
                  >
                    Use Template
                  </Link>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-sm">
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Template Section */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Import Your Existing Templates</h3>
              <p className="text-primary-100">
                Upload your DRM Hope, Bettroi, or any other Word/PDF templates and convert them into smart templates
              </p>
            </div>
            <button className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-md">
              Upload Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
