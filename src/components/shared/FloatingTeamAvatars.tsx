import React, { useState } from 'react';
import type { TeamMemberData } from '../../types/index.ts';

interface FloatingTeamAvatarsProps {
  teamMembers: TeamMemberData[];
  lang?: 'en' | 'es';
}

const FloatingTeamAvatars = ({ teamMembers = [], lang = 'en' }: FloatingTeamAvatarsProps) => {
  const [selectedMember, setSelectedMember] = useState<TeamMemberData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add safety check for undefined or null teamMembers
  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="text-center text-gray-500 py-8">
          <p>{lang === 'en' ? 'No team members available at the moment.' : 'No hay miembros del equipo disponibles en este momento.'}</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="w-full">
      {/* Floating Avatars Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <div
            key={member.id || index}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-110 hover:-translate-y-2"
            onClick={() => openModal(member)}
          >
            {/* Avatar Container */}
            <div className="relative">
              {/* Avatar Image */}
              <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:shadow-lg transition-all duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
                            
              
              {/* Name - Always Visible */}
              <div className="mt-3 text-center">
                <p className="text-sm md:text-base font-semibold text-primary">
                  {member.name}
                </p>
              </div>
            </div>
            
            {/* Role (visible on larger screens) */}
            <div className="mt-2 text-center">
              <p className="text-xs md:text-sm text-gray-600 font-medium">
                {member.role}
              </p>
            </div>
          </div>
        ))}
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
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-2 shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal content */}
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
                  {/* Member Image */}
                  <div className="w-24 h-24 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-primary/20">
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Member Info */}
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                      {selectedMember.name}
                    </h3>
                    <p className="text-secondary font-medium text-lg mb-2">
                      {selectedMember.role}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {selectedMember.email}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <div className="max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-6 text-base">
                    {selectedMember.bio}
                  </p>
                  
                  {/* Social Links */}
                  {selectedMember.socialLinks && (
                    <div className="flex justify-center md:justify-start space-x-4 pt-4 border-t border-gray-200">
                      {selectedMember.socialLinks.linkedin && (
                        <a
                          href={selectedMember.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-primary hover:text-secondary transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                          </svg>
                          <span>LinkedIn</span>
                        </a>
                      )}
                      
                      {selectedMember.socialLinks.facebook && (
                        <a
                          href={selectedMember.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-primary hover:text-secondary transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                          </svg>
                          <span>Facebook</span>
                        </a>
                      )}
                      
                      {selectedMember.socialLinks.twitter && (
                        <a
                          href={selectedMember.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-primary hover:text-secondary transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                          <span>Twitter</span>
                        </a>
                      )}
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

export default FloatingTeamAvatars; 