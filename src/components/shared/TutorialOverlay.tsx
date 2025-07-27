import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';

interface TutorialStep {
  target?: string; // Ahora puede ser opcional para callouts generales
  content: React.ReactNode;
  title?: string;
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  isOpen: boolean;
  onClose: () => void;
  onFinish: () => void;
}

const ARROW_SIZE = 14;

// Añadir soporte para mostrar el tooltip a la izquierda o derecha si no cabe arriba/abajo
type Placement = 'bottom'|'top'|'left'|'right'|'center';
const getTooltipPosition = (rect: DOMRect, tooltipWidth: number, tooltipHeight: number): {top: number, left: number, arrowLeft: number, arrowTop: number, placement: Placement} => {
  const margin = 10;
  const placements: Array<Placement> = ['bottom', 'top', 'right', 'left'];
  for (const placement of placements) {
    if (placement === 'bottom' && rect.bottom + tooltipHeight + ARROW_SIZE < window.innerHeight - margin) {
      const left = Math.max(margin, Math.min(rect.left + window.scrollX + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - margin));
      return {
        top: rect.top + window.scrollY + rect.height + ARROW_SIZE,
        left,
        arrowLeft: rect.left + window.scrollX + rect.width / 2 - left - ARROW_SIZE / 2,
        arrowTop: -ARROW_SIZE,
        placement: 'bottom',
      };
    }
    if (placement === 'top' && rect.top - tooltipHeight - ARROW_SIZE > margin) {
      const left = Math.max(margin, Math.min(rect.left + window.scrollX + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - margin));
      return {
        top: rect.top + window.scrollY - tooltipHeight - ARROW_SIZE,
        left,
        arrowLeft: rect.left + window.scrollX + rect.width / 2 - left - ARROW_SIZE / 2,
        arrowTop: tooltipHeight,
        placement: 'top',
      };
    }
    if (placement === 'right' && rect.right + tooltipWidth + ARROW_SIZE < window.innerWidth - margin) {
      const top = Math.max(margin, Math.min(rect.top + window.scrollY + rect.height / 2 - tooltipHeight / 2, window.innerHeight - tooltipHeight - margin));
      return {
        top,
        left: rect.right + window.scrollX + ARROW_SIZE,
        arrowLeft: -ARROW_SIZE,
        arrowTop: rect.top + window.scrollY + rect.height / 2 - top - ARROW_SIZE / 2,
        placement: 'right',
      };
    }
    if (placement === 'left' && rect.left - tooltipWidth - ARROW_SIZE > margin) {
      const top = Math.max(margin, Math.min(rect.top + window.scrollY + rect.height / 2 - tooltipHeight / 2, window.innerHeight - tooltipHeight - margin));
      return {
        top,
        left: rect.left + window.scrollX - tooltipWidth - ARROW_SIZE,
        arrowLeft: tooltipWidth,
        arrowTop: rect.top + window.scrollY + rect.height / 2 - top - ARROW_SIZE / 2,
        placement: 'left',
      };
    }
  }
  // Default: center
  return {
    top: window.innerHeight / 2 - tooltipHeight / 2,
    left: window.innerWidth / 2 - tooltipWidth / 2,
    arrowLeft: 0,
    arrowTop: 0,
    placement: 'center',
  };
};

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  steps,
  isOpen,
  onClose,
  onFinish
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [tooltipPos, setTooltipPos] = useState<{top: number, left: number, arrowLeft: number, arrowTop: number, placement: 'bottom'|'top'|'left'|'right'|'center'}>({top: 0, left: 0, arrowLeft: 0, arrowTop: 0, placement: 'center'});
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Scroll to target and calculate tooltip position usando Floating UI
  useEffect(() => {
    if (!isOpen) return;
    const step = steps[currentStep];
    if (!step.target) {
      setTooltipPos({
        top: window.innerHeight / 2 - 120,
        left: window.innerWidth / 2 - 180,
        arrowLeft: 0,
        arrowTop: 0,
        placement: 'center',
      });
      return;
    }
    let attempts = 0;
    let cleanup: (() => void) | undefined;
    function tryPositionTooltip() {
      if (!step.target) return;
      const el = document.querySelector(step.target);
      const targetElement = el instanceof HTMLElement ? el : null;
      const tooltipEl = overlayRef.current;
      if (targetElement && tooltipEl && targetElement.offsetWidth > 0 && targetElement.offsetHeight > 0) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          // Usar Floating UI para calcular la posición
          cleanup = autoUpdate(targetElement, tooltipEl, () => {
            computePosition(targetElement, tooltipEl, {
              placement: 'bottom',
              middleware: [offset(12), flip(), shift({ padding: 8 })],
            }).then(({ x, y, placement }) => {
              setTooltipPos({
                top: y,
                left: x,
                arrowLeft: 0, // Arrow se puede mejorar luego
                arrowTop: 0,
                placement: placement as any,
              });
            });
          });
        }, 350);
      } else if (attempts < 10) {
        attempts++;
        setTimeout(tryPositionTooltip, 100);
      } else {
        setTooltipPos({
          top: window.innerHeight / 2 - 120,
          left: window.innerWidth / 2 - 180,
          arrowLeft: 0,
          arrowTop: 0,
          placement: 'center',
        });
      }
    }
    tryPositionTooltip();
    return () => {
      if (cleanup) cleanup();
    };
  }, [currentStep, isOpen, steps, windowWidth]);

  // Recalcular posición en scroll/resize usando Floating UI
  useEffect(() => {
    if (!isOpen) return;
    const step = steps[currentStep];
    if (!step.target) return;
    const el = document.querySelector(step.target);
    const targetElement = el instanceof HTMLElement ? el : null;
    const tooltipEl = overlayRef.current;
    let cleanup: (() => void) | undefined;
    if (targetElement && tooltipEl && targetElement.offsetWidth > 0 && targetElement.offsetHeight > 0) {
      cleanup = autoUpdate(targetElement, tooltipEl, () => {
        computePosition(targetElement, tooltipEl, {
          placement: 'bottom',
          middleware: [offset(12), flip(), shift({ padding: 8 })],
        }).then(({ x, y, placement }) => {
          setTooltipPos({
            top: y,
            left: x,
            arrowLeft: 0,
            arrowTop: 0,
            placement: placement as any,
          });
        });
      });
    }
    return () => {
      if (cleanup) cleanup();
    };
  }, [isOpen, currentStep, steps]);

  if (!isOpen) return null;

  // Mostrar mensaje de error si el target no existe
  const currentStepData = steps[currentStep];
  let targetElement: HTMLElement | null = null;
  if (currentStepData.target) {
    const el = document.querySelector(currentStepData.target);
    targetElement = el instanceof HTMLElement ? el : null;
  }
  const showTooltip = !currentStepData.target || (targetElement && targetElement.offsetWidth > 0 && targetElement.offsetHeight > 0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  // Highlight position
  const getTargetPosition = () => {
    if (!targetElement) return { top: 0, left: 0, width: 0, height: 0 };
    const rect = targetElement.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height
    };
  };
  const position = getTargetPosition();

  // Mobile: center tooltip, no highlight
  const isMobile = windowWidth < 640;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300"
        onClick={handleSkip}
      />
      {/* Highlight overlay (desktop only, if target) */}
      {!isMobile && targetElement && (
        <div
          className="absolute border-2 border-primary rounded-lg shadow-lg transition-all duration-300"
          style={{
            top: position.top - 6,
            left: position.left - 6,
            width: position.width + 12,
            height: position.height + 12,
            boxShadow: '0 0 0 6px rgba(59,130,246,0.08)',
            zIndex: 51
          }}
        >
          <div className="absolute inset-0 bg-primary bg-opacity-5 rounded-lg pointer-events-none" />
        </div>
      )}
      {/* Tooltip */}
      <div
        ref={overlayRef}
        className={`absolute bg-white rounded-xl shadow-2xl border border-gray-200 p-6 max-w-xs w-[360px] transition-all duration-300 ${isMobile ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' : ''}`}
        style={
          isMobile
            ? { zIndex: 52 }
            : { top: tooltipPos.top, left: tooltipPos.left, zIndex: 52 }
        }
      >
        {/* Arrow (desktop only, if target) */}
        {!isMobile && currentStepData.target && tooltipPos.placement !== 'center' && showTooltip && (
          <div
            className="absolute"
            style={{
              left: tooltipPos.placement === 'top' || tooltipPos.placement === 'bottom' ? tooltipPos.arrowLeft : tooltipPos.placement === 'right' ? -ARROW_SIZE : tooltipPos.arrowLeft,
              top: tooltipPos.placement === 'bottom' ? -ARROW_SIZE : tooltipPos.placement === 'top' ? 160 : tooltipPos.arrowTop,
              width: ARROW_SIZE,
              height: ARROW_SIZE,
              zIndex: 53
            }}
          >
            <svg width={ARROW_SIZE} height={ARROW_SIZE} viewBox={`0 0 ${ARROW_SIZE} ${ARROW_SIZE}`}>
              {tooltipPos.placement === 'bottom' && (
                <polygon points={`0,${ARROW_SIZE} ${ARROW_SIZE / 2},0 ${ARROW_SIZE},${ARROW_SIZE}`} fill="#2563eb" className="text-primary" />
              )}
              {tooltipPos.placement === 'top' && (
                <polygon points={`0,0 ${ARROW_SIZE / 2},${ARROW_SIZE} ${ARROW_SIZE},0`} fill="#2563eb" className="text-primary" />
              )}
              {tooltipPos.placement === 'right' && (
                <polygon points={`0,0 ${ARROW_SIZE},${ARROW_SIZE / 2} 0,${ARROW_SIZE}`} fill="#2563eb" className="text-primary" />
              )}
              {tooltipPos.placement === 'left' && (
                <polygon points={`${ARROW_SIZE},0 ${ARROW_SIZE},${ARROW_SIZE} 0,${ARROW_SIZE / 2}`} fill="#2563eb" className="text-primary" />
              )}
            </svg>
          </div>
        )}
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span className="text-sm font-medium text-gray-500">
              Paso {currentStep + 1} de {steps.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Cerrar tutorial"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        {/* Content */}
        <div className="mb-6">
          {currentStepData.title && (
            <h3 className="font-semibold text-primary mb-2">
              {currentStepData.title}
            </h3>
          )}
          <div className="text-gray-700 text-base">
            {showTooltip ? currentStepData.content : (
              <span className="text-red-600">No se encontró el elemento objetivo para este paso del tutorial.</span>
            )}
          </div>
        </div>
        {/* Navigation */}
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center gap-1 px-3 py-2 text-sm rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-primary hover:bg-primary/10'
            }`}
            aria-label="Anterior"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Atrás
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
          >
            {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
            {currentStep < steps.length - 1 && <ChevronRightIcon className="w-4 h-4" />}
          </button>
        </div>
        {/* Botón Saltar tutorial en mobile */}
        {isMobile && (
          <button
            onClick={handleSkip}
            className="fixed left-1/2 bottom-6 -translate-x-1/2 px-6 py-3 bg-gray-900 text-white rounded-full shadow-lg text-base font-semibold z-50 focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ minWidth: 200 }}
            aria-label="Saltar tutorial"
          >
            Saltar tutorial
          </button>
        )}
      </div>
    </div>
  );
};

export default TutorialOverlay; 