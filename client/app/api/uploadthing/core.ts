import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth =async () => { 
    const {userId}=await auth();
    const isAuthorized=isTeacher(userId);
    if(!userId || !isAuthorized) throw new UploadThingError("Unauthorized Access");
    return {userId}
}; 
const handleUploadComplete = async() => {
    console.log("upload complete");
};

export const ourFileRouter = {
 courseImage:f({image:{maxFileSize:"4MB",maxFileCount:1}}).middleware(()=> handleAuth()).onUploadComplete(()=>{handleUploadComplete()}),
 courseAttachment:f(['text','image','video','audio','pdf']).middleware(()=> handleAuth()).onUploadComplete(()=>{handleUploadComplete()}),
 chapterVideo:f({video:{maxFileSize:"128MB",maxFileCount:1}}).middleware(()=> handleAuth()).onUploadComplete(()=>{handleUploadComplete()}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
