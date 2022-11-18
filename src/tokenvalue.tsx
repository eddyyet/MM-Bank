import React, { createContext, useState, useContext, Dispatch, SetStateAction } from "react";

export interface BalanceInterface {
  ETD: number;
  MMDinWallet: number;
  MMDinValut: number;
  CMMDinWallet: number;
  CMMDinValut: number;
}

const BalanceContext = createContext({
  balance: {ETD: NaN,
    MMDinWallet: NaN,
    MMDinValut: NaN,
    CMMDinWallet: NaN,
    CMMDinValut: NaN} as Partial<BalanceInterface>,
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

const ETDtoMMD = 1000;
const MMDtoCMMD = 5;

export { BalanceProvider, useBalance, ETDtoMMD, MMDtoCMMD };