import { Outlet } from 'react-router';
import { UserBottomNavigation } from './UserBottomNavigation';
import { WalletProvider } from '../context/WalletContext';
import { SagiWalletModal } from './SagiWalletModal';

export function UserRoot() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-background">
        <Outlet />
        <UserBottomNavigation />
      </div>
      <SagiWalletModal />
    </WalletProvider>
  );
}
