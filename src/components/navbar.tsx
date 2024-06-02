import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Navbar() {
  const { isAuthenticated } = getKindeServerSession();
  return (
    <nav className="border-b bg-background h-[10vh] flex item-center">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <h1 className="font-bold text-primary text-3xl">Buzz Board</h1>
        </Link>

        <div className="flex items-center gap-x-5">
          <ModeToggle />

          {(await isAuthenticated()) ? (
            <div className="flex items-center gap-x-5">
              <LogoutLink>
                <Button>Logout</Button>
              </LogoutLink>

              <Link href="/profile">
                <Button>Profile</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-x-5">
              <LoginLink>
                <Button>Login</Button>
              </LoginLink>

              <RegisterLink>
                <Button>Sign Up</Button>
              </RegisterLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
