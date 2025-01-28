import { db } from "@/lib/db";
import React, { Suspense } from "react";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CoursesList } from "@/components/courses-list";
import { Categories } from "./_components/categories";
import LoadingAnimation from "@/components/loading-animation";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = await auth();
  if (!userId) return redirect("/");
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <Suspense fallback={<LoadingAnimation />}>
          <SearchInput />
        </Suspense>
      </div>
      <div className="p-6 space-y-4">
        <Suspense fallback={<LoadingAnimation />}>
          <Categories items={categories} />
        </Suspense>
        <Suspense fallback={<LoadingAnimation />}>
          <CoursesList items={courses} />
        </Suspense>
      </div>
    </>
  );
};

export default SearchPage;
