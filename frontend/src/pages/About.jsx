import React from 'react';
import { Users, Target, Award } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: <Users className="w-12 h-12 text-blue-500 mb-4" />,
      title: "Customer-Centric Approach",
      description: "We prioritize your shopping experience, offering personalized service and support."
    },
    {
      icon: <Target className="w-12 h-12 text-blue-500 mb-4" />,
      title: "Quality Guaranteed",
      description: "Every product is carefully selected to meet the highest standards of quality and performance."
    },
    {
      icon: <Award className="w-12 h-12 text-blue-500 mb-4" />,
      title: "Innovative Solutions",
      description: "We continuously evolve to bring you the latest trends and cutting-edge products."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-400 text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to E-com
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Your ultimate destination for seamless online shopping,
            delivering quality products and exceptional customer experience.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Our Mission
          </h2>
          <p className="max-w-3xl mx-auto text-gray-700 text-lg leading-relaxed">
            At E-com, we are committed to transforming your online shopping
            experience by providing a curated selection of high-quality products,
            seamless navigation, and unparalleled customer support.
          </p>
        </div>
      </div>

      {/* Contact Invitation */}
      <div className="bg-blue-400 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Have Questions? We're Here to Help!
        </h2>
        <p className="mb-6 text-lg">
          Reach out to our friendly customer support team.
        </p>
        <button
          onClick={() => window.location.href = '/contact'}
          className="bg-white text-blue-500 hover:bg-blue-50 px-6 py-3 rounded-full font-semibold transition-colors"
        >
          Contact Us
        </button>
      </div>
    </div>
  );
}
