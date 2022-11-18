import React, { createContext, useState, useContext, Dispatch, SetStateAction } from "react";

export interface BalanceInterface {
  ETD: number;
  MMDinWallet: number;
  MMDinValut: number;
  CMMDinWallet: number;
  CMMDinValut: number;
}

const BalanceInterface = createContext({
  balance: {} as Partial<BalanceInterface>,
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
    <BalanceInterface.Provider value={{ balance, setBalance }}>
      {children}
    </BalanceInterface.Provider>
  );
};

const useBalance = () => {
  const context = useContext(BalanceInterface);
  if (!context) {
    throw new Error("useBalance must be used within a BalanceInterface");
  }
  return context;
};

export { BalanceProvider, useBalance };