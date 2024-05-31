"use client";

import { createForum } from "@/app/action";
import SubmitButton from "./submit-button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { useFormState } from "react-dom";
import { useToast } from "./ui/use-toast";
import { useEffect } from "react";

const initialState ={
    message:"",
    status: ""
}

export default function CreateForumForm() {
    const [state, formAction] = useFormState(createForum, initialState);
    const {toast} = useToast()

    useEffect(()=>{
        if(state.status==='error'){
            toast({
                title: "Error",
                description: state.message,
                variant: "destructive"
            })
        }
    },[state])



  return (
    <form action={formAction}>
      <h1 className="text-3xl text-primary font-bold tracking-tight ">
        Create Forum
      </h1>
      <p className="text-muted-foreground">
        Here You can create a forum community and start posting
      </p>

      <Separator className="my-4" />

      <Label className="text-lg" htmlFor="title">
        Title
      </Label>
      <Input id="title" name="title" required minLength={2} maxLength={21} />

      <p className="text-muted-foreground text-sm mt-2">
        Forum title should be unique
      </p>


      <div className="w-full mt-4">
        <SubmitButton text="Submit" />
      </div>
    </form>
  );
}
