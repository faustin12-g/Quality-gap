import React from 'react'
import Header from '../components/Header'

const About = () => {
  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'Founder & CEO',
      bio: 'Education technology expert with 15+ years experience in school administration systems.',
      img: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Sarah Williams',
      role: 'Product Lead',
      bio: 'Former school principal passionate about creating tools that make educators lives easier.',
      img: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      name: 'Michael Chen',
      role: 'Lead Developer',
      bio: 'Full-stack developer specializing in educational platforms and secure data systems.',
      img: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Customer Success',
      bio: 'Dedicated to ensuring schools get the most value from our platform.',
      img: 'https://randomuser.me/api/portraits/women/28.jpg'
    }
  ]

  const stats = [
    { value: '250+', label: 'Schools using Nexus' },
    { value: '1M+', label: 'Students impacted' },
    { value: '98%', label: 'Customer satisfaction' },
    { value: '24/7', label: 'Support availability' }
  ]

  return (
    <div className="bg-white">
     <Header/>
      <div className="relative bg-amber-100">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            About Nexus
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
            Transforming school management through innovative technology
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Story
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              Founded in 2025 by former educators, Nexus was born out of frustration with outdated school management systems. 
              We set out to create a modern, intuitive platform that actually meets the needs of today's schools.
            </p>
            <p className="mt-3 text-lg text-gray-500">
              What started as a small project for local schools has grown into a comprehensive platform serving institutions 
              across the country, from small private academies to large public school districts.
            </p>
          </div>
          <div className="mt-12 lg:mt-0">
            <img
              className="rounded-lg shadow-xl"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt="Team working together"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-extrabold text-blue-600">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="bg-blue-50 rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  <span className="block">Our Mission</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-gray-600">
                  To empower educational institutions with technology that simplifies administration, 
                  enhances learning outcomes, and connects school communities.
                </p>
                <p className="mt-4 text-lg leading-6 text-gray-600">
                  We believe great software should make educators' jobs easier, not harder.
                </p>
              </div>
            </div>
            <div className="-mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
              <img
                className="transform translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Students using technology"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Meet Our Team
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            The passionate people behind Nexus
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((person) => (
            <div key={person.name} className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                      <img 
                        className="h-16 w-16 rounded-full object-cover" 
                        src={person.img} 
                        alt={person.name}
                      />
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {person.name}
                  </h3>
                  <p className="mt-1 text-sm text-blue-600">{person.role}</p>
                  <p className="mt-3 text-base text-gray-500">
                    {person.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-amber-100">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-black sm:text-4xl">
              <span className="block">Ready to transform your school?</span>
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-blue-100">
              Join hundreds of schools already using Nexus to simplify their administration.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                >
                  Get started
                </a>
              </div>
              <div className="ml-3 inline-flex">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700"
                >
                  Contact sales
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About