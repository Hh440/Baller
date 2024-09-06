import { Suspense } from "react";
import TokenDetails from "./component/TokenDetails";

const TokenPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            <Suspense fallback={<p className="text-white">Loading...</p>}>
                <TokenDetails />
            </Suspense>
        </div>
    );
};

export default TokenPage;
