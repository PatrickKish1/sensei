'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Brain, 
  FileText, 
  Video, 
  Mic, 
  Image,
  MessageSquare,
  Users,
  Shield,
  BarChart3,
  Settings,
  Globe,
  Cpu,
  Network,
  Lock
} from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="container-max">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center mr-3">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <Link href="/" className="text-xl font-semibold text-slate-900">
                Digital Sensei
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="btn btn-primary"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center max-w-4xl mx-auto">
            <Link 
              href="/"
              className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8 transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            
            <h1 className="heading-xl mb-6">
              Platform Features
            </h1>
            <p className="text-body max-w-3xl mx-auto">
              Discover the enterprise-grade capabilities that make Digital Sensei 
              the premier platform for creating intelligent AI agents
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="section-padding bg-slate-50">
        <div className="container-max">
          <div className="text-center mb-20">
            <h2 className="heading-lg mb-6">
              Core Features
            </h2>
            <p className="text-body max-w-3xl mx-auto">
              Everything you need to create, train, and deploy professional AI agents
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-premium">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="heading-md mb-4">AI Agent Creation</h3>
              <p className="text-body-sm">
                Create personalized AI agents with custom personalities, expertise areas, 
                and system messages tailored to your business domain.
              </p>
            </div>
            
            <div className="card-premium">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="heading-md mb-4">Multi-Format Training</h3>
              <p className="text-body-sm">
                Upload and process various content types including documents, videos, 
                audio recordings, and images to build comprehensive knowledge bases.
              </p>
            </div>
            
            <div className="card-premium">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="heading-md mb-4">Intelligent Chat</h3>
              <p className="text-body-sm">
                Engage in natural conversations with your AI agents through an intuitive 
                chat interface that learns and improves with every interaction.
              </p>
            </div>
            
            <div className="card-premium">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="heading-md mb-4">Knowledge Sharing</h3>
              <p className="text-body-sm">
                Make your AI agents available to others, enabling global access to 
                your expertise and knowledge 24/7.
              </p>
            </div>
            
            <div className="card-premium">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="heading-md mb-4">Analytics & Insights</h3>
              <p className="text-body-sm">
                Track your AI agents' performance, usage patterns, and knowledge 
                gaps to continuously improve their effectiveness.
              </p>
            </div>
            
            <div className="card-premium">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h3 className="heading-md mb-4">Advanced Configuration</h3>
              <p className="text-body-sm">
                Fine-tune your AI agents with advanced settings including memory modes, 
                response styles, and privacy controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Processing Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-20">
            <h2 className="heading-lg mb-6">Content Processing</h2>
            <p className="text-body max-w-3xl mx-auto">
              Our platform handles diverse content types with advanced AI processing
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="heading-md mb-4">Documents</h3>
              <p className="text-body-sm">
                PDFs, Word docs, text files with intelligent text extraction and processing
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h3 className="heading-md mb-4">Videos</h3>
              <p className="text-body-sm">
                Video content processing with speech-to-text and visual analysis
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Mic className="h-8 w-8 text-white" />
              </div>
              <h3 className="heading-md mb-4">Audio</h3>
              <p className="text-body-sm">
                Audio recordings with high-quality transcription and analysis
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Image className="h-8 w-8 text-white" />
              </div>
              <h3 className="heading-md mb-4">Images</h3>
              <p className="text-body-sm">
                Image content with OCR and visual understanding capabilities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Progressive Learning Section */}
      <section className="section-padding bg-slate-50">
        <div className="container-max">
          <div className="text-center mb-20">
            <h2 className="heading-lg mb-6">Progressive Learning</h2>
            <p className="text-body max-w-3xl mx-auto">
              Start small and build your AI agent's knowledge progressively
            </p>
          </div>
          
          <div className="space-y-12">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-slate-900 text-white rounded-lg flex items-center justify-center text-2xl font-bold mr-6">
                1
              </div>
              <div>
                <h3 className="heading-md mb-4">Minimal Requirements</h3>
                <p className="text-body">
                  Start with basic information about your expertise area. No need to upload 
                  everything at once - begin with what you have available.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-slate-900 text-white rounded-lg flex items-center justify-center text-2xl font-bold mr-6">
                2
              </div>
              <div>
                <h3 className="heading-md mb-4">Initial Persona</h3>
                <p className="text-body">
                  Our system generates an initial AI persona based on your basic information, 
                  creating a foundation that can immediately start helping users.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-slate-900 text-white rounded-lg flex items-center justify-center text-2xl font-bold mr-6">
                3
              </div>
              <div>
                <h3 className="heading-md mb-4">Continuous Improvement</h3>
                <p className="text-body">
                  As you add more content and users interact with your agent, it continuously 
                  learns and improves, becoming more accurate and helpful over time.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-slate-900 text-white rounded-lg flex items-center justify-center text-2xl font-bold mr-6">
                4
              </div>
              <div>
                <h3 className="heading-md mb-4">Expert-Level Performance</h3>
                <p className="text-body">
                  Through progressive training and interaction, your AI agent reaches 
                  expert-level performance, accurately representing your knowledge and expertise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-20">
            <h2 className="heading-lg mb-6">Security & Privacy</h2>
            <p className="text-body max-w-3xl mx-auto">
              Enterprise-grade security to protect your knowledge and users
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-premium">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="heading-md mb-4">Data Protection</h3>
              <p className="text-body-sm">
                Your content is encrypted in transit and at rest. We use industry-standard 
                security protocols to ensure your knowledge remains private and secure.
              </p>
            </div>
            
            <div className="card-premium">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h3 className="heading-md mb-4">Access Control</h3>
              <p className="text-body-sm">
                Control who can access your AI agents and what information they can see. 
                Set privacy levels and manage user permissions with granular control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="section-padding bg-slate-50">
        <div className="container-max">
          <div className="text-center mb-20">
            <h2 className="heading-lg mb-6">Integrations & APIs</h2>
            <p className="text-body max-w-3xl mx-auto">
              Connect your AI agents with existing systems and workflows
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Cpu className="h-8 w-8 text-white" />
              </div>
              <h3 className="heading-md mb-4">REST API</h3>
              <p className="text-body-sm">
                Full REST API access for integrating AI agents into your applications, 
                websites, and business processes.
              </p>
            </div>
            
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Network className="h-8 w-8 text-white" />
              </div>
              <h3 className="heading-md mb-4">Webhooks</h3>
              <p className="text-body-sm">
                Real-time notifications and event triggers to keep your systems 
                synchronized with AI agent activities.
              </p>
            </div>
            
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="heading-md mb-4">SDKs</h3>
              <p className="text-body-sm">
                Official SDKs for popular programming languages to accelerate 
                integration and development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-slate-900">
        <div className="container-max">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="heading-lg text-white mb-6">
              Ready to Experience These Features?
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Start building your AI agent today and unlock the full potential of the platform.
            </p>
            <Link 
              href="/dashboard"
              className="btn bg-white text-slate-900 hover:bg-slate-100 text-lg px-8 py-4"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
