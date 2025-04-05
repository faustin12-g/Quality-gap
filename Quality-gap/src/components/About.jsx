import { useState } from 'react';

const About = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="max-w-4xl lg:max-w-6xl mx-auto my-8 p-4 transition rounded-2xl shadow-lg bg-white" id='about'>
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">About QualityGap</h1>

      {/* Mission and Vision */}
      <div className="mb-4">
        <button
          className="w-full flex justify-between items-center text-lg font-semibold py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg"
          onClick={() => toggleSection('mission')}
        >
          <span>Mission and Vision</span>
          <span>{activeSection === 'mission' ? '-' : '+'}</span>
        </button>
        {activeSection === 'mission' && (
          <div className="p-4 text-gray-700 bg-gray-50 rounded-lg mt-2">
            <p>Our mission is to bridge the gap in education quality by empowering schools, teachers, and parents with data-driven insights and collaborative tools.</p>
            <p>We envision a world where every student has access to high-quality education, supported by technology and community collaboration.</p>
          </div>
        )}
      </div>

      {/* Core Features */}
      <div className="mb-4">
        <button
          className="w-full flex justify-between items-center text-lg font-semibold py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg"
          onClick={() => toggleSection('features')}
        >
          <span>Core Features</span>
          <span>{activeSection === 'features' ? '-' : '+'}</span>
        </button>
        {activeSection === 'features' && (
          <div className="p-4 text-gray-700 bg-gray-50 rounded-lg mt-2">
            <ul className="list-disc pl-6">
              <li>Analytics & Insights: Tools to monitor student performance, teacher effectiveness, and parental engagement.</li>
              <li>Teacher Collaboration: A platform for resource sharing, lesson planning, and professional development.</li>
              <li>Parental Involvement: Features that enable parents to track and contribute to their child’s academic progress.</li>
              <li>School Management: Tools for managing school activities, attendance, and resources.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Target Audience */}
      <div className="mb-4">
        <button
          className="w-full flex justify-between items-center text-lg font-semibold py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg"
          onClick={() => toggleSection('audience')}
        >
          <span>Target Audience</span>
          <span>{activeSection === 'audience' ? '-' : '+'}</span>
        </button>
        {activeSection === 'audience' && (
          <div className="p-4 text-gray-700 bg-gray-50 rounded-lg mt-2">
            <p>This platform is designed for:</p>
            <ul className="list-disc pl-6">
              <li>Schools: For better management and resource optimization.</li>
              <li>Teachers: To enhance collaboration and teaching effectiveness.</li>
              <li>Parents: To stay informed and involved in their children’s education.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Problem */}
      <div className="mb-4">
        <button
          className="w-full flex justify-between items-center text-lg font-semibold py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg"
          onClick={() => toggleSection('problem')}
        >
          <span>The Problem We’re Solving</span>
          <span>{activeSection === 'problem' ? '-' : '+'}</span>
        </button>
        {activeSection === 'problem' && (
          <div className="p-4 text-gray-700 bg-gray-50 rounded-lg mt-2">
            <p>Many students graduate without essential skills due to a lack of teacher resources, minimal parental involvement, and inefficient school management systems. QualityGap bridges these gaps with advanced tools and real-time data.</p>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="mb-4">
        <button
          className="w-full flex justify-between items-center text-lg font-semibold py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg"
          onClick={() => toggleSection('how')}
        >
          <span>How It Works</span>
          <span>{activeSection === 'how' ? '-' : '+'}</span>
        </button>
        {activeSection === 'how' && (
          <div className="p-4 text-gray-700 bg-gray-50 rounded-lg mt-2">
            <p>Teachers upload lesson plans and share resources. Parents receive updates and insights into their child’s progress. Administrators access analytics to optimize school performance.</p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="mb-4">
        <button
          className="w-full flex justify-between items-center text-lg font-semibold py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg"
          onClick={() => toggleSection('cta')}
        >
          <span>Call to Action</span>
          <span>{activeSection === 'cta' ? '-' : '+'}</span>
        </button>
        {activeSection === 'cta' && (
          <div className="p-4 text-gray-700 bg-gray-50 rounded-lg mt-2">
            <p>Join us in transforming education! Explore our features or contact us to learn more.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
