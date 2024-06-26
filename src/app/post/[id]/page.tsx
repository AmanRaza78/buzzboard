import { handleVote } from "@/app/action";
import DownButton from "@/components/down-button";
import { Card } from "@/components/ui/card";
import UpButton from "@/components/up-button";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Cake, MessageCircle } from "lucide-react";
import { CopyLink } from "@/components/copy-link";
import { CommentForm } from "@/components/comment-form";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";

async function getData(id: string) {
  noStore()
  const data = await prisma.post.findUnique({
    where: {
      id: id,
    },

    select: {
      createdAt: true,
      title: true,
      postImage: true,
      content: true,
      forumName: true,
      id: true,

      vote: {
        select: {
          voteType: true,
        },
      },
      comment: {
        orderBy: {
          createAt: "desc",
        },

        select: {
          id: true,
          text: true,
          user: {
            select: {
              firstname: true,
            },
          },
        },
      },

      forum: {
        select: {
          name: true,
          createdAt: true,
          description: true,
        },
      },

      user: {
        select: {
          firstname: true,
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const data = await getData(params.id);

  return (
    <div className="max-w-[1200px] mx-auto flex gap-x-10 mt-4 mb-10">
      <div className="w-[70%] flex flex-col gap-y-5">
        <Card className="p-2 flex">
          <div className="flex flex-col  items-center  gap-y-2  p-2">
            <form action={handleVote}>
              <input type="hidden" name="voteDirection" value="UP" />
              <input type="hidden" name="postId" value={data.id} />
              <UpButton/>
            </form>
            {data.vote.reduce((acc, vote) => {
              if (vote.voteType === "UP") return acc + 1;
              if (vote.voteType === "DOWN") return acc - 1;

              return acc;
            }, 0)}
            <form action={handleVote}>
              <input type="hidden" name="voteDirection" value="DOWN" />
              <input type="hidden" name="postId" value={data.id} />
              <DownButton/>
            </form>
          </div>

          <div className="p-2 w-full">
            <p className="text-xs text-muted-foreground">
              Posted by u/{data.user?.firstname}
            </p>

            <h1 className="font-medium mt-1 text-lg">{data.title}</h1>

            {data.postImage && (
              <Image
                src={data.postImage}
                alt="User Image"
                width={500}
                height={400}
                className="w-full h-auto object-contain mt-2"
              />
            )}

            {data.content}
            
            <div className="flex gap-x-5 items-center mt-3">
              <div className="flex items-center gap-x-1">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground font-medium text-xs">
                  {data.comment.length} Comments
                </p>
              </div>

              <CopyLink id={params.id} />
            </div>

            <CommentForm postId={params.id} />

            <Separator className="my-5" />

            <div className="flex flex-col gap-y-7">
              {data.comment.map((item) => (
                <div key={item.id} className="flex flex-col">
                  <div className="flex items-center gap-x-3">
                    <h3 className="text-sm font-medium">
                      {item.user.firstname}
                    </h3>
                  </div>

                  <p className="ml-10 text-secondary-foreground text-sm tracking-wide">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="w-[30%]">
        <Card>
          <div className="bg-muted p-4 font-semibold">About Community</div>
          <div className="p-4">
            <div className="flex items-center gap-x-3">
              <Image
                src={`https://avatar.vercel.sh/${data?.forumName}`}
                alt="Image of subreddit"
                width={60}
                height={60}
                className="rounded-full h-16 w-16"
              />
              <Link href={`/forum/${data?.forumName}`} className="font-medium">
                f/{data?.forumName}
              </Link>
            </div>

            <p className="text-sm font-normal text-secondary-foreground mt-2">
              {data?.forum?.description}
            </p>

            <div className="flex items-center gap-x-2 mt-4">
              <Cake className="h-5 w-5 text-muted-foreground" />
              <p className="text-muted-foreground font-medium text-sm">
                Created:{" "}
                {new Date(data?.createdAt as Date).toLocaleDateString("en-us", {
                  weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>

            <Separator className="my-5" />
            <Button asChild className="rounded-full w-full">
              <Link href={`/forum/${data?.forumName}/create`}>Create Post</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
