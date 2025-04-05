import React from "react";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-yellow-100 text-teal-700 py-8">
      <div className="container mx-auto max-w-screen-xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="font-bold text-xl mb-4">QualityGap</h2>
            <p className="text-sm">
              At QualityGap, we believe that the collective expertise of educators is a powerful asset.
              Our platform empowers teachers to share resources, ideas, and best practices, fostering a
              collaborative learning environment.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h2 className="font-bold text-xl mb-4">Navigation</h2>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-teal-900">Home</a></li>
              <li><a href="/about" className="hover:text-teal-900">About</a></li>
              <li><a href="/pricing" className="hover:text-teal-900">Pricing</a></li>
              <li><a href="/contact" className="hover:text-teal-900">Contact Us</a></li>
              <li><a href="/help-support" className="hover:text-teal-900">Help/Support</a></li>
              <li><a href="/partners" className="hover:text-teal-900">Partners</a></li>
            </ul>
          </div>

          {/* Social Media and Subscription Form */}
          <div>
            <h2 className="font-bold text-xl mb-4">Follow Us</h2>
            <ul className="flex space-x-4 mb-6">
              <li>
                <a
                  href="https://twitter.com"
                  aria-label="Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-900"
                >
                  <FaTwitter size={24} />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-900"
                >
                  <FaLinkedin size={24} />
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-900"
                >
                  <FaFacebook size={24} />
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-900"
                >
                  <FaInstagram size={24} />
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-900"
                >
                  <FaYoutube size={24} />
                </a>
              </li>
            </ul>

            <form className="flex flex-col space-y-4">
              <label htmlFor="email" className="text-sm">
                Subscribe to our newsletter
              </label>
              <div className="flex">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="p-2 border border-teal-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-r-md hover:bg-teal-700"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-teal-500">
          © {new Date().getFullYear()} QualityGap. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
