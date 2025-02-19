import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const Article = ({ id, title, content, translation, comments }) => {
  const [isTranslated, setIsTranslated] = useState(false);
  const [showComments, setShowComments] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(formattedContent);
    console.log("Article content copied!");
  };
  
  const handleTranslate = () => {
    setIsTranslated(!isTranslated);
    console.log("Translate button clicked!");
  };
  
  const handleToggleComments = () => {
    setShowComments(!showComments);
    console.log("Toggle comments button clicked!");
  };
  
  // const formattedContent = content.replace(/\n/g, '  \n');

  return (
    <article
      id={id}
      className="relative p-6 mb-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex justify-between items-center ">
        <h3 className="font-bold text-zinc-500">{title}</h3>
        <div className="flex space-x-4 mt-auto">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            title="Copy content"
            data-tooltip-target="tooltip-copy"
          >
            <div id="tooltip-copy" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                Copy article
                <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M18 3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1V9a4 4 0 0 0-4-4h-3a1.99 1.99 0 0 0-1 .267V5a2 2 0 0 1 2-2h7Z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M8 7.054V11H4.2a2 2 0 0 1 .281-.432l2.46-2.87A2 2 0 0 1 8 7.054ZM10 7v4a2 2 0 0 1-2 2H4v6a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Translate Button */}
          <button
            onClick={handleTranslate}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            title={isTranslated ? "Show original" : "Translate"}
            data-tooltip-target="tooltip-translate"
          >
            <div id="tooltip-translate" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                Show translation
                <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                aria-hidden="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m13 19 3.5-9 3.5 9m-6.125-2h5.25M3 7h7m0 0h2m-2 0c0 1.63-.793 3.926-2.239 5.655M7.5 6.818V5m.261 7.655C6.79 13.82 5.521 14.725 4 15m3.761-2.345L5 10m2.761 2.655L10.2 15"
              />
            </svg>
          </button>

          {/* Comments Button */}
          <button
            onClick={handleToggleComments}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            title={showComments ? "Hide comments" : "Show comments"}
            data-tooltip-target="tooltip-comments"
          >
             <div id="tooltip-comments" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                Show comments
                <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
            <svg
              className="w-6 h-6 text-gray-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4 text-gray-700 transition-all duration-300">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {isTranslated ? (typeof translation === 'string' ? translation : "Translation not available.") : content}
        </ReactMarkdown>
      </div>
      
      {showComments && (
        <div className="mt-4 p-4 bg-gray-100 rounded transition-all duration-300">
          <h3 className="text-lg font-semibold mb-2">Comments & Edits:</h3>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {typeof comments === 'string' ? comments : "No comments or edits available."}
          </ReactMarkdown>
        </div>
      )}
    </article>
  );
};

export default Article;
