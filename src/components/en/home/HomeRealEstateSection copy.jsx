import React, { useState } from 'react';
import InfoSectionSteps from '../InfoSectionSteps';
import PropertySearchService from '../real-estate/PropertySearchService';
import ExploreProperties from './ExploreProperties';
import AccordionFAQ from '../../AccordionFAQ';

const stepsRealEstate = [
  {
    title: 'Timing & Banking',
    content:
      'Once you have found your dream property and before sending a written offer (which could be legally binding), you want to make sure that you have the available funds in Colombia and properly registered before the Central Bank. The process of bringing funds to Colombia implies (normally) opening a brokerage account with a local financial institution who will buy your foreign currency and exchange it to local currency. This is done by submitting some forms, information and documents to the institution. This should take one week.',
  },
  {
    title: 'Due Diligence',
    content:
      'Some properties may have mortgages, probate issues, liens, or other legal encumbrances that sellers or their representatives could forget to disclose upfront. To confirm this information, it’s important to perform a title search. This involves a thorough review of relevant documents, such as previous deeds, the ownership certificate, the seller’s background, and HOA rules. This review provides peace of mind, ensuring that the property has no legal restrictions and can be transferred to you without issues. Additionally, findings from the title search may present new points for negotiation with the seller.',
  },
  {
    title: 'Prep Docs',
    content:
      'Due to the lack of a widespread use of an escrow account, Colombians use a contract called “Promesa de Compraventa” to ensure the deal and to penalize the party who withdraws from the deal without a reason. This contract is a private document that will set all the essential points of the deal: Price, payment structure, delivery date, and related obligations. It will also set a date, time and notary in which the deeds will get signed.',
  },
  {
    title: 'Process Monitoring',
    content:
      'We keep you updated on every step of the application status and handle any follow-ups with the immigration authority.',
  },
  {
    title: 'Approval & Issuance',
    content:
      'Once your visa is approved, we verify all documentation, guide you through final payments, and confirm the details of your visa.',
  },
  {
    title: 'Cédula de extranjería',
    content:
      'After visa approval, we assist you in obtaining your Cédula de extranjería, ensuring you meet all requirements and understand next steps.',
  },
];

const faqsRealEstate = [
  {
    title: 'How much does it cost?',
    content:
      'Depending on the visa category, it can range from $99 USD to $380 USD',
  },
  {
    title: 'How long does it take?',
    content:
      'Depending on your needs (e.g., salvoconducto, permit extension), we devise a tailored legal strategy for your application.',
  },
  {
    title: 'Application Submition',
    content:
      'We handle the submission process of your application and coordinate any associated payments, ensuring accuracy and efficiency.',
  },
  {
    title: 'Process Monitoring',
    content:
      'We keep you updated on every step of the application status and handle any follow-ups with the immigration authority.',
  },
  {
    title: 'Approval & Issuance',
    content:
      'Once your visa is approved, we verify all documentation, guide you through final payments, and confirm the details of your visa.',
  },
  {
    title: 'Cédula de extranjería',
    content:
      'After visa approval, we assist you in obtaining your Cédula de extranjería, ensuring you meet all requirements and understand next steps.',
  },
];

const RealEstateSection = () => {
  // Use state to manage which tab is active
  const [activeTab, setActiveTab] = useState('explore-properties');

  // A helper to generate tab button classes based on whether the tab is active
  const tabButtonClasses = (tabId) =>
    activeTab === tabId
      ? 'inline-block p-1 md:p-4 border-b-2 rounded-t-lg text-secondary border-secondary hover:text-secondary/80'
      : 'inline-block p-1 md:p-4 border-b-2 rounded-t-lg text-gray-500 hover:text-gray-600 hover:border-primary';

  return (
    <div className="w-auto mx-6 md:w-2/3 md:mx-auto md:max-w-5xl mt-12">
      <div className="text-3xl font-bold mt-16 mb-4 text-terciary">Real Estate</div>
      <p className="font-light text-xl text-primary text-justify">
        If you are planning to buy a finca, an apartment, or any real estate property in Colombia, it's important to know that the process is quite different from that in the USA, Europe, and other countries.
      </p>
      <p className="font-light text-xl text-primary text-justify">
        In Colombia, the absence of escrow accounts, the notarial and registration rules, and our own negotiation culture, can be challenging sometimes.
      </p>
      <p className="font-light text-xl text-primary text-justify">
        Here, you'll find a common version of how this process goes.
      </p>
      <p className="font-light text-xl text-primary text-justify">
        However, keep in mind that the actual process can vary depending on specific circumstances.
      </p>

      {/* Tab buttons */}
      <div className="my-4 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-lg font-medium text-center" role="tablist">
          <li className="me-2" role="presentation">
            <button
              className={tabButtonClasses('explore-properties')}
              onClick={() => setActiveTab('explore-properties')}
              type="button"
              role="tab"
              aria-controls="explore-properties"
              aria-selected={activeTab === 'explore-properties'}
            >
              Explore Properties
            </button>
          </li>
          <li className="me-2" role="presentation">
            <button
              className={tabButtonClasses('property-search')}
              onClick={() => setActiveTab('property-search')}
              type="button"
              role="tab"
              aria-controls="property-search"
              aria-selected={activeTab === 'property-search'}
            >
              Property Search Service
            </button>
          </li>
          <li className="me-2" role="presentation">
            <button
              className={tabButtonClasses('real-estate-process')}
              onClick={() => setActiveTab('real-estate-process')}
              type="button"
              role="tab"
              aria-controls="real-estate-process"
              aria-selected={activeTab === 'real-estate-process'}
            >
              The Process
            </button>
          </li>
          <li className="me-2" role="presentation">
            <button
              className={tabButtonClasses('real-estate-faqs')}
              onClick={() => setActiveTab('real-estate-faqs')}
              type="button"
              role="tab"
              aria-controls="real-estate-faqs"
              aria-selected={activeTab === 'real-estate-faqs'}
            >
              FAQs
            </button>
          </li>
        </ul>
      </div>

      {/* Tab content */}
      <div id="real-estate-tab-content">
        {activeTab === 'explore-properties' && (
          <div className="rounded-lg" id="explore-properties" role="tabpanel" aria-labelledby="explore-properties-tab">
            <ExploreProperties />
          </div>
        )}
        {activeTab === 'property-search' && (
          <div className="rounded-lg" id="property-search" role="tabpanel" aria-labelledby="property-search-tab">
            <PropertySearchService />
          </div>
        )}
        {activeTab === 'real-estate-process' && (
          <div className="rounded-lg" id="real-estate-process" role="tabpanel" aria-labelledby="real-estate-process-tab">
            <InfoSectionSteps sections={stepsRealEstate} />
          </div>
        )}
        {activeTab === 'real-estate-faqs' && (
          <div className="rounded-lg" id="real-estate-faqs" role="tabpanel" aria-labelledby="real-estate-faqs-tab">
            <AccordionFAQ items={faqsRealEstate} />
          </div>
        )}
      </div>

      {/* Footer section */}
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
      <div className="w-3/4 mx-auto mb-6"></div>
    </div>
  );
};

export default RealEstateSection;
