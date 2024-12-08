interface TweetProps {
  author: string;
  content: string;
  timestamp: number;
  id: number;
  likes: number;
}

const TwitteCard = ({ tweet }: { tweet: TweetProps }) => {
  return (
    <div className="max-w-4xl w-full flex flex-col">
      <div className="flex items-center gap-1.5">
        <div className="h-10 w-10">
          <img
            src="https://styles.redditmedia.com/t5_2orvzk/styles/profileIcon_l9jcdipewjs71.jpg?width=256&height=256&frame=1&auto=webp&crop=256:256,smart&s=743b7aa9744f46e7cf64e0e9f2f5517226d8e41b"
            alt=""
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <div>{tweet.author}</div>
          <div>{tweet.content}</div>
        </div>
      </div>
    </div>
  );
};

export default TwitteCard;
