const ResourcesTOC = ({ 
  data, 
  title = 'Table of Contents', 
  style = {}, 
  listStyle = {}, 
  linkStyle = {} 
}) => (
  <nav style={{ 
    position: 'relative', 
    top: '80px', 
    right: '-20px', 
    width: 'auto', 
    overflowY: 'auto', 
    maxHeight: '90vh', 
    ...style 
  }}>
    <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '600' }}>{title}</h3>
    <ul style={{ listStyle: 'none', padding: 0, ...listStyle }}>
      {data?.map((heading, index) => {
        if (!heading?.slug || !heading?.text) return null;

        const itemStyle = {
          marginLeft: `${(heading.depth - 1) * 1.5}rem`,
          marginBottom: '0.5rem'
        };

        const defaultLinkStyle = {
          color: heading.depth === 1 ? '#000' : '#666',
          fontSize: `${1.1 - heading.depth * 0.1}rem`,
          textDecoration: 'none'
        };

        return (
          <li key={index} style={itemStyle}>
            <a 
              href={`#${heading.slug}`} 
              style={{ ...defaultLinkStyle, ...linkStyle }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              {heading.text}
            </a>
          </li>
        );
      })}
    </ul>
  </nav>
);

export default ResourcesTOC;