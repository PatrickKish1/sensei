'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            How we collect, use, and protect your information
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 2025</p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-600 mb-4">
                Digital Sensei ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                information when you use our platform and services.
              </p>
              <p className="text-gray-600">
                By using Digital Sensei, you agree to the collection and use of information in 
                accordance with this policy. If you do not agree with our policies and practices, 
                please do not use our services.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
              <p className="text-gray-600 mb-4">
                We may collect personal information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Name and contact information (email address, phone number)</li>
                <li>Account credentials and profile information</li>
                <li>Payment and billing information</li>
                <li>Communication preferences and settings</li>
                <li>Content you upload, including documents, videos, and audio files</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Information</h3>
              <p className="text-gray-600 mb-4">
                We automatically collect certain information about your use of our services:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Log data (IP address, browser type, access times, pages viewed)</li>
                <li>Device information (device type, operating system, unique device identifiers)</li>
                <li>Usage patterns and interactions with AI agents</li>
                <li>Performance metrics and error logs</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Training Data</h3>
              <p className="text-gray-600">
                When you upload content for AI training, we process and store this information 
                to improve your AI agents' performance. This data is encrypted and stored securely, 
                and you maintain control over what content is used for training.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Providing and maintaining our services</li>
                <li>Processing payments and managing subscriptions</li>
                <li>Training and improving AI agents based on your content</li>
                <li>Personalizing your experience and recommendations</li>
                <li>Communicating with you about updates and support</li>
                <li>Analyzing usage patterns to improve our platform</li>
                <li>Ensuring security and preventing fraud</li>
                <li>Complying with legal obligations</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sharing and Disclosure</h2>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third 
                parties without your consent, except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li><strong>Service Providers:</strong> We may share information with trusted 
                third-party service providers who assist us in operating our platform</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required 
                by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In the event of a merger or acquisition, 
                your information may be transferred as part of the business assets</li>
                <li><strong>Consent:</strong> We may share information with your explicit consent</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate technical and organizational security measures to protect 
                your personal information against unauthorized access, alteration, disclosure, 
                or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure data centers and infrastructure</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-gray-600">
                However, no method of transmission over the internet or electronic storage is 
                100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights and Choices</h2>
              <p className="text-gray-600 mb-4">
                You have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Objection:</strong> Object to certain types of processing</li>
              </ul>
              <p className="text-gray-600">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
              <p className="text-gray-600 mb-4">
                We retain your personal information for as long as necessary to provide our 
                services and fulfill the purposes outlined in this policy. The retention period 
                depends on:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>The type of information and its purpose</li>
                <li>Legal and regulatory requirements</li>
                <li>Your account status and preferences</li>
                <li>Legitimate business needs</li>
              </ul>
              <p className="text-gray-600">
                When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar tracking technologies to enhance your experience 
                and analyze usage patterns. You can control cookie settings through your 
                browser preferences.
              </p>
              <p className="text-gray-600">
                Types of cookies we use include:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li><strong>Essential cookies:</strong> Required for basic platform functionality</li>
                <li><strong>Performance cookies:</strong> Help us understand how visitors use our platform</li>
                <li><strong>Functional cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Analytics cookies:</strong> Provide insights into platform usage</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
              <p className="text-gray-600">
                Your information may be transferred to and processed in countries other than 
                your own. We ensure that such transfers comply with applicable data protection 
                laws and implement appropriate safeguards to protect your information.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-600">
                Our services are not intended for children under 13 years of age. We do not 
                knowingly collect personal information from children under 13. If you become 
                aware that a child has provided us with personal information, please contact 
                us immediately.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this Privacy Policy from time to time to reflect changes in 
                our practices or applicable laws. We will notify you of any material changes 
                by:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Posting the updated policy on our platform</li>
                <li>Sending you an email notification</li>
                <li>Displaying a prominent notice on our website</li>
              </ul>
              <p className="text-gray-600">
                Your continued use of our services after such changes constitutes acceptance 
                of the updated policy.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-2">
                  <strong>Email:</strong> privacy@digitalsensei.ai
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
            Questions About Privacy?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We're committed to transparency and protecting your data. Contact us if you need clarification.
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
