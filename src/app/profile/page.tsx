import ProfilePage from "@/components/profileForm";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

async function getUserData(userId: string) {
  noStore()
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      firstname: true,
      lastname: true,
    },
  });

  return userData;
}

export default async function Profile() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const data = await getUserData(user.id);
  return (
    <div className="max-w-[1000px] mx-auto flex flex-col mt-4">
        <ProfilePage firstname={data?.firstname} lastname={data?.lastname}/>
    </div>
  );
}
