'use client'
import { useRouter } from "next/navigation";
import { FaCoins, FaRocket } from 'react-icons/fa';

export default function Home() {

  const router = useRouter()

  const onhandle = () => {
    router.push('/createtoken')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8 flex justify-center items-center">
          <FaRocket className="text-indigo-400 mr-3" />
          Welcome to Solana Token Creator
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          Easily create your own SPL tokens on the Solana blockchain
        </p>
        <button 
          className="flex items-center justify-center px-6 py-3 bg-indigo-500 text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-300 transition-colors"
          onClick={onhandle}
        >
          <FaCoins className="mr-2" />
          Create a Token
        </button>
      </div>
    </div>
  );
}
  