import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "@/pages/components/AppVars";
import { useRouter } from "next/router";

interface blogsArray {
  blogPostId: number;
  count: number;
}

interface commentsArray {
  commentId: number;
  count: number;
}

const Index: React.FC = () => {
  const context = useContext(AppContext);
  const router = useRouter();

  if (!context?.admin) {
    router.push("/");
  }

  const [blogPage, setBlogPage] = useState(0);
  const [commentPage, setCommentPage] = useState(0);
  const [blogs, setBlogs] = useState<blogsArray[]>([]);
  const [comments, setComments] = useState<commentsArray[]>([]);

  const fetchReportedBlogs = async () => {
    const data = await fetch(`/api/Admin/ReportedBlogs?page=${blogPage}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const response = await data.json();
    setBlogs(response.reportedBlogs);
  };

  const fetchReportedComments = async () => {
    const data = await fetch(`/api/Admin/ReportedComments?page=${commentPage}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const response = await data.json();
    setComments(response.reportedComments);
  };

  useEffect(() => {
    fetchReportedBlogs();
  }, [blogPage]);

  useEffect(() => {
    fetchReportedComments();
  }, [commentPage]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {context?.admin === "True" ? (
        <div>
          <h1 className="text-3xl font-bold text-center mb-8">Welcome Admin</h1>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Reported Blogs</h2>
            <div className="space-y-4">
              <ul className="space-y-4">
                {blogs.map((blog) => (
                                      <li 
                      key={blog.blogPostId} 
                      className="border p-4 rounded-lg hover:shadow-lg transition-shadow"
                    >
                      <h3 className="text-lg font-medium">
                        BlogID: {blog.blogPostId}, Reports: {blog.count}
                      </h3>
                      <button
                        onClick={() =>
                          router.push(`/Admin/detailedBlog?id=${blog.blogPostId}`)
                        }
                        className="mt-2 inline-block px-4 py-2 rounded-md border text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 focus:ring focus:ring-blue-300 transition"
                      >
                        View Reports
                      </button>
                    </li>

                ))}
              </ul>
              <div className="flex justify-between">
                <button
                  onClick={() => setBlogPage(blogPage - 1)}
                  disabled={blogPage <= 0}
                  className="px-4 py-2 rounded-md border text-sm font-medium"
                >
                  Previous Page
                </button>
                <button
                  onClick={() => setBlogPage(blogPage + 1)}
                  className="px-4 py-2 rounded-md border text-sm font-medium"
                >
                  Next Page
                </button>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Reported Comments</h2>
            <div className="space-y-4">
              <ul className="space-y-4">
                {comments.map((comment) => (
                  <li
                      key={comment.commentId}
                      className="border p-4 rounded-lg flex items-center justify-between"
                    >
                      <h3 className="text-lg font-medium">
                        CommentID: {comment.commentId}, Reports: {comment.count}
                      </h3>
                      <button
                        onClick={() =>
                          router.push(`/Admin/detailedComment?id=${comment.commentId}`)
                        }
                        className="px-4 py-2 rounded-md border text-sm font-medium"
                      >
                        View Reports
                      </button>
                    </li>

                ))}
              </ul>
              <div className="flex justify-between">
                <button
                  onClick={() => setCommentPage(commentPage - 1)}
                  disabled={commentPage <= 0}
                  className="px-4 py-2 rounded-md border text-sm font-medium"
                >
                  Previous Page
                </button>
                <button
                  onClick={() => setCommentPage(commentPage + 1)}
                  className="px-4 py-2 rounded-md border text-sm font-medium"
                >
                  Next Page
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-center text-xl font-semibold mt-12">
          You are not an admin
        </h1>
      )}
    </div>
  );
};

export default Index;
