"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';


const TokenPage = () => {
    const [mintAddress, setMintAddress] = useState('');
    const [tokenBalance, setTokenBalance] = useState(0);
    const [tokenSupply, setTokenSupply] = useState(0);
    const [tokenMetadata, setTokenMetadata] = useState({
        name: '',
        symbol: '',
        uri: ''
    });
    const [tokenImage, setTokenImage] = useState(''); 
    const [copyStatus, setCopyStatus] = useState('');
    const searchParams = useSearchParams();
    const connection = new Connection(clusterApiUrl('devnet'), "confirmed");

    useEffect(() => {
        const mint = searchParams.get('mint');
        if (mint) {
            setMintAddress(mint);
            fetchTokenDetails(mint);
        }
    }, [searchParams]);

    useEffect(() => {
        const storedMetadata = localStorage.getItem('tokenMetadata');
        if (storedMetadata && mintAddress) {
            setTokenMetadata(JSON.parse(storedMetadata));
        }
    }, [mintAddress]);

    const fetchTokenDetails = async (mint:string) => {
        try {
            const mintPublicKey = new PublicKey(mint);
            const mintInfo = await getMint(connection, mintPublicKey);
            setTokenSupply(Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals));
            fetchTokenImage(tokenMetadata.uri);
        } catch (error) {
            console.error('Error fetching token details:', error);
        }
    };

    const fetchTokenImage = async (uri:string) => {
        try {
            const response = await fetch(uri);
            const metadata = await response.json();
            setTokenImage(metadata.image);
        } catch (error) {
            console.error('Error fetching token image:', error);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(mintAddress);
            setCopyStatus('Mint address copied to clipboard!');
        } catch (error) {
            setCopyStatus('Failed to copy mint address.');
        }

        setTimeout(() => setCopyStatus(''), 3000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-900 via-black to-gray-800 py-10 px-6">
            <div className="bg-gray-850 rounded-xl shadow-2xl w-full max-w-4xl p-10 shadow-cyan-600">
                <h1 className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600">
                    Token Dashboard
                </h1>

                {mintAddress ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {/* Mint Address */}
                        <div className="p-6 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg shadow-xl">
                            <p className="text-xl font-semibold mb-4">Mint Address</p>
                            <p className="break-words bg-gray-800 p-3 rounded-md font-mono text-indigo-400">
                                {mintAddress}
                            </p>
                            <button
                                className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold transition duration-200"
                                onClick={handleCopy}
                            >
                                Copy Address
                            </button>
                            {copyStatus && <p className="text-green-400 mt-2">{copyStatus}</p>}
                        </div>

                        {/* Token Supply */}
                        <div className="p-6 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg shadow-xl">
                            <p className="text-xl font-semibold mb-4">Token Supply</p>
                            <p className="bg-gray-800 p-3 rounded-md font-mono text-green-400">
                                {tokenSupply}
                            </p>
                        </div>

                        {/* Token Balance */}
                        <div className="p-6 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg shadow-xl">
                            <p className="text-xl font-semibold mb-4">Token Balance</p>
                            <p className="bg-gray-800 p-3 rounded-md font-mono text-yellow-400">
                                {tokenBalance}
                            </p>
                        </div>

                        {tokenMetadata.name && (
                            <>
                                {/* Token Name */}
                                <div className="p-6 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg shadow-xl">
                                    <p className="text-xl font-semibold mb-4">Token Name</p>
                                    <p className="bg-gray-800 p-3 rounded-md font-mono text-indigo-300">
                                        {tokenMetadata.name}
                                    </p>
                                </div>

                                {/* Token Symbol */}
                                <div className="p-6 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg shadow-xl">
                                    <p className="text-xl font-semibold mb-4">Token Symbol</p>
                                    <p className="bg-gray-800 p-3 rounded-md font-mono text-pink-400">
                                        {tokenMetadata.symbol}
                                    </p>
                                </div>

                                {/* Token URI */}
                                <div className="col-span-2 p-6 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg shadow-xl">
                                    <p className="text-xl font-semibold mb-4">Token URI</p>
                                    <a
                                        href={tokenMetadata.uri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="break-words bg-gray-800 p-3 rounded-md font-mono text-indigo-400 hover:text-indigo-600 transition duration-200"
                                    >
                                        {tokenMetadata.uri}
                                    </a>
                                </div>
                            </>
                        )}

                        {/* Token Image */}
                        {tokenImage && (
                            <div className="col-span-2 p-6 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg shadow-xl text-center">
                                <img
                                    src={tokenImage}
                                    alt="Token Image"
                                    className="w-40 h-40 object-cover mx-auto rounded-lg shadow-md"
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-center text-gray-300">No mint address found.</p>
                )}
            </div>
        </div>
    );
};

export default TokenPage;
