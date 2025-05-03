import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SchedExLogo from '../../assets/Logo.png';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>SchedEx - AI-Powered Presentation Scheduling System</title>
        <meta name="description" content="SchedEx is an AI-powered viva scheduling system designed to automate the allocation of presentation time slots while considering examiner availability, location constraints, and rescheduling requests." />
      </Helmet>

      {/* Header/Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src={SchedExLogo} alt="SchedEx Logo" className="h-10" />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#benefits" className="text-gray-600 hover:text-blue-600 transition-colors">Benefits</a>
              <a href="#integrations" className="text-gray-600 hover:text-blue-600 transition-colors">Integrations</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link to="/user/login" className="text-blue-600 hover:text-blue-800 font-medium">Log In</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Intelligent Presentation Scheduling Made Simple
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                SchedEx is an AI-powered scheduling system that automates presentation time slots while considering examiner availability, location constraints, and rescheduling needs.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <Link to="/user/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium text-center transition-colors">
                  Get Started
                </Link>
                <a href="#features" className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 px-6 py-3 rounded-md font-medium text-center transition-colors">
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-xl shadow-xl p-6 transform rotate-1">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 31 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-12 rounded flex items-center justify-center ${
                          [4, 12, 18, 23, 27].includes(i) 
                            ? 'bg-blue-100 text-blue-800 font-medium' 
                            : 'bg-white border border-gray-100'
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="bg-blue-100 rounded p-2 text-sm text-blue-800">
                    <div className="font-medium">Group A Presentation</div>
                    <div className="text-xs">10:00 AM - Room 101</div>
                  </div>
                  <div className="bg-green-100 rounded p-2 text-sm text-green-800">
                    <div className="font-medium">Group B Presentation</div>
                    <div className="text-xs">1:30 PM - Room 203</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg h-24 w-24 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="font-bold text-2xl">AI</div>
                  <div className="text-xs">Powered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Powerful Features for Effortless Scheduling</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              SchedEx offers a comprehensive suite of tools designed to streamline your presentation management process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition-shadow">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Scheduling</h3>
              <p className="text-gray-600">
                AI-powered algorithms that consider examiner availability, location constraints, and student preferences to create optimal schedules.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition-shadow">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-gray-600">
                Instant notifications and updates for schedule changes, ensuring all stakeholders stay informed throughout the process.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition-shadow">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Reports</h3>
              <p className="text-gray-600">
                Generate detailed reports on presentation schedules, examiner workload, and venue utilization for better resource management.
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition-shadow">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Conflict Resolution</h3>
              <p className="text-gray-600">
                Automatically detect and resolve scheduling conflicts, with manual override options for special cases.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition-shadow">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Access Control</h3>
              <p className="text-gray-600">
                Role-based access ensures administrators, examiners, and students see only what they need to see.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition-shadow">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customizable Interface</h3>
              <p className="text-gray-600">
                Tailor the system to your institution's needs with customizable fields, workflows, and branding options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose SchedEx?</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform offers numerous advantages that make presentation scheduling effortless and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Time Savings
                </h3>
                <p className="text-gray-600">
                  Reduce administrative workload by up to 80% with automated scheduling that would otherwise take days to complete manually.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Reduced Errors
                </h3>
                <p className="text-gray-600">
                  Eliminate double-bookings, scheduling conflicts, and human error with our intelligent conflict detection system.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Improved Experience
                </h3>
                <p className="text-gray-600">
                  Create a better experience for students and faculty with clear schedules, timely notifications, and fewer last-minute changes.
                </p>
              </div>
            </div>

            <div>
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Resource Optimization
                </h3>
                <p className="text-gray-600">
                  Maximize the use of available rooms and examiner time with intelligent allocation algorithms.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Data-Driven Insights
                </h3>
                <p className="text-gray-600">
                  Gain valuable insights into scheduling patterns, resource utilization, and examiner workload for better planning.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Scalability
                </h3>
                <p className="text-gray-600">
                  Whether you're scheduling 10 or 1,000 presentations, SchedEx scales effortlessly to meet your institution's needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Seamless Integrations</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              SchedEx works with your existing tools and systems to provide a unified scheduling experience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            <div className="bg-gray-50 rounded-xl p-6 w-full max-w-xs flex flex-col items-center justify-center hover:shadow-md transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Calendar</h3>
              <p className="text-gray-600 text-center">Sync presentations with Google Calendar</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 w-full max-w-xs flex flex-col items-center justify-center hover:shadow-md transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Systems</h3>
              <p className="text-gray-600 text-center">Automated notifications via email</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 w-full max-w-xs flex flex-col items-center justify-center hover:shadow-md transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">MS Teams</h3>
              <p className="text-gray-600 text-center">Integration with Microsoft Teams</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 w-full max-w-xs flex flex-col items-center justify-center hover:shadow-md transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">LMS Systems</h3>
              <p className="text-gray-600 text-center">Connect with your learning management system</p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-6">Don't see your system? Contact us for custom integration options.</p>
            <Link to="/user/signup" className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 bg-white rounded-md hover:bg-blue-50 font-medium transition-colors">
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Presentation Scheduling?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join institutions worldwide that are saving time and reducing stress with SchedEx's intelligent scheduling system.
          </p>
          <Link to="/user/signup" className="inline-flex items-center px-8 py-4 bg-white text-blue-700 rounded-md font-medium hover:bg-blue-50 transition-colors">
            Get Started Today
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <img src={SchedExLogo} alt="SchedEx Logo" className="h-10" />
              </div>
              <p className="text-gray-400">
                AI-powered presentation scheduling system for educational institutions.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Smart Scheduling</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Real-time Updates</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Comprehensive Reports</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Conflict Resolution</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">Email: info@schedex.com</li>
                <li className="text-gray-400">Phone: +1 (123) 456-7890</li>
                <li className="text-gray-400">Address: 123 Education St, University City</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SchedEx. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
