import React, { useState } from 'react';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Buffer } from 'buffer';


if (typeof window !== 'undefined') {
    window.Buffer = Buffer;
}

const SendToken = ({ onClose }) => {
    const { connection } = useConnection();
    const [sendPublic, setSendPublic] = useState('');
    const [amount, setAmount] = useState(0);
    const wallet = useWallet();

    const sendToken = async () => {
        try {
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: new PublicKey(sendPublic),
                    lamports: amount * LAMPORTS_PER_SOL
                })
            );

            await wallet.sendTransaction(transaction, connection);
            alert("Sent " + amount + " SOL to " + sendPublic);
            window.location.reload();
            onClose();  
        } catch (error) {
            console.error("Error sending tokens:", error);
            alert("Failed to send SOL. Please check the address and try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-lg shadow-lg text-white w-full max-w-md space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Send SOL</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 text-xl font-semibold"
                    >
                        &times;
                    </button>
                </div>
                <div className="flex flex-col space-y-4">
                    <input 
                        type="text" 
                        placeholder="Recipient Address" 
                        className="bg-gray-800 text-white placeholder-gray-400 py-2 px-4 rounded-lg shadow-md border-2 border-transparent focus:border-blue-500 focus:outline-none transition-all duration-300"
                        onChange={(e) => setSendPublic(e.target.value)} 
                    />
                    <input 
                        type="number" 
                        placeholder="Amount (SOL)" 
                        className="bg-gray-800 text-white placeholder-gray-400 py-2 px-4 rounded-lg shadow-md border-2 border-transparent focus:border-blue-500 focus:outline-none transition-all duration-300"
                        onChange={(e) => setAmount(e.target.value)} 
                    />
                </div>
                <button 
                    onClick={sendToken} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default SendToken;
