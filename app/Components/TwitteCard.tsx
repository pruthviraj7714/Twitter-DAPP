import { TweetProps } from "@/types/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface TweetCardProps {
  tweet: TweetProps;
  onLike: () => void;
  onUnlike: () => void;
}

export default function TweetCard({ tweet, onLike, onUnlike }: TweetCardProps) {
  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <p className="text-sm text-gray-500 mb-2">
          Tweet ID: {tweet.id.toString()}
        </p>
        <p>{tweet.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onLike}
          className="flex items-center"
        >
          <ThumbsUp className="mr-2 h-4 w-4" />
          Like ({tweet.likes.toString()})
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onUnlike}
          className="flex items-center"
        >
          <ThumbsDown className="mr-2 h-4 w-4" />
          Unlike
        </Button>
      </CardFooter>
    </Card>
  );
}

