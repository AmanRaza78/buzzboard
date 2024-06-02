"use client"
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { ArrowUp, Loader2 } from "lucide-react";

export default function UpButton(){
    const { pending } = useFormStatus();

    return (
      <>
        {pending ? (
          <Button variant="outline" size="icon" disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" type="submit">
            <ArrowUp className="h-4 w-4" />
          </Button>
        )}
      </>
    );
  }
