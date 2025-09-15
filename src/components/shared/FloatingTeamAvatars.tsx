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