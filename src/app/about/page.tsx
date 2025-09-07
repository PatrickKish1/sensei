'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lightbulb, Users, Globe } from 'lucide-react';

export default function AboutPage() {
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
            About Digital Sensei
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're revolutionizing how knowledge is shared and preserved through intelligent AI agents
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
                              <Lightbulb className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To democratize access to expert knowledge by creating digital clones that learn, 
              grow, and share wisdom 24/7. We believe everyone should have access to the 
              expertise of industry leaders, regardless of time or location constraints.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem We Solve</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-red-600 text-sm font-bold">!</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">Knowledge Silos</h3>
                    <p className="text-gray-600">Expert knowledge is often trapped in individual minds, inaccessible to those who need it most.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-red-600 text-sm font-bold">!</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">Time Constraints</h3>
                    <p className="text-gray-600">Even when experts are available, scheduling conflicts and time zones create barriers to knowledge sharing.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-red-600 text-sm font-bold">!</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">Scalability Issues</h3>
                    <p className="text-gray-600">Traditional mentoring and consultation models don't scale to meet global demand for expert guidance.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Solution</h3>
              <p className="text-gray-600 mb-4">
                Digital Sensei creates AI agents that capture and replicate expert knowledge, 
                making it available to anyone, anywhere, at any time.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></span>
                  Progressive learning from minimal content
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></span>
                  24/7 availability and instant responses
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></span>
                  Scalable knowledge distribution
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></span>
                  Continuous improvement through interaction
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Digital Sensei Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform uses advanced AI technology to create intelligent digital clones 
              that learn and grow with your knowledge
            </p>
          </div>
          
          <div className="space-y-12">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-6">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Knowledge Capture</h3>
                <p className="text-gray-600">
                  Experts upload their knowledge through various formats - documents, videos, 
                  audio recordings, and direct text input. Our system processes and understands 
                  the content, creating a foundation for the AI agent.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-6">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Training</h3>
                <p className="text-gray-600">
                  Using state-of-the-art language models and machine learning algorithms, 
                  we train the AI agent on the uploaded knowledge. The system learns patterns, 
                  context, and relationships within the content.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-6">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Learning</h3>
                <p className="text-gray-600">
                  As users interact with the AI agent, it continues to learn and improve. 
                  Each conversation provides new insights and helps refine the agent's 
                  understanding and response quality.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-6">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Knowledge Distribution</h3>
                <p className="text-gray-600">
                  The trained AI agent becomes available for others to interact with, 
                  sharing the expert's knowledge and insights with a global audience 
                  that can access it anytime, anywhere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're a team of AI researchers, engineers, and entrepreneurs passionate 
              about democratizing knowledge and expertise
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-indigo-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Researchers</h3>
              <p className="text-gray-600">
                Experts in natural language processing, machine learning, and AI ethics
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Platform Engineers</h3>
              <p className="text-gray-600">
                Building scalable, secure infrastructure for global knowledge sharing
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-pink-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Lightbulb className="h-12 w-12 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Visionaries</h3>
              <p className="text-gray-600">
                Shaping the future of how knowledge is accessed and shared globally
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Join the Knowledge Revolution?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Start building your digital clone today and share your expertise with the world.
          </p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all transform hover:scale-105"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
