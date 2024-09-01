import React from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import AirDrop from './AirDrop';
import '@solana/wallet-adapter-react-ui/styles.css';
import Balance from './component/Balance';
import SendToken from './SendToken';
import { useState } from 'react';

function App() {

  const [isSendTokenModalOpen, setIsSendTokenModalOpen] = useState(false);

  const openSendTokenModal = () => setIsSendTokenModalOpen(true);
  const closeSendTokenModal = () => setIsSendTokenModalOpen(false);

  return (
    <ConnectionProvider endpoint={"https://solana-devnet.g.alchemy.com/v2/bN7nlZQIEly-Vv752sdL8zXX4-9Ygd-W"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center space-y-10">
            <div className="flex flex-col items-center space-y-6">
              <div className="flex space-x-4">
                <WalletMultiButton className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform"/>
                <WalletDisconnectButton className="bg-gradient-to-r from-red-500 to-yellow-600 hover:from-red-600 hover:to-yellow-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform"/>
              </div>
            </div>

            <div className="w-full max-w-md flex flex-col space-y-6">
                <AirDrop />
                <Balance />

                <button
                  onClick={openSendTokenModal}
                  className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                >
                  Transaction
                </button>
            </div>
               
            {isSendTokenModalOpen && (
              <SendToken onClose={closeSendTokenModal} />
            )}

          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
