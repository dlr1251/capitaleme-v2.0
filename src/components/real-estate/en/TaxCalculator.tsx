import { useState } from "react";

interface TaxBracket {
  fromUVT: number;
  toUVT: number | null;
  rate: number;
  base: number;
}

const TaxCalculator = () => {
  const [rentaLiquida, setRentaLiquida] = useState<number>(0);
  const [impuestoTotal, setImpuestoTotal] = useState<number>(0);

  // Constants
  const uvtValue = 47065; // Value of UVT in COP

  // Tax brackets
  const taxBrackets: TaxBracket[] = [
    { fromUVT: 0, toUVT: 1090, rate: 0, base: 0 },
    { fromUVT: 1090, toUVT: 1700, rate: 0.19, base: 0 },
    { fromUVT: 1700, toUVT: 4100, rate: 0.28, base: 116 },
    { fromUVT: 4100, toUVT: 8670, rate: 0.33, base: 788 },
    { fromUVT: 8670, toUVT: 18970, rate: 0.35, base: 2296 },
    { fromUVT: 18970, toUVT: 31000, rate: 0.37, base: 5901 },
    { fromUVT: 31000, toUVT: null, rate: 0.39, base: 10352 },
  ];

  // Function to calculate tax
  const calculateTax = (income: number): number => {
    const incomeUVT = income / uvtValue; // Convert income to UVT
    for (const bracket of taxBrackets) {
      if (
        !bracket.toUVT || // If no upper limit (last bracket)
        (incomeUVT > bracket.fromUVT && incomeUVT <= bracket.toUVT)
      ) {
        const baseTax = bracket.base * uvtValue;
        const marginalTax = bracket.rate
          ? (incomeUVT - bracket.fromUVT) * bracket.rate * uvtValue
          : 0;
        return baseTax + marginalTax;
      }
    }
    return 0;
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setRentaLiquida(value);
    const tax = calculateTax(value);
    setImpuestoTotal(tax);
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h1>Tax Calculator</h1>
      <label htmlFor="renta-liquida">Renta Líquida Gravable (COP): </label>
      <input
        type="number"
        step="1000000"
        id="renta-liquida"
        value={rentaLiquida}
        onChange={handleInputChange}
        style={{ padding: "5px", margin: "10px 0" }}
      />
      <div>
        <h2>Impuesto Total: </h2>
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>${impuestoTotal.toLocaleString("es-CO")}</p>
      </div>
    </div>
  );
};

export default TaxCalculator;
