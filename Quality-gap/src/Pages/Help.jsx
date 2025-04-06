// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';

const Help = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({
        success: false,
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/customerhelpcenter/",
                formData,
                {
                    headers: {
                        "Content-type": "application/json",
                    }
                }
            );
            
            setSubmitStatus({
                success: true,
                message: 'Your request has been submitted successfully! We will get back to you soon.'
            });
            setFormData({ name: '', email: '', description: '' });
        } catch (error) {
            setSubmitStatus({
                success: false,
                message: 'There was an error submitting your request. Please try again later.'
            });
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <section className="py-12 px-4 max-w-4xl mx-auto mt-14 ">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Customer Support</h1>
                    <p className="text-gray-600">We're here to help! Please fill out the form below and our team will get back to you.</p>
                </div>
                
                <div className="bg-white p-8 rounded-lg shadow-md">
                    {submitStatus.message && (
                        <div className={`mb-6 p-4 rounded-md ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {submitStatus.message}
                        </div>
                    )}
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        
                        <div className="space-y-1">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Your Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                        
                        <div className="space-y-1">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Describe Your Problem
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Please describe the challenge you're facing in detail..."
                                required
                            />
                        </div>
                        
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>
                
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Need immediate assistance? Call us at <span className="font-medium">1-800-HELP-NOW</span></p>
                    <p className="mt-1">Our support team is available 24/7 to help you.</p>
                </div>
            </section>
        </div>
    );
};

export default Help;