import React, { useState } from 'react';
import InfoSectionSteps from '../InfoSectionSteps';
import PropertySearchService from '../real-estate/PropertySearchService';
import ExploreProperties from './ExploreProperties';
import AccordionFAQ from '../../AccordionFAQ';

// Constants
const TABS = {
  PROCESS: 'real-estate-process',
  EXPLORE: 'explore-properties',
  SEARCH: 'property-search',
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
    content: 'Depending on the property type and complexity, our legal services typically range from $1.5M to $5M COP.'
  },
  {
    title: 'How long does the property buying process take?',
    content: 'The typical timeframe from offer to closing is 4-8 weeks, depending on various factors including property type, financing, and any legal complexities.',
  },
  {
    title: 'What taxes will I pay as a foreigner buying property?',
    content: 'Foreign buyers face the same taxes as Colombians, including property transfer tax (~1.5%), registration fees (~0.5%), and notary fees. Annual property taxes (predial) vary by municipality and property value.',
  },
  {
    title: 'Can foreigners own property in Colombia?',
    content: 'Yes, foreigners have the same property ownership rights as Colombians, with some restrictions in border areas or specific protected zones.',
  },
  {
    title: 'Do I need a visa to buy property in Colombia?',
    content: 'No, you don\'t need a visa to purchase property, though having a Colombian bank account (which may require residency) can simplify the process.',
  },
  {
    title: 'What is a "Promesa de Compraventa"?',
    content: 'This is a binding purchase agreement that outlines the terms of the sale including price, payment schedule, closing date, and contingencies. It\'s a crucial document in Colombian real estate transactions.',
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
  <div className="bg-white p-8 rounded-lg shadow-md mt-8 text-center">
    <p className="text-primary font-light text-base md:text-lg">
      Our fees for real estate legal services start from <span className="font-semibold">$1,500,000 COP</span>.
    </p>
    <p className="text-primary font-light text-base md:text-lg">
      We accept credit cards and international transfers
    </p>
    <p className="text-primary font-light text-base md:text-lg mt-1">
      To get a full detailed quotation for your specific needs, please{' '}
      <a href="/en/contact" className="text-blue-600 underline font-semibold hover:text-blue-800 transition">
        book a consultation
      </a>
    </p>
  </div>
);

const RealEstateSection = () => {
  const [activeTab, setActiveTab] = useState(TABS.PROCESS);

  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.PROCESS:
        return <InfoSectionSteps sections={STEPS_REAL_ESTATE} />;
      case TABS.SEARCH:
        return <PropertySearchService />;
      case TABS.EXPLORE:
        return <ExploreProperties />;      
      case TABS.FAQS:
        return <AccordionFAQ items={FAQS_REAL_ESTATE} />;
      default:
        return null;
    }
  };

  return (
    <section className="bg-gray-50 p-8 rounded-lg shadow-md mt-12 mb-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">Colombian Real Estate Guide</h2>
          
          <div className="intro-text">
            <p className='font-light text-md md:text-lg text-primary text-justify mb-4'>If you are planning to buy a finca, an apartment, or any real estate property in Colombia, it's important to know that the process is quite different from that in the USA, Europe, and other countries.</p>
            <p className='font-light text-md md:text-lg text-primary text-justify mb-4'>In Colombia, the absence of escrow accounts, the notarial and registration rules, and our own negotiation culture, can be challenging sometimes.</p>
            <p className='font-light text-md md:text-lg text-primary text-justify mb-4'>Here, you'll find information about the process, property search tools, and frequently asked questions to help guide your real estate journey in Colombia.</p>
          </div>
        </div>

        <div className="tabs-section">
          <ul className="flex flex-wrap -mb-px text-sm md:text-lg text-center border-b border-gray-200" role="tablist">
            <TabButton id={TABS.PROCESS} active={activeTab === TABS.PROCESS} onClick={setActiveTab}>
              The Process
            </TabButton>
            <TabButton id={TABS.EXPLORE} active={activeTab === TABS.EXPLORE} onClick={setActiveTab}>
              Explore Properties
            </TabButton>
            <TabButton id={TABS.SEARCH} active={activeTab === TABS.SEARCH} onClick={setActiveTab}>
              Property Search
            </TabButton>            
            <TabButton id={TABS.FAQS} active={activeTab === TABS.FAQS} onClick={setActiveTab}>
              FAQs
            </TabButton>
          </ul>

          <div className="tab-content p-4 bg-white rounded-b-lg shadow-sm" role="tabpanel">
            {renderTabContent()}
          </div>
        </div>

        <PricingSection />
      </div>
    </section>
  );
};

export default RealEstateSection;