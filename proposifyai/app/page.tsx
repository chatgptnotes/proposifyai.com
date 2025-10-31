"use client";

import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import BarChartIcon from '@mui/icons-material/BarChart';
import PaletteIcon from '@mui/icons-material/Palette';
import ChatIcon from '@mui/icons-material/Chat';
import WorkflowIcon from '@mui/icons-material/AccountTree';
import ShieldIcon from '@mui/icons-material/Shield';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SearchIcon from '@mui/icons-material/Search';
import GroupsIcon from '@mui/icons-material/Groups';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="border-b border-white/20 bg-white/70 backdrop-blur-xl fixed w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Proposify AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Features</a>
              <a href="#ai-capabilities" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">AI Capabilities</a>
              <a href="#pricing" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Pricing</a>
              <a href="/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Login</a>
              <button onClick={() => window.location.href='/signup'} className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold">
                Start Free Trial
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-3">
              <a href="#features" className="block text-gray-700 hover:text-primary-600 py-2">Features</a>
              <a href="#pricing" className="block text-gray-700 hover:text-primary-600 py-2">Pricing</a>
              <a href="/routes" className="block text-gray-700 hover:text-primary-600 py-2">All Pages</a>
              <a href="/login" className="block text-gray-700 hover:text-primary-600 py-2">Login</a>
              <button
                onClick={() => window.location.href='/signup'}
                className="w-full bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary-200 shadow-lg mb-8">
            <AutoAwesomeIcon className="text-primary-600 text-sm" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
              Next-Generation AI Proposal Platform
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Close Deals Faster with
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              AI-Powered Proposals
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
            Transform <span className="font-semibold text-gray-900">8 hours</span> of proposal work into <span className="font-semibold text-primary-600">5 minutes</span>.
            Let AI handle the research, writing, pricing, and design while you focus on closing deals.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-8">
            <button
              onClick={() => window.location.href='/signup'}
              className="group relative bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <AutoAwesomeIcon className="text-sm group-hover:rotate-12 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <button
              onClick={() => window.location.href='/login'}
              className="border-2 border-gray-300 bg-white/50 backdrop-blur-sm text-gray-700 px-10 py-5 rounded-2xl text-lg font-bold hover:border-primary-600 hover:text-primary-600 hover:bg-white transition-all duration-300 hover:shadow-xl"
            >
              Login to Dashboard
            </button>
          </div>

          <p className="text-sm text-gray-500 mb-10">
            ✨ No credit card required • 🚀 14-day free trial • ⚡ 95% time savings
          </p>

          {/* Powered by Bettroi Badge - Enhanced */}
          <div className="mt-12 flex items-center justify-center gap-3 animate-fade-in">
            <span className="text-gray-500 text-sm font-medium">Powered by</span>
            <div className="flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">BB</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">BETTROI</span>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>1000+ Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>50K+ Proposals Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>4.9/5 Customer Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/60 backdrop-blur-sm border-y border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group hover:scale-110 transition-transform">
              <div className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">156K+</div>
              <div className="text-gray-600 mt-3 font-medium">Proposals Created</div>
            </div>
            <div className="group hover:scale-110 transition-transform">
              <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">$2.3B+</div>
              <div className="text-gray-600 mt-3 font-medium">Deal Value</div>
            </div>
            <div className="group hover:scale-110 transition-transform">
              <div className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">4.9/5</div>
              <div className="text-gray-600 mt-3 font-medium">Customer Rating</div>
            </div>
            <div className="group hover:scale-110 transition-transform">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">95%</div>
              <div className="text-gray-600 mt-3 font-medium">Time Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Capabilities Section - Comprehensive */}
      <section id="ai-capabilities" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-6">
              <SmartToyIcon className="text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">Powered by Advanced AI</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                12 AI-Powered Capabilities
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Next-generation artificial intelligence that transforms how you create, manage, and close deals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. AI Content Generation */}
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-indigo-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                <AutoAwesomeIcon className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Content Generation</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Generate custom proposal sections in seconds. Adapt tone from technical to executive. Multi-language support with industry-specific terminology.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1">✓</span>
                  <span>Smart proposal writing based on client profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1">✓</span>
                  <span>Dynamic tone adjustment (formal/casual/technical)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1">✓</span>
                  <span>50+ language translation with context</span>
                </li>
              </ul>
            </div>

            {/* 2. Intelligent Pricing */}
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                <TrendingUpIcon className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Intelligent Pricing</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                AI recommends optimal pricing based on deal size, industry, and historical win rates. Win probability scoring included.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Dynamic pricing optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Discount impact analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Package bundling recommendations</span>
                </li>
              </ul>
            </div>

            {/* 3. Smart Research Agent */}
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                <SearchIcon className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Research Agent</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Auto-research prospects: company info, news, pain points, and competitors. Save hours of manual research.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Automated company intelligence gathering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Stakeholder mapping from LinkedIn</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Competitive analysis & positioning</span>
                </li>
              </ul>
            </div>

            {/* 4. Voice AI Integration */}
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                <RecordVoiceOverIcon className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Voice AI Integration</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Record client calls and auto-generate proposals. Integrates with Gong, Fireflies, and Zoom for seamless workflow.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span>Voice-to-proposal transcription</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span>Meeting summary extraction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span>AI-narrated proposal presentations</span>
                </li>
              </ul>
            </div>

            {/* 5. Analytics & Coaching */}
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                <BarChartIcon className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Analytics & Coaching</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                AI identifies patterns in won vs lost deals. Get personalized coaching tips for each sales rep based on performance.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">✓</span>
                  <span>Win/loss pattern analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">✓</span>
                  <span>Follow-up timing recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">✓</span>
                  <span>Rep performance coaching</span>
                </li>
              </ul>
            </div>

            {/* 6. Visual Design Intelligence */}
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-pink-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                <PaletteIcon className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Visual Design Intelligence</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                AI generates layouts based on brand guidelines. Auto-select relevant images, infographics, and ensure brand consistency.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 mt-1">✓</span>
                  <span>Auto-design proposals from brand assets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 mt-1">✓</span>
                  <span>Image & graphic recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 mt-1">✓</span>
                  <span>Brand consistency checker</span>
                </li>
              </ul>
            </div>

            {/* 7. Conversational AI */}
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                <ChatIcon className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Conversational AI Assistant</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Natural language interface: &quot;Create a healthcare SaaS proposal with 3 tiers&quot; - AI handles the rest.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">✓</span>
                  <span>In-platform chatbot for commands</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">✓</span>
                  <span>Natural language editing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">✓</span>
                  <span>Real-time Q&A for clients</span>
                </li>
              </ul>
            </div>

            {/* 8. Smart Workflows */}
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-teal-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-green-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                <WorkflowIcon className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Workflow Automation</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                AI determines approval routing based on deal size. Predictive follow-ups and auto-CRM updates included.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">✓</span>
                  <span>Intelligent approval routing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">✓</span>
                  <span>Automated CRM synchronization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">✓</span>
                  <span>Pipeline forecasting</span>
                </li>
              </ul>
            </div>

            {/* 9. Client Interaction AI */}
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-yellow-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                <GroupsIcon className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Client Interaction AI</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Embedded AI assistant answers client questions 24/7. Auto-generate FAQs and interactive ROI calculators.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">✓</span>
                  <span>24/7 client Q&A chatbot</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">✓</span>
                  <span>Auto-generated FAQ sections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">✓</span>
                  <span>AI-powered ROI calculators</span>
                </li>
              </ul>
            </div>

            {/* 10. Compliance & Risk */}
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                <ShieldIcon className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Compliance & Risk Management</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                AI recommends legal clauses based on industry/region. Ensure GDPR, HIPAA compliance automatically.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✓</span>
                  <span>Legal clause suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✓</span>
                  <span>Risk flagging & alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✓</span>
                  <span>Automated compliance checking</span>
                </li>
              </ul>
            </div>

            {/* 11. Predictive Intelligence */}
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-cyan-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                <PsychologyIcon className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Predictive Deal Intelligence</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Predict optimal send times, deal health scoring, and competitor alerts based on prospect behavior patterns.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 mt-1">✓</span>
                  <span>Optimal send time prediction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 mt-1">✓</span>
                  <span>Real-time deal health scoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 mt-1">✓</span>
                  <span>Budget detection & competitor tracking</span>
                </li>
              </ul>
            </div>

            {/* 12. Agentic AI */}
            <div className="group bg-gradient-to-br from-primary-600 to-purple-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-primary-400 hover:-translate-y-2">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                <SmartToyIcon className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Agentic AI Workflows</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Multi-agent orchestration: Research → Writing → Design → Pricing → Follow-up. Fully autonomous proposal creation.
              </p>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300 mt-1">✓</span>
                  <span>5 specialized AI agents working together</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300 mt-1">✓</span>
                  <span>CRM opportunity → Full proposal automation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300 mt-1">✓</span>
                  <span>Minimal human input required</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              AI That Actually Understands Sales
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed to help you win more deals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Writing Assistant</h3>
              <p className="text-gray-600">
                Generate custom proposal sections in seconds. Adapt tone from technical to executive. Multi-language support included.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Voice-to-Proposal</h3>
              <p className="text-gray-600">
                Record client calls and auto-generate proposals. Integrates with Gong, Fireflies, and Zoom.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Intelligent Pricing</h3>
              <p className="text-gray-600">
                AI recommends optimal pricing based on deal size, industry, and historical win rates. Win probability scoring included.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Research Agent</h3>
              <p className="text-gray-600">
                Auto-research prospects: company info, news, pain points, and competitors. Save hours of manual research.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Analytics</h3>
              <p className="text-gray-600">
                See when proposals are opened, time per section, and get AI-suggested follow-up times.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">CRM Integration</h3>
              <p className="text-gray-600">
                Seamlessly sync with HubSpot, Salesforce, Pipedrive. Auto-populate client data and update deal stages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Plans That Grow With Your Team
            </h2>
            <p className="text-xl text-gray-600">
              Choose the perfect plan for your business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$49</span>
                <span className="text-gray-600">/user/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  20 AI proposals/month
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  E-signature included
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  1 CRM integration
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Email tracking
                </li>
              </ul>
              <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 transition font-semibold">
                Start Free Trial
              </button>
            </div>

            {/* Professional Plan */}
            <div className="bg-primary-600 p-8 rounded-xl shadow-xl border-4 border-primary-500 relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$99</span>
                <span className="text-primary-100">/user/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Unlimited AI proposals
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Voice-to-proposal
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  AI Research Agent
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  All CRM integrations
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Priority support
                </li>
              </ul>
              <button className="w-full bg-white text-primary-600 py-3 rounded-lg hover:bg-gray-50 transition font-semibold">
                Start Free Trial
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Everything in Professional
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Custom AI training
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Voice cloning
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Dedicated success manager
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  SSO & advanced security
                </li>
              </ul>
              <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 transition font-semibold">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Close More Deals?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join 5,000+ sales teams using AI to win more business
          </p>
          <button className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-lg">
            Start Free Trial
          </button>
          <p className="text-primary-100 mt-4 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-2xl font-bold text-white">Proposify AI</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Next-generation AI-powered proposal platform that transforms how businesses win deals.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-white text-sm">𝕏</span>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-white text-sm">in</span>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-white text-sm">YT</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> Features
                </a></li>
                <li><a href="#ai-capabilities" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> AI Capabilities
                </a></li>
                <li><a href="#pricing" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> Pricing
                </a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> Integrations
                </a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> API Documentation
                </a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> About Us
                </a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> Blog & Resources
                </a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> Careers
                </a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> Contact Support
                </a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> Press Kit
                </a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Legal & Trust</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> Privacy Policy
                </a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> Terms of Service
                </a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> Security & Compliance
                </a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500">→</span> GDPR Compliance
                </a></li>
              </ul>
            </div>
          </div>

          {/* Powered by Bettroi Section - Premium Design */}
          <div className="border-t border-gray-700/50 mt-12 pt-10">
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 mb-8">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-4 font-medium">Proudly Powered by</p>
                <div className="flex items-center justify-center gap-3 mb-4 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-2xl">BB</span>
                  </div>
                  <span className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">
                    BETTROI
                  </span>
                </div>
                <p className="text-gray-400 text-base mb-2">Digital Solutions Provider</p>
                <p className="text-primary-400 text-sm font-medium">📍 Dubai, UAE</p>
                <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Innovation Partner
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    Technology Excellence
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                    Global Reach
                  </span>
                </div>
              </div>
            </div>

            {/* Copyright & Attribution */}
            <div className="text-center text-sm text-gray-400 border-t border-gray-800/50 pt-8">
              <p className="mb-2">
                © 2025 <span className="text-white font-semibold">Proposify AI</span> (proposifyai.com). All rights reserved.
              </p>
              <p className="text-gray-500">
                A Product of <span className="text-primary-400 font-semibold">Bettroi</span> in strategic partnership with <span className="text-indigo-400 font-semibold">DRMHOPE Software</span>
              </p>
              <p className="text-gray-600 text-xs mt-3">
                Built with ❤️ using Next.js, TypeScript, AI & Modern Technologies
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
