import CreatePostSearch from "@/components/create-post-search";
import ForumDesctiptionForm from "@/components/forum-description-form";
import Pagination from "@/components/pagination";
import PostCard from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Cake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function getData(name: string, searchParams:string) {
  const [count, data] = await prisma.$transaction([
    prisma.post.count({
      where: {
        forumName: name,
      },
    }),

    prisma.forum.findUnique({
      where: {
        name: name,
      },
      select: {
        name: true,
        description: true,
        createdAt: true,
        userId: true,
        post: {
          take:10,
          skip: searchParams ? (Number(searchParams)-1) * 10 : 0,
          select: {
            title: true,
            postImage: true,
            comment:{
              select:{
                id:true
              }
            },
            id: true,
            content: true,
            vote: {
              select: {
                userId: true,
                voteType: true,
              },
            },
            user: {
              select: {
                firstname: true,
              },
            },
          },
          orderBy:{
            createdAt:"desc"
          }
        },
      },
    }),
  ]);

  return {count, data};
}

export default async function ForumPageRoute({
  params,searchParams
}: {
  params: { id: string };
  searchParams:{page:string}
}) {
  const {count,data} = await getData(params.id, searchParams.page);
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className="max-w-[1000px] mx-auto flex gap-x-10 mt-4 mb-10">
      <div className="w-[65%] flex flex-col gap-y-5">
        <CreatePostSearch />
        {data?.post.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            postImage={post.postImage}
            commentAmount={post.comment.length}
            forumName={data.name}
            title={post.title}
            content={post.content}
            userName={post.user.firstname as string}
            voteCount={post.vote.reduce((acc, vote) => {
              if (vote.voteType === "UP") return acc + 1;
              if (vote.voteType === "DOWN") return acc - 1;

              return acc;
            }, 0)}
          />
        ))}
        <Pagination totalPages={Math.ceil(count/10)}/>
      </div>

      <div className="w-[35%]">
        <Card>
          <div className="bg-muted p-4 font-semibold">About Forum</div>
          <div className="p-4">
            <div className="flex items-center gap-x-3">
              <Image
                src={`https://avatar.vercel.sh/${data?.name}`}
                alt="Image of forum"
                width={60}
                height={60}
                className="rounded-full h-16 w-16"
              />
              <Link href="/" className="font-medium">
                f/{data?.name}
              </Link>
            </div>
            {user?.id === data?.userId ? (
              <ForumDesctiptionForm
                description={data?.description}
                forumName={params.id}
              />
            ) : (
              <p className="text-sm font-normal text-secondary-foreground mt-2">
                {data?.description}
              </p>
            )}

            <div className="flex items-center gap-x-2 mt-2">
              <Cake className="h-5 w-5 text-muted-foreground" />
              <p className="text-muted-foreground font-medium text-sm">
                CreatedAt:{" "}
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
              <Link
                href={
                  user?.id ? `/forum/${data?.name}/create` : "/api/auth/login"
                }
              >
                Create Post
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
