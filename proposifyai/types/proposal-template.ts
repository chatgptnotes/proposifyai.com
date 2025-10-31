// Professional Proposal Template Types

export interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  created: string;
  brand: BrandColors;
  sections: TemplateSection[];
  sampleData: SampleData;
  features: string[];
}

export interface BrandColors {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface TemplateSection {
  id: string;
  name: string;
  required: boolean;
  fields?: string[];
  subsections?: SubSection[];
  gridLayout?: boolean;
  table?: boolean;
  orderedList?: boolean;
  items?: KeyFeatureItem[];
}

export interface SubSection {
  name: string;
  repeatable: boolean;
  fields: string[];
}

export interface KeyFeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface SampleData {
  companyName: string;
  tagline: string;
  quotationNumber: string;
  validityDays: number;
  paymentTerms: string;
  supportPeriod: string;
  revisions: string;
}

// Proposal Data Structure
export interface ProposalData {
  // Header
  header: HeaderData;

  // Client Details
  clientDetails: ClientDetailsData;

  // Executive Summary
  executiveSummary: ExecutiveSummaryData;

  // Scope of Work
  scopeOfWork: ScopeOfWorkData;

  // Key Features
  keyFeatures: KeyFeatureItem[];

  // Pricing
  pricing: PricingData;

  // Exclusions
  exclusions: ExclusionsData;

  // Optional Add-ons
  optionalAddons: AddonItem[];

  // Timeline
  timeline: TimelinePhase[];

  // Terms
  terms: string[];

  // Footer
  footer: FooterData;
}

export interface HeaderData {
  companyLogo: string;
  companyName: string;
  tagline: string;
  quotationNumber: string;
  date: string;
  validUntil: string;
}

export interface ClientDetailsData {
  clientLogo: string;
  clientName: string;
  clientDescription: string;
  clientLocation: string;
  clientEmail: string;
}

export interface ExecutiveSummaryData {
  projectTitle: string;
  projectDescription: string;
}

export interface ScopeOfWorkData {
  platforms: PlatformSection[];
}

export interface PlatformSection {
  platformName: string;
  features: string[];
}

export interface PricingData {
  items: PricingItem[];
  currency: string;
  total: number;
}

export interface PricingItem {
  deliverable: string;
  description: string;
  amount: number;
}

export interface ExclusionsData {
  exclusionsList: string[];
  importantNote: string;
}

export interface AddonItem {
  service: string;
  description: string[];
  pricing: {
    setup?: number;
    monthly?: number;
    annual?: number;
    quarterly?: number;
  };
}

export interface TimelinePhase {
  phase: string;
  deliverables: string;
  duration: string;
}

export interface FooterData {
  companyAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  contactDetails: {
    mobile: string;
    email: string;
    website: string;
  };
  taglineFooter: string;
}

// Sample Bettroi Project Data
export const bettroiProposalSample: ProposalData = {
  header: {
    companyLogo: "/templates/bettroi-professional/assets/drmhope-logo.svg",
    companyName: "DRMHOPE SOFTWARE",
    tagline: "Accelerating Digital Innovation",
    quotationNumber: "DRM-2025-Q-1023",
    date: "October 23, 2025",
    validUntil: "November 23, 2025"
  },
  clientDetails: {
    clientLogo: "/templates/bettroi-professional/assets/bettroi-logo.svg",
    clientName: "BETTROI",
    clientDescription: "Digital Solutions Provider",
    clientLocation: "Dubai, United Arab Emirates",
    clientEmail: "info@bettroi.com"
  },
  executiveSummary: {
    projectTitle: "Headz - AI-Powered Virtual Hairstyling Platform",
    projectDescription: "Development of a comprehensive AI-powered virtual hairstyling platform featuring web and mobile applications. The solution leverages advanced AI technology to provide real-time hairstyle transformations, enabling users to visualize different hairstyles before making real-world changes."
  },
  scopeOfWork: {
    platforms: [
      {
        platformName: "Web Application Development",
        features: [
          "Responsive web platform with modern UI/UX design",
          "AI API integration framework for hairstyle transformation (API costs by client)",
          "Virtual mirror with real-time preview capabilities",
          "Custom AI style generator interface with text prompts",
          "360-degree view generation functionality",
          "User authentication and profile management",
          "Gallery and history management system",
          "Admin dashboard for user management",
          "Cloud backend services integration framework",
          "Image processing and watermarking system"
        ]
      },
      {
        platformName: "iOS Application Development",
        features: [
          "Native iOS app with Swift/React Native",
          "Camera integration for direct photo capture",
          "Offline mode for saved styles",
          "Push notifications for new styles and updates",
          "Biometric authentication (Face ID/Touch ID)",
          "Social sharing capabilities",
          "In-app gallery and favorites management",
          "Performance optimization for all iPhone models",
          "iOS design guidelines compliance"
        ]
      },
      {
        platformName: "Android Application Development",
        features: [
          "Native Android app with Kotlin/React Native",
          "Material Design 3 implementation",
          "Camera and gallery integration",
          "Google Sign-In integration",
          "Offline functionality and caching",
          "Push notification support via FCM",
          "Device compatibility (Android 7.0+)",
          "Tablet optimization and responsive layouts",
          "Performance monitoring and crash reporting"
        ]
      }
    ]
  },
  keyFeatures: [
    {
      icon: "palette",
      title: "15+ Pre-set Hairstyles",
      description: "Curated collection of popular hairstyles"
    },
    {
      icon: "smart_toy",
      title: "AI Style Generator",
      description: "Custom styles from text descriptions"
    },
    {
      icon: "360",
      title: "360° View",
      description: "Complete rotation view of hairstyles"
    },
    {
      icon: "phone_iphone",
      title: "Cross-Platform Sync",
      description: "Seamless experience across devices"
    },
    {
      icon: "person",
      title: "User Management",
      description: "Secure authentication and profiles"
    },
    {
      icon: "dashboard",
      title: "Admin Dashboard",
      description: "Complete control and analytics"
    }
  ],
  pricing: {
    currency: "AED",
    items: [
      {
        deliverable: "Web Application",
        description: "Complete responsive web platform with all features",
        amount: 5000
      },
      {
        deliverable: "iOS Application",
        description: "Native iOS app with full feature parity",
        amount: 4000
      },
      {
        deliverable: "Android Application",
        description: "Native Android app with Material Design",
        amount: 4000
      }
    ],
    total: 13000
  },
  exclusions: {
    exclusionsList: [
      "AI Model API Costs: All AI model API subscriptions, usage fees, and related costs to be borne directly by client",
      "Third-party API Integrations: Costs for any third-party services including but not limited to AI APIs, cloud services, and database hosting",
      "Server deployment and hosting setup",
      "Apple App Store account creation and setup",
      "Google Play Store onboarding and publishing",
      "SSL certificates and domain registration",
      "Ongoing maintenance and support",
      "Marketing and promotional materials"
    ],
    importantNote: "This quotation covers the design and development of the application functionality only. The client will be responsible for procuring and managing their own AI API subscriptions and bearing all associated costs. We will integrate the client's AI API credentials into the application."
  },
  optionalAddons: [
    {
      service: "Cloud Hosting",
      description: [
        "Premium cloud infrastructure (AWS/Azure/Google Cloud)",
        "99.9% uptime SLA guarantee",
        "Auto-scaling capabilities for traffic spikes",
        "Daily automated backups with 30-day retention",
        "SSL certificate and CDN integration",
        "DDoS protection and firewall",
        "Monthly bandwidth: 1TB included",
        "Storage: 100GB SSD included"
      ],
      pricing: {
        setup: 2000,
        monthly: 500
      }
    },
    {
      service: "Annual Maintenance Contract (AMC)",
      description: [
        "24/7 technical support via email and phone",
        "Monthly security updates and patches",
        "Bug fixes and minor enhancements",
        "Performance monitoring and optimization",
        "Database maintenance and optimization",
        "Quarterly health check reports",
        "Priority support with 4-hour response time",
        "Up to 20 hours of development work for minor changes"
      ],
      pricing: {
        annual: 6000,
        quarterly: 1800
      }
    },
    {
      service: "Premium Support Package",
      description: [
        "Dedicated account manager",
        "2-hour SLA response time",
        "Weekly performance reports",
        "Unlimited minor updates",
        "Training sessions for your team"
      ],
      pricing: {
        monthly: 1500
      }
    }
  ],
  timeline: [
    {
      phase: "Phase 1",
      deliverables: "Client Requirements Gathering & Customization Analysis",
      duration: "2 Days"
    },
    {
      phase: "Phase 2",
      deliverables: "Web Application Customization & Branding",
      duration: "3 Days"
    },
    {
      phase: "Phase 3",
      deliverables: "iOS Application Adaptation & Configuration",
      duration: "3 Days"
    },
    {
      phase: "Phase 4",
      deliverables: "Android Application Adaptation & Configuration",
      duration: "3 Days"
    },
    {
      phase: "Phase 5",
      deliverables: "Integration Testing, QA & Final Delivery",
      duration: "3 Days"
    }
  ],
  terms: [
    "Payment Terms: 40% advance, 30% on milestone completion, 30% on final delivery",
    "Validity: This quotation is valid for 30 days from the date of issue",
    "Revisions: Up to 3 rounds of revisions included in each phase",
    "Support: 3 months of bug fixing support post-launch included",
    "Intellectual Property: Full source code and IP rights transferred upon final payment",
    "Confidentiality: All project details will be kept strictly confidential",
    "Change Requests: Additional features beyond scope will be quoted separately",
    "Testing: Client to provide testing feedback within 5 business days"
  ],
  footer: {
    companyAddress: {
      street: "2 Teka Naka, Kampti Road",
      city: "Nagpur",
      state: "Maharashtra",
      country: "India"
    },
    contactDetails: {
      mobile: "+91 937-3111-709",
      email: "murali@drmhope.com",
      website: "www.drmhope.com"
    },
    taglineFooter: "Accelerating Your Digital Transformation Journey"
  }
};
