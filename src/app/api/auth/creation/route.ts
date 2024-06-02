import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(){
    noStore()
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if(!user || user===null || !user.id){
        throw new Error("Something went Worng!")
    }

    const dbUser = await prisma.user.findUnique({
        where:{
            id:user.id
        }
    })

    if(!dbUser){
        await prisma.user.create({
            data:{
                id: user.id,
                firstname: user.given_name ?? "",
                lastname: user.family_name?? "",
                email: user.email ?? ""
            }
        })
    }

    return NextResponse.redirect("http://localhost:3000/")
}