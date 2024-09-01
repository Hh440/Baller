import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

const AirDrop = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState(0);

    const sendAirDrop = async () => {
        await connection.requestAirdrop(wallet.publicKey, amount * 1000000000);
        alert(`${amount} SOL Dropped`);
    }

    return (
        <div className="flex justify-center space-x-3 mt-6">
            <input 
                type="text" 
                placeholder="Enter amount" 
                className="bg-gray-800 text-white placeholder-gray-400 py-2 px-4 rounded-lg shadow-md border-2 border-transparent focus:border-blue-500 focus:outline-none transition-all duration-300"
                onChange={(e) => setAmount(e.target.value)} 
            />
            <button 
                onClick={sendAirDrop} 
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
            >
                Send Airdrop
            </button>
        </div>
    )
}

export default AirDrop;
