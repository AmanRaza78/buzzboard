"use server";

import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Prisma, TypeOfVote } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { use } from "react";

export async function updateUserName(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const firstname = formData.get("firstname") as string;
  const lastname = formData.get("lastname") as string;

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      firstname: firstname,
      lastname: lastname,
    },
  });

  return { message: "Succesfully updated the user profile" };
}

export async function createForum(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  try {
    const title = formData.get("title") as string;
    await prisma.forum.create({
      data: {
        name: title,
        userId: user.id,
      },
    });

    return redirect("/");
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          message: "This Name is already used",
          status: "error",
        };
      }
    }
    throw e;
  }
}

export async function updateForumDescription(
  prevState: any,
  formData: FormData
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  try {
    const forumName = formData.get("forumName") as string;
    const description = formData.get("description") as string;

    await prisma.forum.update({
      where: {
        name: forumName,
      },
      data: {
        description: description,
      },
    });

    return {
      message: "Succesfully updated the forum description",
      status: "green",
    };
  } catch (e) {
    return {
      message: "Something went Wrong",
      status: "error",
    };
  }
}

export async function createPost(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  try {
    const title = formData.get("title") as string;
    const imageUrl = formData.get("imageUrl") as string | null;
    const forumName = formData.get("forumName") as string;
    const content = formData.get("content") as string | null;

    await prisma.post.create({
      data: {
        title: title,
        postImage: imageUrl ?? undefined,
        forumName: forumName,
        userId: user.id,
        content: content ?? undefined,
      },
    });

    return redirect("/");
  } catch (e) {
    throw e;
  }
}

export async function handleVote(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const postId = formData.get("postId") as string;
  const voteDirection = formData.get("voteDirection") as TypeOfVote;

  const vote = await prisma.vote.findFirst({
    where: {
      postId: postId,
      userId: user.id,
    },
  });

  if (vote) {
    if (vote.voteType === voteDirection) {
      await prisma.vote.delete({
        where: {
          id: vote.id,
        },
      });
      return revalidatePath("/");
    } else {
      await prisma.vote.update({
        where: {
          id: vote.id,
        },
        data: {
          voteType: voteDirection,
        },
      });
      return revalidatePath("/");
    }
  }

  await prisma.vote.create({
    data: {
      voteType: voteDirection,
      userId: user.id,
      postId: postId,
    },
  });
  return revalidatePath("/");
}
