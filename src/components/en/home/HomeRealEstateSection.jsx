import React, { useState } from 'react';
import InfoSectionSteps from '../InfoSectionSteps';
import PropertySearchService from '../real-estate/PropertySearchService';
import ExploreProperties from './ExploreProperties';
import AccordionFAQ from '../../AccordionFAQ';

// Constants
const TABS = {
  EXPLORE: 'explore-properties',
  SEARCH: 'property-search',
  PROCESS: 'real-estate-process',
  FAQS: 'real-estate-faqs'
};

const STEPS_REAL_ESTATE = [
  {
    title: 'Timing & Banking',
    content: 'Once you have found your dream property and before sending a written offer (which could be legally binding), you want to make sure that you have the available funds in Colombia and properly registered before the Central Bank...'
  },
  {
    title: 'Due Diligence',
    content: "Some properties may have mortgages, probate issues, liens, or other legal encumbrances that sellers or their representatives could forget to disclose upfront. To confirm this information, it's important to perform a title search. This involves a thorough review of relevant documents, such as previous deeds, the ownership certificate, the seller's background, and HOA rules. This review provides peace of mind, ensuring that the property has no legal restrictions and can be transferred to you without issues. Additionally, findings from the title search may present new points for negotiation with the seller."
  },
  {
    title: 'Prep Docs',
    content: 'Due to the lack of a widespread use of an escrow account, Colombians use a contract called "Promesa de Compraventa" to ensure the deal and to penalize the party who withdraws from the deal without a reason. This contract is a private document that will set all the essential points of the deal: Price, payment structure, delivery date, and related obligations. It will also set a date, time and notary in which the deeds will get signed.',
  },
  {
    title: 'Process Monitoring',
    content: 'We keep you updated on every step of the application status and handle any follow-ups with the immigration authority.',
  },
  {
    title: 'Approval & Issuance',
    content: 'Once your visa is approved, we verify all documentation, guide you through final payments, and confirm the details of your visa.',
  },
  {
    title: 'Cédula de extranjería',
    content: 'After visa approval, we assist you in obtaining your Cédula de extranjería, ensuring you meet all requirements and understand next steps.',
  },
];

const FAQS_REAL_ESTATE = [
  {
    title: 'How much does it cost?',
    content: 'Depending on the visa category, it can range from $99 USD to $380 USD'
  },
  {
    title: 'How long does it take?',
    content: 'Depending on your needs (e.g., salvoconducto, permit extension), we devise a tailored legal strategy for your application.',
  },
  {
    title: 'Application Submition',
    content: 'We handle the submission process of your application and coordinate any associated payments, ensuring accuracy and efficiency.',
  },
  {
    title: 'Process Monitoring',
    content: 'We keep you updated on every step of the application status and handle any follow-ups with the immigration authority.',
  },
  {
    title: 'Approval & Issuance',
    content: 'Once your visa is approved, we verify all documentation, guide you through final payments, and confirm the details of your visa.',
  },
  {
    title: 'Cédula de extranjería',
    content: 'After visa approval, we assist you in obtaining your Cédula de extranjería, ensuring you meet all requirements and understand next steps.',
  },
];

// Tab Button Component
const TabButton = ({ id, active, onClick, children }) => (
  <li className="me-2" role="presentation">
    <button
      className={`inline-block p-1 md:p-4 border-b-2 rounded-t-lg ${
        active
          ? 'text-secondary border-secondary hover:text-secondary/80'
          : 'text-gray-500 hover:text-gray-600 hover:border-primary'
      }`}
      onClick={() => onClick(id)}
      type="button"
      role="tab"
      aria-controls={id}
      aria-selected={active}
    >
      {children}
    </button>
  </li>
);

// Pricing Section Component
const PricingSection = () => (
  <div className="pricing-section">
    <p className="text-primary font-light text-base md:text-lg">
      Our fees for visa services start from <span className="font-semibold">$812,500 COP</span>.
    </p>
    <p className="text-primary font-light text-base md:text-lg">
      We accept credit cards
    </p>
    <p className="text-primary font-light text-base md:text-lg mt-1">
      To get a full detailed quotation, feel free to{' '}
      <a href="#" className="text-terciary underline font-semibold hover:text-terciary/80 transition">
        book an appointment
      </a>
    </p>
  </div>
);

const RealEstateSection = () => {
  const [activeTab, setActiveTab] = useState(TABS.EXPLORE);

  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.EXPLORE:
        return <ExploreProperties />;
      case TABS.SEARCH:
        return <PropertySearchService />;
      case TABS.PROCESS:
        return <InfoSectionSteps sections={STEPS_REAL_ESTATE} />;
      case TABS.FAQS:
        return <AccordionFAQ items={FAQS_REAL_ESTATE} />;
      default:
        return null;
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-12 text-primary">
      <div className="space-y-8">
        <div className="space-y-6">
          <h2 className="text-xl text-secondary md:text-3xl font-bold mb-8 md:text-terciary">Real Estate</h2>
          
          <div className="intro-text">
            <p className='font-light text-md md:text-xl text-primary text-justify mb-4'>If you are planning to buy a finca, an apartment, or any real estate property in Colombia, it's important to know that the process is quite different from that in the USA, Europe, and other countries.</p>
            <p className='font-light text-md md:text-xl text-primary text-justify mb-4'>In Colombia, the absence of escrow accounts, the notarial and registration rules, and our own negotiation culture, can be challenging sometimes.</p>
            <p className='font-light text-md md:text-xl text-primary text-justify mb-4'>Here, you'll find a common version of how this process goes.</p>
            <p className='font-light text-md md:text-xl text-primary text-justify mb-4'>However, keep in mind that the actual process can vary depending on specific circumstances.</p>
          </div>
        </div>

        <div className="tabs-section">
          <ul className="flex flex-wrap -mb-px text-sm md:text-lg text-center border-b border-gray-200" role="tablist">
            <TabButton id={TABS.EXPLORE} active={activeTab === TABS.EXPLORE} onClick={setActiveTab}>
              Explore
            </TabButton>
            <TabButton id={TABS.SEARCH} active={activeTab === TABS.SEARCH} onClick={setActiveTab}>
              Property Search
            </TabButton>
            <TabButton id={TABS.PROCESS} active={activeTab === TABS.PROCESS} onClick={setActiveTab}>
              The Process
            </TabButton>
            <TabButton id={TABS.FAQS} active={activeTab === TABS.FAQS} onClick={setActiveTab}>
              FAQs
            </TabButton>
          </ul>

          <div className="tab-content" role="tabpanel">
            {renderTabContent()}
          </div>
        </div>

      </div>
    </section>
  );
};

export default RealEstateSection;