"use client";

import { updateUserName } from "@/app/action";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import SubmitButton from "./submit-button";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const initialState = {
  message: "",
};

export default function ProfilePage({
  firstname,
  lastname,
}: {
  firstname: string | null | undefined;
  lastname: string | null | undefined;
}) {
  const { toast } = useToast();

  const [state, formAction] = useFormState(updateUserName, initialState);

  useEffect(() => {
    if(state.message){
        toast({
            title: "Succesfull!!",
            description: state.message
        })
    }
  }, [state]);
  return (
    <form action={formAction}>
      <h1 className="text-3xl text-primary font-bold tracking-tight ">
        Profile
      </h1>
      <p className="text-muted-foreground">
        This is how others will see you on the site.
      </p>

      <Separator className="my-4" />

      <Label className="text-lg" htmlFor="firstname">
        First Name
      </Label>
      <Input
        id="firstname"
        defaultValue={firstname ?? ""}
        name="firstname"
        required
      />
      <p className="text-muted-foreground text-sm mt-2">
        This is your public display name. It can be your real name or a
        pseudonym.
      </p>

      <Separator className="my-4" />
      <Label className="text-lg" htmlFor="lastname">
        Last Name
      </Label>
      <Input
        id="lastname"
        defaultValue={lastname ?? ""}
        name="lastname"
        required
      />
      <p className="text-muted-foreground text-sm mt-2">
        This is your last name. It can be your real name or a pseudonym.
      </p>

      <div className="w-full mt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
