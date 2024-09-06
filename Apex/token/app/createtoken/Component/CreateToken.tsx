"use client"
import { useRouter } from "next/navigation";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { useState } from "react";

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { fromWeb3JsKeypair, fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import { createSignerFromKeypair } from '@metaplex-foundation/umi';
import { createMetadataAccountV3, CreateMetadataAccountV3InstructionAccounts, CreateMetadataAccountV3InstructionDataArgs } from "@metaplex-foundation/mpl-token-metadata";

import { FaCoins, FaRegFileAlt, FaTag } from 'react-icons/fa';
import { GiToken } from 'react-icons/gi';


const CreateToken = () => {

    const [decimal, setDecimal] = useState(0);
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [uri, setUri] = useState('');
    const connection = new Connection(clusterApiUrl('devnet'),'confirmed');
    const [Mint,setMint] = useState('')
    const router = useRouter()

    const senderpublickkey = "5dNpKu6kH6ojjdLn8zJFzNrLWaKHcUkjkiZ1FZPWNiwH";

    const handleGenerate = async () => {
        try {
            const payer = Keypair.fromSecretKey(Uint8Array.from([
                159, 49, 1, 236, 116, 224, 217, 186, 57, 221, 2, 199, 234, 43, 231, 
                148, 197, 173, 206, 124, 19, 112, 135, 96, 149, 6, 213, 5, 191, 34, 
                50, 78, 131, 232, 222, 114, 45, 222, 69, 65, 2, 191, 224, 246, 118, 
                145, 212, 78, 188, 1, 247, 36, 222, 172, 170, 189, 42, 250, 154, 236, 
                158, 214, 230, 146
            ]));
            

            const mintAuthority = payer.publicKey;
           

            const mint = await createMint(
                connection,
                payer,
                mintAuthority,
                null,
                Number(decimal) 
            );
           
            const mintAddress= mint.toBase58()
            console.log("Mint Address:", mint.toBase58());
            setMint(mint.toBase58())

            await new Promise(resolve => setTimeout(resolve, 2000));

            const tokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                payer,
                mint,
                new PublicKey(senderpublickkey)
            );
            console.log(tokenAccount);
            console.log('Token account to:', tokenAccount.address.toBase58());

            await mintTo(
                connection,
                payer,
                mint,
                tokenAccount.address,
                payer,
                100
            );

            console.log('Minted', 100, 'tokens to', tokenAccount.address.toBase58());

            const umi = createUmi("https://api.devnet.solana.com");
            const keypair = fromWeb3JsKeypair(payer);

            const signer = createSignerFromKeypair(umi, keypair);

            umi.identity = signer;
            umi.payer = signer;

            const onChainData = {
                name:name,
                symbol:symbol,
                uri: uri,
                sellerFeeBasisPoints: 0,
                creators:null,
                collection: null,
                uses: null    
            };
            

            const account: CreateMetadataAccountV3InstructionAccounts = {
                mint: fromWeb3JsPublicKey(mint),
                mintAuthority: signer,
                
            };

            const data: CreateMetadataAccountV3InstructionDataArgs = {
                isMutable: true,
                collectionDetails: null,
                data: onChainData
            };

            const txid = await createMetadataAccountV3(umi, { ...account, ...data }).sendAndConfirm(umi);

            console.log("Here is the txid", txid);

            alert('Token created and minted successfully!');

            const metadata = { name, symbol, uri };
            localStorage.setItem('tokenMetadata', JSON.stringify(metadata));

            
            router.push(`/token?mint=${mintAddress}`)



        } catch (error) {
            
            console.log(error);
            console.error("Error creating mint:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-lg w-full">
                <h1 className="text-3xl font-bold text-center mb-6 text-white flex items-center justify-center">
                    <GiToken className="text-indigo-400 mr-2" />
                    Create Your Solana Token
                </h1>
                <div className="space-y-4">
                    <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 bg-gray-700 text-white">
                        <FaTag className="text-gray-400 mr-3" />
                        <input 
                            type="text" 
                            placeholder="Token Name" 
                            className="w-full focus:outline-none bg-transparent text-white" 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                    <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 bg-gray-700 text-white">
                        <FaCoins className="text-gray-400 mr-3" />
                        <input 
                            type="text" 
                            placeholder="Token Symbol" 
                            className="w-full focus:outline-none bg-transparent text-white" 
                            onChange={(e) => setSymbol(e.target.value)} 
                        />
                    </div>
                    <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 bg-gray-700 text-white">
                        <FaRegFileAlt className="text-gray-400 mr-3" />
                        <input 
                            type="text" 
                            placeholder="Image URL" 
                            className="w-full focus:outline-none bg-transparent text-white" 
                            onChange={(e) => setUri(e.target.value)} 
                        />
                    </div>
                    <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 bg-gray-700 text-white">
                        <FaTag className="text-gray-400 mr-3" />
                        <input 
                            type="number" 
                            placeholder="Decimal" 
                            className="w-full focus:outline-none bg-transparent text-white" 
                            onChange={(e) => setDecimal(Number(e.target.value))} 
                        />
                    </div>
                </div>
                <button 
                    className="mt-6 w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors flex items-center justify-center"
                    onClick={handleGenerate}
                >
                    <GiToken className="mr-2" />
                    Generate Token
                </button>
            </div>
        </div>
    );
}

export default CreateToken;
