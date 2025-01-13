import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

const Video = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(req:Request,{params}:{params:{courseId:string}}){
  try {
    const {userId}=await auth();
const {courseId}=await params;
    if(!userId) return new NextResponse("Unauthorized",{status:401})
const course=await db.course.findUnique({
    where:{
        id:courseId,userId:userId
    },include:{
        chapters:{
            include:{
                muxData:true,
            }
        }
    }
})

if(!course) return new NextResponse("Not found",{status:404})
     
   for(const chapter of course.chapters){
      if(chapter.muxData?.assetId){
        await Video.video.assets.delete(chapter.muxData.assetId)
      }
   }

const deleteCourse=await db.course.delete({
    where:{
        id:courseId,
    }
})

return NextResponse.json(deleteCourse)
  } catch (error) {
    console.log("[CoursE_ID_DELETE]",error)
    return new NextResponse("Internal Error",{status:500})
  }
}

export async function PATCH(
    req:Request,
    {params}:{params:{courseId:string}}
){
    try {
        const { userId } = await auth();
        const {courseId}=await params;
        const values=await req.json();
        if(!userId){
            return new NextResponse("Unauthorized",{status:401});
        }
       
const course = await db.course.update({
    where:{
        id:courseId,
        userId
    },
    data:{
        ...values,
    }
})
   return NextResponse.json(course)
    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Error",{status:500})
    }
}