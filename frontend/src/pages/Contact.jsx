import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  MessageCircle
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual form submission logic
    console.log('Form Submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  const contactMethods = [
    {
      icon: <Phone className="w-8 h-8 text-blue-500" />,
      title: "Phone",
      info: "+1 (123) 123-4567",
      type: "Call Us"
    },
    {
      icon: <Mail className="w-8 h-8 text-blue-500" />,
      title: "Email",
      info: "itzwaleedxd2@gamil.com",
      type: "Email Us"
    },
    {
      icon: <MapPin className="w-8 h-8 text-blue-500" />,
      title: "Address",
      info: "123 E-commerce Gujranwala, Punjab, Pakistan 52250",
      type: "Visit Us"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-400 text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact E-com
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            We're here to help and answer any question you might have.
            We look forward to hearing from you!
          </p>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex justify-center mb-4">
                {method.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {method.title}
              </h3>
              <p className="text-gray-600 mb-2">{method.info}</p>
              <a
                href={method.type === 'Email Us' ? `mailto:${method.info}` :
                  method.type === 'Call Us' ? `tel:${method.info}` : '#'}
                className="text-blue-500 hover:underline"
              >
                {method.type}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="container mx-auto px-4 py-16 bg-blue-50">
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="name" className="block mb-2 text-gray-700">
                  <User className="inline-block mr-2 text-blue-500" /> Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="email" className="block mb-2 text-gray-700">
                  <Mail className="inline-block mr-2 text-blue-500" /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block mb-2 text-gray-700">
                <Phone className="inline-block mr-2 text-blue-500" /> Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your phone number (optional)"
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2 text-gray-700">
                <MessageCircle className="inline-block mr-2 text-blue-500" /> Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Write your message here..."
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-400 text-white px-6 py-3 rounded-full hover:bg-blue-500 transition-colors flex items-center justify-center mx-auto"
              >
                <Send className="mr-2" /> Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Google Maps Placeholder */}
      <div className="w-full h-96">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d218685.77303890214!2d74.05793609042709!3d32.15401235944029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f38fd5cc3cfdb%3A0x9a8467b54a49aaed!2sGujranwala%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1703138400000!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}