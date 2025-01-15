import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const CourseIdPage = async ({ params }: { params: { coursesId: string } }) => {
  const { coursesId } = await params;
  const course = await db.course.findUnique({
    where: {
      id: coursesId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!course) {
    return redirect("/");
  }

  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
};
export default CourseIdPage;
