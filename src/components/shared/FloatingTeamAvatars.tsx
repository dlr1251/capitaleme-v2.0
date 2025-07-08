import React, { useState } from 'react';
import type { TeamMemberData } from '../../types/index.ts';

interface FloatingTeamAvatarsProps {
  teamMembers: TeamMemberData[];
  lang?: 'en' | 'es';
}

// Helper to order team members as requested
const getOrderedMembers = (teamMembers: TeamMemberData[]) => {
  // You may need to adjust these names/ids to match your data
  const order = [
    // Row 1
    'mafeduarte', 'danielluque',
    // Row 2
    'mateo', 'sara', 'harold',
    // Row 3
    'ferrett',
  ];
  // Try to match by id or fallback to name includes
  return order.map(key =>
    teamMembers.find(m =>
      (m.id && m.id.toLowerCase().includes(key)) ||
      (m.name && m.name.toLowerCase().includes(key))
    )
  ).filter(Boolean) as TeamMemberData[];
};

const FloatingTeamAvatars = ({ teamMembers = [], lang = 'en' }: FloatingTeamAvatarsProps) => {
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMemberData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (teamMembers.length === 0) {
    return null;
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

  // Order members as specified
  const ordered = getOrderedMembers(teamMembers);

  return (
    <>
      <div className="w-full flex flex-col items-center">
        <div className="grid grid-cols-3 gap-8">
          {/* Row 1: Mafe, Daniel (centered, avatars 33% wider) */}
          <div className="col-span-1" />
          <div className="col-span-1 flex justify-center items-center">
            <div className="flex gap-8">
              {ordered[0] && (
                <AvatarCard member={ordered[0]} onClick={openModal} wide />
              )}
              {ordered[1] && (
                <AvatarCard member={ordered[1]} onClick={openModal} wide />
              )}
            </div>
          </div>
          <div className="col-span-1" />

          {/* Row 2: Mateo, Sara, Harold */}
          <div className="col-span-1 flex justify-center items-center">
            {ordered[2] && (
              <AvatarCard member={ordered[2]} onClick={openModal} />
            )}
          </div>
          <div className="col-span-1 flex justify-center items-center">
            {ordered[3] && (
              <AvatarCard member={ordered[3]} onClick={openModal} />
            )}
          </div>
          <div className="col-span-1 flex justify-center items-center">
            {ordered[4] && (
              <AvatarCard member={ordered[4]} onClick={openModal} />
            )}
          </div>

          {/* Row 3: Ferrett centered */}
          <div className="col-span-1" />
          <div className="col-span-1 flex justify-center items-center">
            {ordered[5] && (
              <AvatarCard member={ordered[5]} onClick={openModal} />
            )}
          </div>
          <div className="col-span-1" />
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
                    {selectedMember.phone && (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.2 3.6a1 1 0 01-.21.98l-2.1 2.1a16.001 16.001 0 006.586 6.586l2.1-2.1a1 1 0 01.98-.21l3.6 1.2a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V6a2 2 0 012-2z" />
                        </svg>
                        <a
                          href={`tel:${selectedMember.phone}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {selectedMember.phone}
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
    </>
  );
};

// AvatarCard component for reusability
const AvatarCard = ({ member, onClick, wide = false }: { member: TeamMemberData, onClick: (m: TeamMemberData) => void, wide?: boolean }) => (
  <div
    className="group cursor-pointer flex flex-col items-center"
    onClick={() => onClick(member)}
  >
    <div className={`${wide ? 'w-52 h-40 md:w-[18rem] md:h-48' : 'w-40 h-40 md:w-48 md:h-48'} rounded-lg overflow-hidden border-4 border-white shadow-2xl hover:shadow-3xl transition-all duration-500`}>
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
      />
    </div>
    <div className="mt-4 text-center">
      <div className="text-lg font-semibold text-secondary">{member.name}</div>
      <div className="text-sm text-primary/70">{member.role}</div>
    </div>
  </div>
);

export default FloatingTeamAvatars; 