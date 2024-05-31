"use client"
import { updateForumDescription } from "@/app/action";
import { Textarea } from "./ui/textarea";
import ForumSubmitButton from "./forum-button";
import { useFormState } from "react-dom";
import { useToast } from "./ui/use-toast";
import { useEffect } from "react";

const initialState = {
    message:"",
    status: ""
}

interface ForumDesctiptionFormProps {
    forumName: string;
    description: string | null | undefined
}
export default function ForumDesctiptionForm({forumName, description}:ForumDesctiptionFormProps){
    const [state, formAction] = useFormState(updateForumDescription, initialState);

    const {toast} = useToast()

    useEffect(()=>{
        if(state.status==='green'){
            toast({
                title:"Succesfull!!",
                description:state.message
            })
        }
        if(state.status==="error"){
            toast({
                title:"Error",
                description:state.message,
                variant: "destructive"
            })
        }
    },[state])


    return(
        <form className="mt-3" action={formAction}>
                <input type="hidden" name="forumName" value={forumName}/>
                <Textarea
                  placeholder="create your custom description of your forum."
                  maxLength={200}
                  name="description"
                  defaultValue={description ?? ""}
                />
                <ForumSubmitButton/>
              </form>
    )
}