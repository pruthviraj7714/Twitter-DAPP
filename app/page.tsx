"use client";

import { useAccount, useWriteContract } from "wagmi";
import { Loader2, Send } from 'lucide-react';
import { WalletOptions } from "./Components/WalletOptions";
import { Account } from "./Components/Account";
import { useEffect, useState } from "react";
import { ABI } from "@/abi";
import { toast } from "sonner";
import { readContract } from "wagmi/actions";
import { config } from "@/config";
import { TweetProps } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TweetCard from "./Components/TwitteCard";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function Home() {
  const { isConnected, address } = useAccount();
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [tweets, setTweets] = useState<TweetProps[]>([]);
  const [tweetContent, setTweetContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isPending, writeContract } = useWriteContract();

  const handleConnectWallet = () => setShowWalletOptions(true);

  const createTweet = async () => {
    if (!tweetContent.trim()) {
      toast.error("Tweet content cannot be empty");
      return;
    }
    try {
      await writeContract({
        abi: ABI,
        address: CONTRACT_ADDRESS,
        functionName: "createTweet",
        args: [tweetContent],
      });
      setTweetContent("");
      toast.success("Tweet created successfully!");
      await fetchTweets();
    } catch (error: any) {
      toast.error(error.message || "Failed to create tweet");
    }
  };

  const likeTweet = async (id: number) => {
    try {
      await writeContract({
        abi: ABI,
        address: CONTRACT_ADDRESS,
        functionName: "likeTweet",
        args: [id, address],
      });
      toast.success("Tweet liked successfully");
      await fetchTweets();
    } catch (error: any) {
      toast.error(error.message || "Failed to like tweet");
    }
  };

  const unlikeTweet = async (id: number) => {
    try {
      await writeContract({
        abi: ABI,
        address: CONTRACT_ADDRESS,
        functionName: "unlikeTweet",
        args: [address, id],
      });
      toast.success("Tweet unliked successfully");
      await fetchTweets();
    } catch (error: any) {
      toast.error(error.message || "Failed to unlike tweet");
    }
  };

  const fetchTweets = async () => {
    if (!address) return;
    setIsLoading(true);
    try {
      const fetchedTweets = await readContract(config, {
        abi: ABI,
        address: CONTRACT_ADDRESS,
        functionName: "getAllTweets",
        args: [address as `0x${string}`],
        account: address,
      });
      setTweets(fetchedTweets as unknown as TweetProps[]);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch tweets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchTweets();
    }
  }, [address]);

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Decentralized Twitter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-center">
            {isConnected ? (
              <Account />
            ) : showWalletOptions ? (
              <WalletOptions />
            ) : (
              <Button onClick={handleConnectWallet} size="lg">
                Connect Wallet
              </Button>
            )}
          </div>

          {isConnected && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">Create a Tweet</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={tweetContent}
                    onChange={(e) => setTweetContent(e.target.value)}
                    placeholder="What's happening?"
                    className="mb-4"
                    rows={4}
                  />
                  <Button
                    onClick={createTweet}
                    disabled={isPending || !tweetContent.trim()}
                    className="w-full"
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Post Tweet
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Your Tweets</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-24">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : tweets.length > 0 ? (
                    tweets.map((tweet: TweetProps) => (
                      <TweetCard
                        key={tweet.id}
                        tweet={tweet}
                        onLike={() => likeTweet(tweet.id)}
                        onUnlike={() => unlikeTweet(tweet.id)}
                      />
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No tweets yet. Be the first to post!</p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

