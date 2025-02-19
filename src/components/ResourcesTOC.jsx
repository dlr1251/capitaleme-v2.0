const TOC = ({ data }) => (
  <nav style={{ position: 'fixed', top: '80px', right: '20px', width: '500px', overflowY: 'auto', maxHeight: '90vh' }}>
    <h3 className='text-secondary'>Table of Contents</h3>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {data?.map((title, index) => {
        if (!title?.slug || !title?.text) return null;
        
        // Add indentation and styling based on depth
        const itemStyle = {
          marginLeft: `${(title.depth - 1) * 1.5}rem`,
          marginBottom: '0.5rem'
        };
        
        const linkStyle = {
          color: title.depth === 1 ? '#000' : '#666',
          fontSize: `${1.1 - title.depth * 0.1}rem`,
          textDecoration: 'none'
        };
        
        return (
          <li key={index} style={itemStyle}>
            <a 
              href={`#${title.slug}`}
              style={linkStyle}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              {title.text}
            </a>
          </li>
        );
      })}
    </ul>
  </nav>
);

export default TOC;