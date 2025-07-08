// React import removed - not needed in React 17+
import { ChatBubbleLeftEllipsisIcon, DocumentTextIcon, CheckCircleIcon, ArrowRightIcon, CheckBadgeIcon, QuestionMarkCircleIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

const ServiceProcess = () => {
  const steps = [
    {
      icon: <ChatBubbleLeftEllipsisIcon className="w-8 h-8" />,
      title: "Initial Consultation",
      description: "Book a 45-minute consultation where we'll assess your situation and recommend the best visa option for you.",
      features: ["Personalized assessment", "Visa category recommendation", "Timeline planning"]
    },
    {
      icon: <DocumentTextIcon className="w-8 h-8" />,
      title: "Document Preparation",
      description: "We'll guide you through gathering all necessary documents and ensure everything is properly prepared.",
      features: ["Document checklist", "Translation services", "Notarization support"]
    },
    {
      icon: <CheckCircleIcon className="w-8 h-8" />,
      title: "Application & Follow-up",
      description: "We handle the entire application process and keep you updated on its progress until approval.",
      features: ["Application submission", "Progress tracking", "Government liaison"]
    },
    {
      icon: <CheckBadgeIcon className="w-8 h-8" />,
      title: "Service Conclusion & Future Services",
      description: "Receive your approved visa and guidance for future legal or migration needs. We remain available for any follow-up or additional services.",
      features: ["Visa delivery & review", "Post-approval guidance", "Discounts for returning clients"]
    }
  ];

  // FAQ Section
  const faqs = [
    {
      question: "How long does the visa process take?",
      answer: "Processing times vary by visa type and government workload, but most applications are processed within 2-6 weeks after submission."
    },
    {
      question: "What documents do I need to provide?",
      answer: "Required documents depend on your visa type, but typically include your passport, application forms, proof of income, and supporting documents. We provide a personalized checklist during the process."
    },
    {
      question: "Can you help if my visa is denied?",
      answer: "Yes, we offer support for appeals and re-applications, analyzing the reasons for denial and helping you strengthen your case."
    },
    {
      question: "Do you offer services after I receive my visa?",
      answer: "Absolutely! We provide ongoing legal support, renewals, and assistance with other migration or legal needs in Colombia."
    }
  ];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            How Our Service Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined process ensures your visa application is handled efficiently and professionally from start to finish.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 transform -translate-y-1/2 z-0"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="group relative">
              
           
                {/* Card */}
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 group-hover:scale-105 relative">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                    <div className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                      {step.icon}
                    </div>
                  </div>
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  {/* Features */}
                  <ul className="space-y-2">
                    {step.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Arrow (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200">
                      <ArrowRightIcon className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* FAQ Accordion Section */}
        <div className="max-w-2xl mx-auto mt-16">
          <h3 className="text-xl font-bold text-primary mb-6 text-center">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                  aria-controls={`faq-panel-${idx}`}
                >
                  <span className="font-medium text-gray-800 text-left">{faq.question}</span>
                  <ChevronDownIcon className={`w-5 h-5 ml-2 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div id={`faq-panel-${idx}`} className="px-4 py-3 bg-white border-t border-gray-100 text-gray-700 text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceProcess; 