interface StatusBadgeProps {
  status: 'draft' | 'published' | 'archived';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    draft: { backgroundColor: '#F3F4F6', color: '#374151' },
    published: { backgroundColor: '#E6F7F3', color: '#00AA81' },
    archived: { backgroundColor: '#FEF3C7', color: '#B45309' },
  };

  const labels = {
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived',
  };

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
      style={styles[status]}
    >
      {labels[status]}
    </span>
  );
}

