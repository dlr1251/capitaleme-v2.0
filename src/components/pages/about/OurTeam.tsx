import { useState, useEffect } from 'react';
import type { TeamMemberData } from '../../../types/index.ts';

interface OurTeamProps {
  members: TeamMemberData[];
  lang?: 'en' | 'es';
}

const OurTeam = ({ members = [], lang = 'en' }: OurTeamProps) => {
  const [selectedMember, setSelectedMember] = useState<TeamMemberData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isVisible, setIsVisible] = useState(false); // UNUSED - commenting out

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // setIsVisible(true); // UNUSED - commenting out
        }
      },
      { threshold: 0.1 }
    );

    const currentElement = document.querySelector('.team-section');
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  const openModal = (member: TeamMemberData) => {
    setSelectedMember(member);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    document.body.style.overflow = 'unset';
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Use the provided members data, fallback to empty array if none provided
  const teamMembers = members && members.length > 0 ? members : [];

  // If no team members are available, show a message
  if (teamMembers.length === 0) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              {lang === 'en' ? 'Meet Our Team' : 'Conoce Nuestro Equipo'}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {lang === 'en' 
                ? 'Our experienced legal professionals are focused on the bilingual Colombian law practice.'
                : 'Nuestros profesionales legales experimentados están dedicados a ayudarte con cualquier consulta legal.'
              }
            </p>
          </div>
          <div className="text-center text-gray-500">
            <p>{lang === 'en' ? 'Team information is being updated...' : 'La información del equipo se está actualizando...'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            {lang === 'en' ? 'Meet Our Team' : 'Conoce Nuestro Equipo'}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {lang === 'en' 
              ? 'Our experienced legal professionals are dedicated to helping you navigate Colombian law with confidence and expertise.'
              : 'Nuestros profesionales legales experimentados están dedicados a ayudarte a navegar la ley colombiana con confianza y experiencia.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.id || index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
              onClick={() => openModal(member)}
            >
              <div className="relative overflow-hidden h-64">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">
                    {lang === 'en' ? 'Click to learn more' : 'Haz clic para saber más'}
                  </p>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {member.bio}
                </p>
                <div className="flex items-center justify-between">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {member.email}
                    </a>
                  )}
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(member);
                    }}
                  >
                    {lang === 'en' ? 'View Profile' : 'Ver Perfil'} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedMember && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Member image */}
              <div className="relative h-64 md:h-80">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Member info */}
              <div className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {selectedMember.name}
                </h2>
                <p className="text-blue-600 font-semibold text-lg mb-4">
                  {selectedMember.role}
                </p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {lang === 'en' ? 'About' : 'Acerca de'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedMember.bio}
                  </p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {lang === 'en' ? 'Contact Information' : 'Información de Contacto'}
                  </h3>
                  <div className="space-y-2">
                    {selectedMember.email && (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a
                          href={`mailto:${selectedMember.email}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {selectedMember.email}
                        </a>
                      </div>
                    )}
                    {selectedMember.linkedin && (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        <a
                          href={selectedMember.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OurTeam; 