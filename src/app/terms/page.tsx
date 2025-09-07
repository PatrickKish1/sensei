'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The terms and conditions for using our platform
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 2025</p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using Digital Sensei ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-4">
                Digital Sensei is an AI-powered platform that allows users to create, train, and interact with AI agents. The Service includes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>AI agent creation and management</li>
                <li>Content training and knowledge base management</li>
                <li>Chat and interaction interfaces</li>
                <li>Analytics and insights</li>
                <li>API access and integrations</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-600 mb-4">
                To use certain features of the Service, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
              <p className="text-gray-600 mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload malicious content or malware</li>
                <li>Harass, abuse, or harm others</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the Service for illegal or harmful purposes</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Content and Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                You retain ownership of content you upload to the Service. By uploading content, you:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Grant us a license to process and store your content</li>
                <li>Warrant that you have the right to share such content</li>
                <li>Are responsible for ensuring content compliance with our policies</li>
                <li>Understand that content is used to train AI agents</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. AI Agent Behavior</h2>
              <p className="text-gray-600 mb-4">
                While we strive to ensure AI agents behave appropriately, you acknowledge that:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>AI responses are generated based on training data and may contain errors</li>
                <li>We are not responsible for AI agent responses or actions</li>
                <li>You are responsible for monitoring and moderating your AI agents</li>
                <li>AI agents may reflect biases present in training data</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacy and Data</h2>
              <p className="text-gray-600 mb-4">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Service Availability</h2>
              <p className="text-gray-600 mb-4">
                We strive to maintain high service availability but cannot guarantee:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Uninterrupted access to the Service</li>
                <li>Error-free operation</li>
                <li>Immediate resolution of technical issues</li>
                <li>Compatibility with all devices or browsers</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Payment Terms</h2>
              <p className="text-gray-600 mb-4">
                For paid plans, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Pay all fees in advance</li>
                <li>Provide accurate billing information</li>
                <li>Authorize recurring charges for subscription plans</li>
                <li>Notify us of any billing disputes within 30 days</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
              <p className="text-gray-600 mb-4">
                You may terminate your account at any time. We may terminate or suspend your access to the Service if you violate these Terms. Upon termination:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Your right to use the Service ceases immediately</li>
                <li>We may delete your account and data</li>
                <li>No refunds will be provided for unused subscription periods</li>
                <li>Certain provisions survive termination</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                To the maximum extent permitted by law, Digital Sensei shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Indemnification</h2>
              <p className="text-gray-600 mb-4">
                You agree to indemnify and hold harmless Digital Sensei from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
              <p className="text-gray-600 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Digital Sensei operates, without regard to conflict of law principles.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the Service. Continued use after changes constitutes acceptance of the new Terms.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-2">
                  <strong>Email:</strong> legal@digitalsensei.ai
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Address:</strong> 123 AI Innovation Drive, Tech Valley, CA 94000
                </p>
                <p className="text-gray-600">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Questions About Our Terms?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We're committed to transparency. Contact us if you need clarification on any terms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
            >
              Contact Us
            </Link>
            <Link 
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
