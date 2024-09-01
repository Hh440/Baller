import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

const Balance = () => {
    const [balance, setBalance] = useState(0);

    const { connection } = useConnection();
    const wallet = useWallet();


    useEffect(()=>{

    const getBalance = async () => {

        if(!wallet.publicKey){
            setBalance(0)
            return
        }

        const balance = await connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
    };
    
    getBalance()

    },[wallet.publicKey,connection])

    

    return (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg text-white w-full">
            <div className="flex justify-between items-center">
                <div className="text-sm font-semibold">SOL Balance</div>
               
            </div>
            <div className="mt-4 text-3xl font-bold">
                {balance.toFixed(2)} SOL
            </div>
            <div className="mt-2 text-xs">
                {wallet.publicKey?.toBase58().slice(0, 8)}...{wallet.publicKey?.toBase58().slice(-8)}
            </div>
        </div>
    );
}

export default Balance;
