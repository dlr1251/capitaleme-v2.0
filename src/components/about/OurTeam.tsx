import { useState, useEffect } from 'react';
import type { TeamMemberData } from '../../types/index.ts';

interface OurTeamProps {
  members: TeamMemberData[];
  lang?: 'en' | 'es';
}

const OurTeam = ({ members = [], lang = 'en' }: OurTeamProps) => {
  const [selectedMember, setSelectedMember] = useState<TeamMemberData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  

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
              {/* Member Image */}
              <div className="relative h-64 bg-gradient-to-br from-primary/10 to-secondary/10">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {member.name.charAt(0)}
                    </div>
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <p className="text-sm font-medium">
                      {lang === 'en' ? 'Click to learn more' : 'Haz clic para saber más'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Member Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">{member.name}</h3>
                <p className="text-secondary font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm line-clamp-3">{member.bio}</p>
                
                                 {/* Social Links */}
                 {member.linkedin && (
                   <div className="flex space-x-3 mt-4">
                     <a
                       href={member.linkedin}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="text-primary hover:text-secondary transition-colors"
                       onClick={(e) => e.stopPropagation()}
                     >
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                       </svg>
                     </a>
                   </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedMember && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal content */}
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  {selectedMember.image ? (
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {selectedMember.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-primary">{selectedMember.name}</h3>
                    <p className="text-secondary font-medium">{selectedMember.role}</p>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-6">{selectedMember.bio}</p>
                  
                                     {selectedMember.linkedin && (
                     <div className="flex space-x-4">
                       <a
                         href={selectedMember.linkedin}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="inline-flex items-center space-x-2 text-primary hover:text-secondary transition-colors"
                       >
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                           <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                         </svg>
                         <span>LinkedIn</span>
                       </a>
                     </div>
                   )}
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