import React, { useState } from 'react';
import AllVisaFilterWidget from '../visas/AllVisaFilterWidget';
import InfoSectionSteps from '../InfoSectionSteps';
import AccordionFAQ from '../../AccordionFAQ';

const VisasAndImmigration = ({ allVisas, locale }) => {
  const [activeTab, setActiveTab] = useState('discover-visas');

  // Filter popular visas if needed (not used in this markup)
  const popularVisas = allVisas.filter(visa => visa.data.popular === true);

  const steps = [
    {
      title: "Initial consultation",
      content:
        "From the start, we provide personalized consultation to choose the visa category that best fits your professional, travel, personal, or family plans.",
    },
    {
      title: "Legal Strategy",
      content:
        "Depending on your needs (e.g., salvoconducto, permit extension), we devise a tailored legal strategy for your application.",
    },
    {
      title: "Application Submition",
      content:
        "We handle the submission process of your application and coordinate any associated payments, ensuring accuracy and efficiency.",
    },
    {
      title: "Process Monitoring",
      content:
        "We keep you updated on every step of the application status and handle any follow-ups with the immigration authority.",
    },
    {
      title: "Approval & Issuance",
      content:
        "Once your visa is approved, we verify all documentation, guide you through final payments, and confirm the details of your visa.",
    },
    {
      title: "Cédula de extranjería",
      content:
        "After visa approval, we assist you in obtaining your Cédula de extranjería, ensuring you meet all requirements and understand next steps.",
    },
  ];

  const visasFAQs = [
    {
      title: "How much does it cost?",
      content:
        "Depending on the visa category, it can range from $99 USD to $380 USD",
    },
    {
      title: "How long does it take?",
      content:
        "Depending on your needs (e.g., salvoconducto, permit extension), it can take around 6-8 weeks.",
    },
    {
      title: "Can I apply from Mexico?",
      content:
        "You can apply for any other country, provided that you hold a valid and vigent resident permit in that country",
    },
    {
      title: "What if I get denied?",
      content:
        "Consider that the final response can be either 'Negada' or 'Inadmitida'. Both with different consequences. When a visa application gets 'Negada', it means that you can't apply for a new visa until 6 months later. If the visa is deemed inadmissible or 'Inadmitida', you can apply for a new one the next day. ",
    },
  ];

  return (
    <div className="w-auto mt-12 mx-6 md:max-w-5xl md:mx-auto">
      <div className="text-3xl font-bold mt-16 mb-4 text-terciary">Visas and Immigration</div>
      <p className="font-light text-xl text-primary">
        The key to a successful visa application starts with a <span className="underline">good understanding of the process.</span>
      </p>
      <p className="font-light text-xl text-primary">
        If you want an experienced Law Firm by your side, check out our <span className="font-bold">Visa Assistance Service:</span>
      </p>

      <div className="my-4 border-b border-gray-200">
        <ul
          className="flex flex-wrap -mb-px text-lg text-center"
          role="tablist"
        >
          <li className="me-2" role="presentation">
            <button
              className={`inline-block p-1 md:p-4 border-b-2 rounded-t-lg ${
                activeTab === 'discover-visas'
                  ? 'text-secondary border-secondary hover:text-secondary/80'
                  : 'text-gray-500 hover:text-gray-600 hover:border-primary'
              }`}
              onClick={() => setActiveTab('discover-visas')}
              type="button"
              role="tab"
              aria-controls="discover-visas"
              aria-selected={activeTab === 'discover-visas'}
            >
              Discover Visas
            </button>
          </li>
          <li className="me-2" role="presentation">
            <button
              className={`inline-block p-1 md:p-4 border-b-2 rounded-t-lg ${
                activeTab === 'process'
                  ? 'text-secondary border-secondary hover:text-secondary/80'
                  : 'text-gray-500 hover:text-gray-600 hover:border-primary'
              }`}
              onClick={() => setActiveTab('process')}
              type="button"
              role="tab"
              aria-controls="process"
              aria-selected={activeTab === 'process'}
            >
              The Process
            </button>
          </li>
          <li className="me-2" role="presentation">
            <button
              className={`inline-block p-1 md:p-4 border-b-2 rounded-t-lg ${
                activeTab === 'faqs'
                  ? 'text-secondary border-secondary hover:text-secondary/80'
                  : 'text-gray-500 hover:text-gray-600 hover:border-primary'
              }`}
              onClick={() => setActiveTab('faqs')}
              type="button"
              role="tab"
              aria-controls="faqs"
              aria-selected={activeTab === 'faqs'}
            >
              FAQs
            </button>
          </li>
        </ul>
      </div>
      <div id="default-tab-content">
        {activeTab === 'discover-visas' && (
          <div className="p-4 rounded-lg" role="tabpanel" id="discover-visas">
            <AllVisaFilterWidget locale={locale} visas={allVisas} />
          </div>
        )}
        {activeTab === 'process' && (
          <div className="p-4 rounded-lg" role="tabpanel" id="process">
            <InfoSectionSteps sections={steps} />
          </div>
        )}
        {activeTab === 'faqs' && (
          <div className="p-4 rounded-lg" role="tabpanel" id="faqs">
            <AccordionFAQ items={visasFAQs} />
          </div>
        )}
      </div>

      <div className="my-8 px-4 py-8 rounded-md bg-gray-50 text-center">
        <p className="text-primary font-light text-lg">
          Our fees for visa services start from <span className="font-semibold">$812,500 COP</span>.
        </p>
        <p className="text-primary font-light text-lg">We accept credit cards</p>
        <p className="text-primary font-light text-lg mt-1">
          To get a full detailed quotation, feel free to{' '}
          <a href="#" className="text-terciary underline font-semibold hover:text-terciary/80">
            book an appointment
          </a>
        </p>
      </div>
    </div>
  );
};

export default VisasAndImmigration;