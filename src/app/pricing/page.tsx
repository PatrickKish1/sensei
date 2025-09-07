'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Check,
  Star
} from 'lucide-react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individuals and small creators',
      price: billingCycle === 'monthly' ? 29 : 290,
      originalPrice: billingCycle === 'monthly' ? 39 : 390,
      features: [
        'Up to 3 AI agents',
        'Basic training content (10GB)',
        'Standard chat interface',
        'Email support',
        'Basic analytics',
        'Community forum access'
      ],
      popular: false,
      cta: 'Get Started',
      href: '/dashboard'
    },
    {
      name: 'Professional',
      description: 'Ideal for growing businesses and teams',
      price: billingCycle === 'monthly' ? 99 : 990,
      originalPrice: billingCycle === 'monthly' ? 129 : 1290,
      features: [
        'Up to 15 AI agents',
        'Advanced training content (100GB)',
        'Custom chat interfaces',
        'Priority support',
        'Advanced analytics & insights',
        'API access',
        'Custom integrations',
        'Team collaboration tools'
      ],
      popular: true,
      cta: 'Start Free Trial',
      href: '/dashboard'
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with custom needs',
      price: 'Custom',
      originalPrice: null,
      features: [
        'Unlimited AI agents',
        'Unlimited training content',
        'White-label solutions',
        'Dedicated support manager',
        'Custom AI model training',
        'Advanced security features',
        'SLA guarantees',
        'On-premise deployment options'
      ],
      popular: false,
      cta: 'Contact Sales',
      href: '/contact'
    }
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
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Start small and scale as you grow.
          </p>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Save 25%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                  plan.popular
                    ? 'border-indigo-500 ring-2 ring-indigo-500 ring-opacity-20'
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white">
                                             <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-8">
                    {plan.price === 'Custom' ? (
                      <div className="text-3xl font-bold text-gray-900">Custom</div>
                    ) : (
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                        {billingCycle === 'monthly' ? (
                          <span className="text-gray-600 ml-1">/month</span>
                        ) : (
                          <span className="text-gray-600 ml-1">/year</span>
                        )}
                      </div>
                    )}
                    
                    {plan.originalPrice && plan.originalPrice !== plan.price && (
                      <div className="mt-2">
                        <span className="text-lg text-gray-500 line-through">
                          ${plan.originalPrice}
                        </span>
                        {billingCycle === 'monthly' ? '/month' : '/year'}
                      </div>
                    )}
                  </div>

                  <Link
                    href={plan.href}
                    className={`w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg transition-colors ${
                      plan.popular
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>

                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">What's included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                                                 <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Common questions about our pricing and plans
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan at any time?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect 
                immediately, and we'll prorate any billing adjustments.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial available?
              </h3>
              <p className="text-gray-600">
                Yes! We offer a 14-day free trial on our Professional plan. No credit card 
                required to start your trial.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I exceed my plan limits?
              </h3>
              <p className="text-gray-600">
                We'll notify you when you're approaching your limits. You can either upgrade 
                your plan or purchase additional capacity as needed.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer discounts for non-profits or educational institutions?
              </h3>
              <p className="text-gray-600">
                Yes, we offer special pricing for qualified non-profits and educational 
                institutions. Please contact our sales team for more information.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel my subscription?
              </h3>
              <p className="text-gray-600">
                Absolutely. You can cancel your subscription at any time from your account 
                settings. There are no cancellation fees or long-term commitments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Our Enterprise plan offers custom pricing, dedicated support, and tailored 
            solutions for your organization's specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all transform hover:scale-105"
            >
              Contact Sales
            </Link>
            <Link 
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 border-2 border-transparent text-lg font-medium rounded-lg text-white border-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
