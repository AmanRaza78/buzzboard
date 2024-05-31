"use server";

import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

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
    if (e instanceof Prisma.PrismaClientKnownRequestError){
        if(e.code==="P2002"){
            return {
                message: "This Name is already used",
                status: "error"
            }
        }
    }
    throw e
  }
}

export async function updateForumDescription(prevState:any, formData:FormData){
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if(!user){
        return redirect("/api/auth/login")
    }

    try {
        const forumName = formData.get("forumName") as string
        const description = formData.get("description") as string
    
        await prisma.forum.update({
            where:{
                name: forumName,
            },
            data:{
                description:description,
            }
        })

        return {
            message:"Succesfully updated the forum description",
            status:"green"
        }
    } catch (e) {
        return{
            message: "Something went Wrong",
            status: "error"
        } 
    }

}
