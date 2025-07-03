import { useState } from "react";

interface TeamMember {
  id: string;
  data: {
    name: string;
    role: string;
    email: string;
    bio: string;
    image?: string;
    socialLinks: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
    };
  };
}

interface TeamSectionProps {
  members: TeamMember[];
}

const TeamSection = ({ members }: TeamSectionProps) => {
  // Use the first member as the default selected member
  const [selectedMember, setSelectedMember] = useState<TeamMember>(members[0]);

  return (
    <section className="py-8 max-w-6xl mx-auto">
      <div className="flex gap-6 mb-8">
        {/* Active Card */}
        <div className="w-auto md:w-1/4 flex-1 bg-secondary rounded-lg shadow-md p-4">        
          <h3 className="text-xl font-semibold text-primary h-16">{selectedMember.data.name}</h3>
          <p className="text-gray-100">{selectedMember.data.role}</p>
          <p className="text-sm text-gray-100">{selectedMember.data.email}</p>
          <div className="flex gap-2 mt-4">
            {selectedMember.data.socialLinks.facebook && (
              <a
                href={selectedMember.data.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-300 w-6 h-6 rounded-full"
              ></a>
            )}
            {selectedMember.data.socialLinks.twitter && (
              <a
                href={selectedMember.data.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-300 w-6 h-6 rounded-full"
              ></a>
            )}
            {selectedMember.data.socialLinks.linkedin && (
              <a
                href={selectedMember.data.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-300 w-6 h-6 rounded-full"
              ></a>
            )}
          </div>
        </div>

        {/* Biography Box */}
        <div className="w-auto md:w-3/4 flex-2 bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-800">{selectedMember.data.bio}</p>
        </div>
      </div>

      {/* Lower Cards */}
      <div className="grid grid-cols-1 md:flex gap-4">
        {members.map((member: TeamMember) => (
          <div
            key={member.id}
            className={`flex-1 cursor-pointer border rounded-lg shadow-md p-4 hover:bg-gray-100 transition ${
              selectedMember.id === member.id ? "border-secondary" : "border-gray-300"
            }`}
            onClick={() => setSelectedMember(member)}
          >
            {/* <img
              src={member.data.image}
              alt={member.data.name}
              className="rounded-lg mb-2"
            /> */}
            <h4 className="text-lg font-semibold text-primary">{member.data.name}</h4>
            <p className="text-sm text-gray-600">{member.data.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;