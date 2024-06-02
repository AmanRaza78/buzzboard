import CreatePostSearch from "@/components/create-post-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import PostCard from "@/components/post-card";
import { Suspense } from "react";
import { SuspenseCard } from "@/components/suspense-card";

async function getData() {
  const data = await prisma.post.findMany({
    select: {
      title: true,
      createdAt: true,
      content: true,
      id: true,
      postImage: true,

      user: {
        select: {
          firstname: true,
          lastname: true,
        },
      },

      vote: {
        select: {
          userId: true,
          voteType: true,
          postId: true,
        },
      },

      forumName: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export default function Home() {
  return (
    <div className="max-w-[1000px] mx-auto flex gap-x-10 mt-4">
      <div className="w-[65%] flex flex-col gap-y-5">
        <CreatePostSearch />
        <Suspense fallback={<SuspenseCard/>}>
          <ShowPostItems />
        </Suspense>
      </div>

      <div className="w-[35%]">
        <Card>
          <div className="flex items-center gap-x-5 p-2">
            <h1 className="font-semibold text-2xl text-primary">Buzz Board</h1>
          </div>

          <div className="p-2">
            <p className="text-sm text-muted-foreground pt-2">
              Buzz Board: Where Conversations Come Alive. Come here to check
              your favorite forums.
            </p>

            <Separator className="my-5" />

            <div className="flex flex-col gap-y-3">
              <Button asChild>
                <Link href="/forum/create"> Create Forum</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/forum/python/create">Create Post</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

async function ShowPostItems() {
  const data = await getData();

  return (
    <>
      {data.map((post) => (
        <PostCard
          id={post.id}
          postImage={post.postImage}
          content={post.content}
          forumName={post.forumName}
          title={post.title}
          userName={post.user.firstname as string}
          key={post.id}
          voteCount={post.vote.reduce((acc, vote) => {
            if (vote.voteType === "UP") return acc + 1;
            if (vote.voteType === "DOWN") return acc - 1;

            return acc;
          }, 0)}
        />
      ))}
    </>
  );
}
