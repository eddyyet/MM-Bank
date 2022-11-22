import React, { createContext, useState, useContext, Dispatch, SetStateAction } from "react";
import { NumericFormat } from 'react-number-format';

/* Balance interface */
export interface BalanceInterface {
  ETD: number;
  MMDinWallet: number;
  MMDinVault: number;
  CMMDinWallet: number;
  CMMDinVault: number;
}

const BalanceContext = createContext({
  balance: {
    ETD: NaN,
    MMDinWallet: NaN,
    MMDinVault: NaN,
    CMMDinWallet: NaN,
    CMMDinVault: NaN} as Partial<BalanceInterface>,
  setBalance: {} as Dispatch<SetStateAction<Partial<BalanceInterface>>>,
});

const BalanceProvider = ({
  children,
  value = {} as BalanceInterface,
}: {
  children: React.ReactNode;
  value?: Partial<BalanceInterface>;
}) => {
  const [balance, setBalance] = useState(value);
  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error("useBalance must be used within a BalanceInterface");
  }
  return context;
};

/* ETD interface */
// const ETDContext = createContext({
//   ETD: NaN as number,
//   setETD: {} as Dispatch<SetStateAction<number>>,
// });

// const ETDProvider = ({
//   children,
//   value = {} as number,
// }: {
//   children: React.ReactNode;
//   value?: number;
// }) => {
//   const [ETD, setETD] = useState(value);
//   return (
//     <ETDContext.Provider value={{ ETD, setETD }}>
//       {children}
//     </ETDContext.Provider>
//   );
// };

// const useETD = () => {
//   const context = useContext(ETDContext);
//   if (!context) {
//     throw new Error("useETD must be used within a ETDInterface");
//   }
//   return context;
// };

function NumberFormatted (props: {value: number}) {
  return <NumericFormat displayType="text" value={props.value} thousandSeparator="," decimalScale={2} />;
}

const ETDtoMMD = 1000;
const MMDtoCMMD = 5;
const InitialCollateralRatio = 1.5;
const MinCollateralRatio = 1.1;

export { BalanceProvider, useBalance, NumberFormatted, ETDtoMMD, MMDtoCMMD, InitialCollateralRatio, MinCollateralRatio };