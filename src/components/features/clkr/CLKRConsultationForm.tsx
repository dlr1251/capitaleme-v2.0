import { useState } from 'react';

interface CLKRConsultationFormProps {
  topic: string;
  category: string;
}

export default function CLKRConsultationForm({ topic, category }: CLKRConsultationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    service: category || '',
    topic: topic || '',
    urgency: 'normal',
    budget: '',
    timeline: '',
    description: '',
    accept_terms: false,
    accept_marketing: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formcarry.com/s/oe6f89XVhFy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'CLKR Consultation',
          page: window.location.href,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSubmitSuccess(true);
        // Redirect to Calendly after a short delay
        setTimeout(() => {
          window.open('https://calendly.com/capital-m-law/initial-consultation-with-capital-m', '_blank');
        }, 2000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      
      alert('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 text-4xl mb-4">✅</div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Form submitted successfully!
        </h3>
        <p className="text-green-700 mb-4">
          Thank you for your inquiry. We are opening Calendly so you can schedule your appointment.
        </p>
        <div className="text-sm text-green-600">
          If it doesn't open automatically, click the link below.
        </div>
        <a 
          href="https://calendly.com/capital-m-law/initial-consultation-with-capital-m"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-4 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          <span className="mr-2">📅</span>
          Schedule Appointment on Calendly
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">📞</span>
          <div>
            <h3 className="text-white font-semibold text-lg">Personalized Consultation</h3>
            <p className="text-blue-100 text-sm">Complete the form and schedule your appointment</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Personal Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">👤</span>
            Personal Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+57 300 123 4567"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select your country</option>
                <option value="Colombia">Colombia</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="Spain">Spain</option>
                <option value="Mexico">Mexico</option>
                <option value="Argentina">Argentina</option>
                <option value="Chile">Chile</option>
                <option value="Peru">Peru</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your city"
              />
            </div>
          </div>
        </div>

        {/* Service Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">⚖️</span>
            Legal Service Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                Service Category
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a service category</option>
                <option value="Immigration">Immigration & Visas</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Business">Business & Corporate</option>
                <option value="Civil">Civil Law</option>
                <option value="Labor">Labor Law</option>
                <option value="Tax">Tax Law</option>
                <option value="Criminal">Criminal Law</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Specific Topic
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Work visa, Property purchase, etc."
              />
            </div>
            <div>
              <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level
              </label>
              <select
                id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low - General inquiry</option>
                <option value="normal">Normal - Planning phase</option>
                <option value="high">High - Urgent matter</option>
                <option value="critical">Critical - Immediate attention needed</option>
              </select>
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select budget range</option>
                <option value="Under $1,000">Under $1,000</option>
                <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                <option value="Over $25,000">Over $25,000</option>
                <option value="To be discussed">To be discussed</option>
              </select>
            </div>
            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                Timeline
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select timeline</option>
                <option value="Immediate">Immediate (1-2 weeks)</option>
                <option value="Short-term">Short-term (1-3 months)</option>
                <option value="Medium-term">Medium-term (3-6 months)</option>
                <option value="Long-term">Long-term (6+ months)</option>
                <option value="No specific timeline">No specific timeline</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description of Your Legal Matter
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Please provide a detailed description of your legal matter, including any specific questions or concerns you have..."
          />
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="accept_terms"
              name="accept_terms"
              checked={formData.accept_terms}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="accept_terms" className="ml-2 block text-sm text-gray-700">
              I have read and accept the <a href="/en/terms" target="_blank" className="text-blue-600 hover:text-blue-700 underline">Terms & Conditions</a> *
            </label>
          </div>
          
          <div className="flex items-start">
            <input
              type="checkbox"
              id="accept_marketing"
              name="accept_marketing"
              checked={formData.accept_marketing}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="accept_marketing" className="ml-2 block text-sm text-gray-700">
              I agree to receive marketing communications and updates from CapitalE (optional)
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-500">
            * Required fields
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <span className="mr-2">📤</span>
                Submit Consultation Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 