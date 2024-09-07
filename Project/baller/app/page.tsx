
import dynamic from "next/dynamic";


export default function Home() {
  const Baller = dynamic(()=>import('./component/Baller'),{
    ssr:false
  })
  return (
    <main className="h-full border-x-gray-800">
      <Baller/>
      
    </main>
  );
}
