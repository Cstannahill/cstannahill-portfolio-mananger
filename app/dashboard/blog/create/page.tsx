import React from "react";
import BlogForm from "@/components/blog/BlogForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CreateBlogPostPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create New Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBlogPostPage;
