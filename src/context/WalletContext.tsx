import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type WalletTab = 'package' | 'community';
export type ActivePlan = 'plus' | 'premium' | null;

interface WalletContextValue {
  isOpen: boolean;
  defaultTab: WalletTab;
  openWallet: (tab?: WalletTab) => void;
  closeWallet: () => void;
  activePlan: ActivePlan;
  setActivePlan: (plan: ActivePlan) => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<WalletTab>('package');
  const [activePlan, setActivePlan] = useState<ActivePlan>(null);

  const openWallet = (tab: WalletTab = 'package') => {
    setDefaultTab(tab);
    setIsOpen(true);
  };

  const closeWallet = () => setIsOpen(false);

  return (
    <WalletContext.Provider value={{ isOpen, defaultTab, openWallet, closeWallet, activePlan, setActivePlan }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
