'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  BookOpen,
  MessageSquare,
  Mail,
  Phone,
  HelpCircle,
  Video,
  FileText,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of creating and training your first AI agent',
      icon: BookOpen,
      articles: [
        'Creating Your First AI Agent',
        'Understanding the Training Process',
        'Basic Chat Interface Guide',
        'Account Setup and Configuration'
      ]
    },
    {
      title: 'Training & Knowledge Base',
      description: 'Master the art of training your AI agents with various content types',
      icon: Lightbulb,
      articles: [
        'Uploading Training Content',
        'Supported File Types',
        'Text Content Training',
        'Optimizing Training Data'
      ]
    },
    {
      title: 'Chat & Interactions',
      description: 'Learn how to interact with and manage your AI agents',
      icon: MessageSquare,
      articles: [
        'Starting Conversations',
        'Managing Chat History',
        'Customizing Chat Interface',
        'Troubleshooting Chat Issues'
      ]
    },
    {
      title: 'Advanced Features',
      description: 'Explore advanced capabilities and integrations',
      icon: Video,
      articles: [
        'API Integration Guide',
        'Custom Integrations',
        'Analytics and Insights',
        'Team Collaboration Features'
      ]
    },
    {
      title: 'Troubleshooting',
      description: 'Common issues and their solutions',
      icon: AlertTriangle,
      articles: [
        'Common Error Messages',
        'Performance Optimization',
        'Content Processing Issues',
        'API Connection Problems'
      ]
    },
    {
      title: 'Account & Billing',
      description: 'Manage your account, subscription, and billing',
      icon: FileText,
      articles: [
        'Account Settings',
        'Subscription Management',
        'Billing and Invoices',
        'Data Export and Privacy'
      ]
    }
  ];

  const popularArticles = [
    'How to create your first AI agent in 5 minutes',
    'Best practices for training content organization',
    'Understanding AI agent response quality',
    'Troubleshooting common upload issues',
    'Setting up team collaboration features'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                Digital Sensei
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Link 
            href="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers to your questions, learn best practices, and get the support you need.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles, guides, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              />
                             <HelpCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Link 
              href="/contact"
              className="group p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all hover:border-indigo-300"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <Mail className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    Contact Support
                  </h3>
                  <p className="text-gray-600">Get help from our support team</p>
                </div>
              </div>
            </Link>
            
            <Link 
              href="/docs"
              className="group p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all hover:border-indigo-300"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    Documentation
                  </h3>
                  <p className="text-gray-600">Comprehensive guides and API docs</p>
                </div>
              </div>
            </Link>
            
            <Link 
              href="/contact"
              className="group p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all hover:border-indigo-300"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    Live Chat
                  </h3>
                  <p className="text-gray-600">Chat with support in real-time</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Help Categories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse organized help topics to find the information you need quickly
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {helpCategories.map((category) => (
              <div key={category.title} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <category.icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">{category.title}</h3>
                </div>
                
                <p className="text-gray-600 mb-4">{category.description}</p>
                
                <ul className="space-y-2">
                  {category.articles.map((article) => (
                    <li key={article}>
                      <Link 
                        href={`/docs/${article.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-indigo-600 hover:text-indigo-700 text-sm hover:underline"
                      >
                        {article}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Help Articles</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Most frequently accessed help content and guides
            </p>
          </div>
          
          <div className="space-y-4">
            {popularArticles.map((article, index) => (
              <Link
                key={index}
                href={`/docs/${article.toLowerCase().replace(/\s+/g, '-')}`}
                className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-indigo-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 hover:text-indigo-600 transition-colors">
                    {article}
                  </span>
                  <span className="text-indigo-600 text-sm font-medium">Read →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Video Tutorials</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Watch step-by-step video guides to master Digital Sensei features
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <Video className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Getting Started with Digital Sensei
              </h3>
              <p className="text-gray-600 mb-3">
                Learn the basics of creating your first AI agent in this comprehensive tutorial.
              </p>
              <span className="text-sm text-gray-500">Duration: 15 minutes</span>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <Video className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Advanced Training Techniques
              </h3>
              <p className="text-gray-600 mb-3">
                Master advanced training methods to create highly effective AI agents.
              </p>
              <span className="text-sm text-gray-500">Duration: 22 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Community & Resources */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Community & Resources</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with other users and access additional learning resources
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Community Forum</h3>
              <p className="text-gray-600 mb-4">
                Join discussions with other Digital Sensei users. Share tips, ask questions, 
                and learn from the community.
              </p>
              <Link 
                href="/community"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Visit Community Forum →
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Developer Resources</h3>
              <p className="text-gray-600 mb-4">
                Access API documentation, SDKs, and integration guides for developers 
                building with Digital Sensei.
              </p>
              <Link 
                href="/api"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View Developer Docs →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Still need help?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Our support team is here to help you succeed with Digital Sensei.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all transform hover:scale-105"
            >
              Contact Support
            </Link>
            <Link 
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 border-2 border-transparent text-lg font-medium rounded-lg text-white border-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
