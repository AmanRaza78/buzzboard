import CreateForumForm from "@/components/create-forum-form";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function () {
  const { isAuthenticated } = getKindeServerSession();
  const isAuth = await isAuthenticated();

  if (!isAuth) {
    return redirect("/api/auth/login");
  }
  return (
  <div className="max-w-[1000px] mx-auto flex flex-col mt-4">
    <CreateForumForm/>
  </div>
  );
}
