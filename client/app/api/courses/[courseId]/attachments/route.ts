import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = await auth();
    // const { courseId } =  params;
    const {url}=await req.json();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
        where:{
            id: params.courseId,
            userId
        }
    })
    if(!courseOwner){
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const attachment = await db.attachment.create({
        data: {
           url,
           name: url.split('/').pop() as string,
           courseId: params.courseId
        }
    })
    return NextResponse.json(attachment);
    } catch (error) {
        console.log('[COURSES] ATTACHMENT', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
   
}