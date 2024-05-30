import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

export default function Navbar(){
    return(
        <nav className="border-b bg-background h-[10vh] flex item-center">
            <div className="container flex items-center justify-between">
                <Link href='/'>
                    <h1 className="font-bold text-primary text-3xl">Buzz Board</h1>
                </Link>

                <div className="flex items-center gap-x-5">
                    <ModeToggle/>

                    <div className="flex items-center gap-x-5">
                        <Button>Login</Button>
                        <Button>Sign Up</Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}