import { ArrowDown, ArrowUp, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import Link from "next/link";
import Image from "next/image";
import { CopyLink } from "./copy-link";
import UpButton from "./up-button";
import DownButton from "./down-button";
import { handleVote } from "@/app/action";

interface PostCardProps {
  id: string;
  title: string;
  content: string | null;
  forumName: string;
  userName: string;
  postImage: string | null;
  voteCount: number;

}

export default function PostCard({
  id,
  postImage,
  content,
  forumName,
  userName,
  title,
  voteCount
}: PostCardProps) {
  return (
    <Card className="flex relative overflow-hidden">
      <div className="flex flex-col items-center gap-y-2 bg-muted p-2">
        <form action={handleVote}>
          <input type="hidden" name="voteDirection" value="UP" />
          <input type="hidden" name="postId" value={id} />
          <UpButton/>
        </form>
        {voteCount}
        <form action={handleVote}>
            <input type="hidden" name="voteDirection" value="DOWN"/>
            <input type="hidden" name="postId" value={id} />
            <DownButton/>
        </form>
      </div>

      <div>
        <div className="flex items-center gap-x-2 p-2">
          <Link className="font-semibold text-xs" href={`/forum/${forumName}`}>
            f/{forumName}
          </Link>
          <p className="text-xs text-muted-foreground">
            Posted by: <span className="hover:text-primary">u/{userName}</span>
          </p>
        </div>

        <div className="px-2">
          <Link href={`/post/${id}`}>
            <h1 className="font-medium mt-1 text-lg">{title}</h1>
          </Link>
        </div>

        <div className="max-h-[300px] overflow-hidden">
          {postImage ? (
            <Image
              src={postImage}
              alt="Post Image"
              width={600}
              height={300}
              className="w-full h-full"
            />
          ) : (
            content
          )}
        </div>

        <div className="m-3 flex items-center gap-x-5">
          <div className="flex items-center gap-x-1">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground font-medium text-xs">
              31 Comments
            </p>
          </div>
          <CopyLink id={id} />
        </div>
      </div>
    </Card>
  );
}
