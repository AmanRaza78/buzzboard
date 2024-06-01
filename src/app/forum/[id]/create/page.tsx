"use client";
import { createPost } from "@/app/action";
import SubmitButton from "@/components/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/utils/uploadthing";
import Link from "next/link";
import { useState } from "react";


export default function CreateForumPostRoute({
  params,
}: {
  params: { id: string };
}) {
    const [imageUrl, setImageUrl] = useState<string|null>(null)
    const [title, setTitle] = useState<string|null>(null)
    const [content, setContent] = useState<string|null>(null)
  return (
    <div className="max-w-[1000px] flex flex-col mx-auto mt-4 items-center">
      <p className="font-semibold mb-4">
        Forum: <Link href={`/forum/${params.id}`} className="text-primary">f/{params.id}</Link>
      </p>
      <Tabs defaultValue="post" className="w-[600px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="post">Post</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
        </TabsList>
        <TabsContent value="post">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Create Post</CardTitle>
              <CardDescription>
                You can create a forum post and upload images
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <form action={createPost}>
                <input type="hidden" value={imageUrl ?? undefined} name="imageUrl"/>
                <input type="hidden" value={params.id} name="forumName"/>
                <div className="space-y-1">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Post title"
                    minLength={2}
                    maxLength={200}
                    name="title"
                    value={title ?? undefined}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write post content...."
                    maxLength={2000}
                    className="h-[30vh]"
                    name="content"
                    value={content ?? undefined}
                    onChange={(e)=>setContent(e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <SubmitButton text="Post" />
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Image</CardTitle>
              <CardDescription>
                You can upload only one image per forum post.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <UploadDropzone
                className="ut-button:bg-primary ut-label:text-primary ut-button:ut-uploading:bg-primary/50 ut-button:ut-uploading:after:bg-primary"
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                    setImageUrl(res[0].url)
                }}
                onUploadError={(error: Error) => {
                  alert(error);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
