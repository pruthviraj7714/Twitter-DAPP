"use client";

import { useAccount, useWriteContract } from "wagmi";
import { Loader2 } from "lucide-react";
import { WalletOptions } from "./Components/WalletOptions";
import { Account } from "./Components/Account";
import { useEffect, useState } from "react";
import { ABI } from "@/abi";
import { toast } from "sonner";
import TwitteCard from "./Components/TwitteCard";
import { config } from "@/config";
import { readContract } from "wagmi/actions";

const CONTRACT_ADDRESS =  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function Home() {
  const { isConnected, address } = useAccount();
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [twittes, setTwittes] = useState<any[]>([]);
  const [twitteContent, setTwitteContent] = useState("");
  const { data: hash, isPending, isSuccess, writeContract } = useWriteContract();

  function handleConnectWallet() {
    setShowWalletOptions(true);
  }

  const createTweet = () => {
    try {
       writeContract({
        abi: ABI,
        address: CONTRACT_ADDRESS,
        functionName: "createTweet",
        args: [twitteContent],
        account: address,
      });
      if(isSuccess) {
        toast.success("Tweet successfully Posted!")
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const likeTweet = () => {};

  const fetchTweets = async () => {
    try {
      const tweets = await readContract(config,{
        abi : ABI,
        address : CONTRACT_ADDRESS,
        functionName : "getAllTweets",
        args : [address],
      })
      console.log(tweets);
    } catch (error : any) {
      console.log(error);
      toast.error(error.message);
    }

  };

  useEffect(() => {
    if(address) {
      console.log(address);
      fetchTweets();
    }
  }, [address]);

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <section className="p-8 border border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center shadow-lg min-h-[50vw] mt-5 max-w-4xl w-full bg-white dark:bg-gray-800">
        <div className="mb-5">
          {isConnected ? (
            <Account />
          ) : showWalletOptions ? (
            <WalletOptions />
          ) : (
            <button
              onClick={handleConnectWallet}
              className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-blue-500 hover:to-sky-400 text-white rounded-full px-6 py-2 font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Connect Wallet
            </button>
          )}
        </div>
        <div className="flex flex-col w-full my-5">
          <h1 className="text-2xl font-extrabold text-center text-gray-800 dark:text-gray-200 mb-4">
            Add Tweet 🤩
          </h1>
          <textarea
            onChange={(e) => setTwitteContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-sky-400 focus:outline-none transition-all"
            rows={4}
          />
          <button
            onClick={createTweet}
            disabled={isPending}
            className="self-end mt-4 bg-sky-400 hover:bg-sky-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all"
          >
            {isPending ? (
              <div>
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <span className="">Post</span>
            )}
          </button>
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-extrabold text-center text-gray-800 dark:text-gray-200 mb-4">
            Your Tweet 🤩
          </h1>
          {twittes && twittes.length > 0 ? (
            twittes.map((tweet) => <TwitteCard tweet={tweet} key={tweet.id} />)
          ) : (
            <div>No Tweets are Posted by You Yet! ✉</div>
          )}
        </div>
      </section>
    </main>
  );
}
