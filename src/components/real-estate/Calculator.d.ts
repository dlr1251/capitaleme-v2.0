import * as React from 'react';

export interface CalculatorProps {
  initialValue?: number;
  lang?: 'en' | 'es';
}

declare const Calculator: React.FC<CalculatorProps>;
export default Calculator; 