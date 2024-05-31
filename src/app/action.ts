"use server"

import prisma from "@/lib/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"

export async function updateUserName(prevState:any, formData:FormData) {
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if(!user){
        return redirect("/api/auth/login")
    }

    const firstname = formData.get("firstname") as string
    const lastname = formData.get("lastname") as string

    await prisma.user.update({
        where:{
            id: user.id
        },
        data:{
            firstname:firstname,
            lastname:lastname
        }
    })

    return{message: "Succesfully updated the user profile"}

}