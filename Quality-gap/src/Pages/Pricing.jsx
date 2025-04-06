// eslint-disable-next-line no-unused-vars
import React from 'react'
import { CheckIcon } from '@heroicons/react/24/solid'
import Header from '../components/Header'

const Pricing = () => {
  const tiers = [
    {
      name: 'Basic',
      price: 'free',
      period: '/month',
      description: 'Perfect for small schools just getting started',
      features: [
        'Up to 100 students',
        'Basic attendance tracking',
        'Gradebook functionality',
        'Email support',
        '5 staff accounts'
      ],
      featured: false
    },
    {
      name: 'Standard',
      price: '$10',
      period: '/month',
      description: 'For growing schools needing more features',
      features: [
        'Up to 500 students',
        'Advanced attendance tracking',
        'Gradebook with analytics',
        'Parent portal',
        'Priority email support',
        'Unlimited staff accounts',
        'Basic reporting'
      ],
      featured: true
    },
    {
      name: 'Premium',
      price: '$20',
      period: '/month',
      description: 'For large institutions with complex needs',
      features: [
        'Unlimited students',
        'All Standard features plus:',
        'Advanced analytics',
        'Custom reporting',
        'API access',
        '24/7 phone support',
        'Dedicated account manager',
        'Onboarding assistance'
      ],
      featured: false
    }
  ]

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Header/>
      <div className="max-w-7xl mx-auto mt-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, transparent pricing with Nexus
          </h2>
          <p className="mt-3 text-xl text-gray-500">
            Everything you need to manage your school efficiently
          </p>
        </div>

        <div className="mt-12 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col ${
                tier.featured ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {tier.featured && (
                <div className="absolute top-0 py-1.5 px-4 bg-blue-500 rounded-full text-xs font-semibold uppercase tracking-wide text-white transform -translate-y-1/2">
                  Most popular
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {tier.name}
                </h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">
                    {tier.price}
                  </span>
                  <span className="ml-1 text-xl font-semibold">
                    {tier.period}
                  </span>
                </p>
                <p className="mt-2 text-gray-500">{tier.description}</p>
                <ul className="mt-6 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex">
                      <CheckIcon
                        className="flex-shrink-0 h-5 w-5 text-green-500"
                        aria-hidden="true"
                      />
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <a
                  href="#"
                  className={`block w-full py-3 px-6 text-center rounded-md border border-transparent font-medium ${
                    tier.featured
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  Get started
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Need something custom?
          </h3>
          <p className="text-gray-500 mb-4">
            We offer enterprise plans for large school districts and universities 
            with custom needs. Contact us to discuss your requirements.
          </p>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Contact sales
          </button>
        </div>
      </div>
    </div>
  )
}

export default Pricing