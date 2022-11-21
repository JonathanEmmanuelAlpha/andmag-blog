import React from "react";
import BlogsList from "../../components/blog/BlogsList";
import Header from "../../components/header/Header";
import SkeletonLayout, {
  Layout,
} from "../../components/skeleton-layout/SkeletonLayout";

export default function Blogs() {
  return (
    <SkeletonLayout title={"Andmag-glound - Blogs"}>
      <BlogsList />
    </SkeletonLayout>
  );
}
