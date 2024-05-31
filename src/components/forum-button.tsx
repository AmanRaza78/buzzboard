"use client"
import { useFormStatus } from "react-dom"
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"

export default function ForumSubmitButton(){
    const {pending} = useFormStatus()

    return(
        <>
        {
            pending?(
                <Button className="mt-2 w-full" disabled>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin"/>
                    please Wait
                </Button>
            ):(
                <Button type="submit"  className="mt-2 w-full">Save</Button>

            )
        }
        </>
    )
}