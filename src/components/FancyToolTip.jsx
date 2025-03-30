import React, { useState, useRef, useEffect } from 'react';
import { useFloating, offset, flip, shift } from '@floating-ui/react';
import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

const FancyTooltipLink = ({ link, description = "This topic could use more context, for more information click on the link below", children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  const { x, y, reference, floating, strategy } = useFloating({
    strategy: 'fixed', // Change strategy to 'fixed'
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    placement: 'top-start',
  });

  const handleToggleTooltip = (event) => {
    console.log('handleToggleTooltip called - current isOpen:', isOpen);
    setCoords({ x: event.clientX, y: event.clientY });
    setIsOpen((prev) => !prev);
    console.log('handleToggleTooltip - new isOpen:', !isOpen, 'new coords:', { x: event.clientX, y: event.clientY });
  };

  const handleCloseTooltip = () => {
    console.log('handleCloseTooltip called');
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen && tooltipRef.current) {

      tooltipRef.current.style.top = `${coords.y}px`;
      tooltipRef.current.style.left = `${coords.x}px`;
    } else {
      console.log('useEffect - Tooltip is closed or tooltipRef is undefined.');
    }

  }, [isOpen, coords, x, y, strategy, reference]);

  const styles = {
    container: {
      position: 'relative',
      display: 'inline-block',
    },
    link: {
      color: '#007bff',
      cursor: 'pointer',
      textDecoration: 'underline',
      fontSize: '1.125rem',
      fontFamily: '"Outfit", sans-serif',
    },
    panel: {
      position: strategy,
      width: '300px',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      padding: '16px',
      zIndex: 1000,
      fontSize: '13px',
      fontFamily: '"Outfit", sans-serif',
      lineHeight: '1.6',
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    closeButton: {
      backgroundColor: 'transparent',
      color: '#dc3545',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
    },
    newWindowButton: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '6px 12px',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: '4px',
      fontSize: '14px',
    },
    icon: {
      marginRight: '8px',
    },
  };

  return (
    <div style={styles.container}>
      <span
        style={styles.link}
        onClick={handleToggleTooltip}
        ref={reference}
      >
        {children}
      </span>
      {isOpen && (
        <div
          ref={(el) => {
            tooltipRef.current = el;
            if (floating) {
              floating(el);
            }
            console.log('Tooltip ref assigned:', el);
          }}
          style={{
            ...styles.panel,
            top: y !== null ? `${y}px` : '',
            left: x !== null ? `${x}px` : '',
          }}
        >
          <div style={styles.content} dangerouslySetInnerHTML={{ __html: description }} />
          <div style={styles.actions}>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.newWindowButton}
            >
              <FaExternalLinkAlt style={styles.icon} /> Open in new window
            </a>
            <button style={styles.closeButton} onClick={handleCloseTooltip}>
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FancyTooltipLink;
