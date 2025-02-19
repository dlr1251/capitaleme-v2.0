import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // To support GitHub Flavored Markdown

// Recursive component to render articles
const Article = ({ article }) => (
  <div id={article.name.replace(/\s+/g, '-').toLowerCase()} style={{ marginLeft: '20px' }} className='border rounded p-4 shadow m-4'>
    <h4>{article.name}</h4>
    <ReactMarkdown children={article.content} remarkPlugins={[remarkGfm]} />
  </div>
);

// Recursive component to render sections
const Section = ({ section }) => (
  <div id={section.name.replace(/\s+/g, '-').toLowerCase()} style={{ marginLeft: '20px' }}>
    {section.name && <h3>{section.name}</h3>}
    {section.articles.map((article, index) => (
      <Article key={index} article={article} />
    ))}
  </div>
);

// Recursive component to render chapters
const Chapter = ({ chapter }) => (
  <div id={chapter.name.replace(/\s+/g, '-').toLowerCase()} style={{ marginLeft: '20px' }}>
    {chapter.name && <h2>{chapter.name}</h2>}
    {chapter.sections.map((section, index) => (
      <Section key={index} section={section} />
    ))}
  </div>
);

// Component to render titles
const Title = ({ title }) => (
  <div id={title.name.replace(/\s+/g, '-').toLowerCase()} style={{ marginBottom: '20px' }}>
    <h1>{title.name}</h1>
    {title.chapters.map((chapter, index) => (
      <Chapter key={index} chapter={chapter} />
    ))}
  </div>
);

// Main component to render the entire document
const ArticlesRenderer = ({ data }) => (
  <div>
    {data.map((title, index) => (
      <Title key={index} title={title} />
    ))}
  </div>
);

export default ArticlesRenderer;
