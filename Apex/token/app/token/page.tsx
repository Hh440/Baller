"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAccount, getMint } from '@solana/spl-token';
import { Metadata, PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,fetchMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';

const TokenPage = () => {
    const [mintAddress, setMintAddress] = useState('');
    const [tokenBalance, setTokenBalance] = useState(0);
    const [tokenSupply, setTokenSupply] = useState(0);
    const [tokenMetadata, setTokenMetadata] = useState({
        name: '',
        symbol: '',
        uri: ''
    });
    const [copyStatus, setCopyStatus] = useState(''); // To track copy success/failure
    const searchParams = useSearchParams();
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    const umi = createUmi('https://api.devnet.solana.com');

    useEffect(() => {
        const mint = searchParams.get('mint');
        if (mint) {
            setMintAddress(mint);
            fetchTokenDetails(mint);
        }
    }, [searchParams]);

    const fetchTokenDetails = async (mint :string) => {
        try {
            const mintPublicKey = new PublicKey(mint);

            

            // Fetch token supply (mint info)
            const mintInfo = await getMint(connection, mintPublicKey);
            setTokenSupply(Number(mintInfo.supply));

            // Fetch token balance (associated account for mint)
            const associatedAccount = await getAccount(connection, mintPublicKey);
            setTokenBalance(Number(associatedAccount.amount));

           
           


            const mintPublicUmiKey = fromWeb3JsPublicKey(new PublicKey(mint));
            console.log(mintPublicUmiKey)

            // Fetch token supply and decimals using Umi's fetchMint function
            const mintInfoUmi = await fetchMetadata(umi, mintPublicUmiKey);
           
            setTokenMetadata({
                name: mintInfoUmi.name,
                symbol: mintInfoUmi.symbol,
                uri: mintInfoUmi.uri
            });

            console.log(tokenMetadata)







        } catch (error) {
            console.error('Error fetching token details:', error);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(mintAddress);
            setCopyStatus('Mint address copied to clipboard!');
        } catch (error) {
            setCopyStatus('Failed to copy mint address.');
            console.error('Error copying mint address:', error);
        }

        // Clear the message after 3 seconds
        setTimeout(() => setCopyStatus(''), 3000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-lg w-full">
                <h1 className="text-4xl font-bold text-center mb-6 text-white tracking-wide">
                    Token Details
                </h1>
                {mintAddress ? (
                    <div className="text-white space-y-6">
                        <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                            <p className="text-lg font-semibold mb-2">Mint Address:</p>
                            <p className="break-all bg-gray-900 p-3 rounded-md font-mono text-indigo-400">
                                {mintAddress}
                            </p>
                        </div>

                        <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                            <p className="text-lg font-semibold mb-2">Token Supply:</p>
                            <p className="bg-gray-900 p-3 rounded-md font-mono text-green-400">
                                {tokenSupply}
                            </p>
                        </div>

                        <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                            <p className="text-lg font-semibold mb-2">Token Balance:</p>
                            <p className="bg-gray-900 p-3 rounded-md font-mono text-yellow-400">
                                {tokenBalance}
                            </p>
                        </div>

                        {tokenMetadata.name && (
                            <>
                                <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                                    <p className="text-lg font-semibold mb-2">Token Name:</p>
                                    <p className="bg-gray-900 p-3 rounded-md font-mono text-indigo-300">
                                        {tokenMetadata.name}
                                    </p>
                                </div>

                                <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                                    <p className="text-lg font-semibold mb-2">Token Symbol:</p>
                                    <p className="bg-gray-900 p-3 rounded-md font-mono text-pink-400">
                                        {tokenMetadata.symbol}
                                    </p>
                                </div>

                                <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                                    <p className="text-lg font-semibold mb-2">Token URI:</p>
                                    <a
                                        href={tokenMetadata.uri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="break-all bg-gray-900 p-3 rounded-md font-mono text-indigo-400 hover:text-indigo-600 transition"
                                    >
                                        {tokenMetadata.uri}
                                    </a>
                                </div>
                            </>
                        )}

                        <button
                            className="mt-6 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-semibold transition-colors"
                            onClick={handleCopy}
                        >
                            Copy Mint Address
                        </button>
                        {copyStatus && <p className="text-green-400 mt-4 text-center">{copyStatus}</p>}
                    </div>
                ) : (
                    <p className="text-center text-white">No mint address found.</p>
                )}
            </div>
        </div>
    );
};

export default TokenPage;
