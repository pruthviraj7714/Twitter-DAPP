"use client";

import { useAccount, useConnect, useWriteContract } from "wagmi";
import { Heart, Loader2, Send } from "lucide-react";
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

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function Home() {
  const { isConnected, address } = useAccount();
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [tweets, setTweets] = useState<TweetProps[]>([]);
  const [tweetContent, setTweetContent] = useState("");
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isPending, writeContract } = useWriteContract();
  const { connectors, connect } = useConnect();

  const handleConnectWallet = () => setShowWalletOptions(true);

  const createTweet = async () => {
    if (!tweetContent.trim()) {
      toast.error("Tweet content cannot be empty");
      return;
    }
    try {
       writeContract({
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
      writeContract({
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
    const tweetIndex = tweets.findIndex((t) => t.id === id);
    if (tweetIndex === -1) {
      toast.error("Tweet not found!");
      return;
    } else {
      if (tweets[tweetIndex].likes <= 0) {
        toast.error("Unable to unlike this tweet", {
          description: "This tweet has no likes to remove.",
        });
        return;
      }
    }
    try {
      writeContract({
        abi: ABI,
        address: CONTRACT_ADDRESS,
        functionName: "unlikeTweet",
        args: [address, id],
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to unlike tweet");
    }
  };

  const fetchTotalLikes = async () => {
    try {
      const totalLikes = await readContract(config, {
        abi: ABI,
        functionName: "getTotalLikes",
        address: CONTRACT_ADDRESS,
        args: [address],
        account: address,
      });
      setTotalLikes(totalLikes as unknown as number);
    } catch (error : any) {
      toast.error("Error while fetching tweets", {
        description : error.message
      })
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
      fetchTotalLikes();
    }
  }, [address]);

  return (
    <main className="flex justify-center items-center min-h-screen bg-black p-4">
      <Card className="w-full max-w-4xl bg-black">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-white">
            Decentralized Twitter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-center">
            {isConnected ? (
              <Account />
            ) : showWalletOptions ? (
              connectors
                .filter((connector) => connector.name === "MetaMask")
                .map((connector) => (
                  <Button
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    MetaMask
                  </Button>
                ))
            ) : (
              <Button
                onClick={handleConnectWallet}
                className="bg-sky-500 hover:bg-sky-600"
                size="lg"
              >
                Connect Wallet
              </Button>
            )}
          </div>

          {isConnected && (
            <>
              <Card className="mb-6 bg-black !border-none">
                <CardHeader>
                  <CardTitle className="text-xl text-white ">
                    Create a Tweet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={tweetContent}
                    onChange={(e) => setTweetContent(e.target.value)}
                    placeholder="What's happening?"
                    className="mb-4 bg-black placeholder:text-white/55 text-white"
                    rows={4}
                  />
                  <Button
                    onClick={createTweet}
                    disabled={isPending || !tweetContent.trim()}
                    className="w-full !bg-sky-500 hover:!bg-sky-600"
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

              <Card className="bg-black !border-none">
                <CardHeader>
                  <CardTitle className="text-xl text-white">
                    Your Tweets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1.5 mb-5">
                    <Heart className="size-5 text-sky-500 fill-sky-500" />{" "}
                    <span className="font-bold text-white">
                      Total Likes : {totalLikes}
                    </span>{" "}
                  </div>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-24">
                      <Loader2 className="animate-spin size-10 text-sky-500" />
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
                    <p className="text-center text-gray-500">
                      No tweets yet. Be the first to post!
                    </p>
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
