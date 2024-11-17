import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CommentComponent from '@/pages/components/Comment';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  tags: { name: string }[];
  codeTemplates: { id: number; title: string }[];
  createdBy: { userName: string };
}

interface Comment {
  id: number;
  content: string;
  rating: number;
  createdBy: { userName: string };
}

const DetailedPostView = () => {

  const router = useRouter();
  const { id } = router.query;
  const pageSize = 5;

  const [post, setPost] = useState<BlogPost>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (id) {
      fetchBlogPostDetails();
    }
  }, [id]);

  useEffect(() => {
    if (post) {
      fetchComments(page);
    }
  }, [post, page]);

  const fetchBlogPostDetails = async () => {
    const response = await fetch(`/api/BlogPosts?id=${id}`);

    if (!response.ok) {
      console.error('Error fetching blog post details');
      return;
    }

    const data = await response.json();

    console.log(data);
    setPost(data);
  };

  const fetchComments = async (page: number) => {
    if (!post) {
      return;
    }

    const response = await fetch(`/api/Comments?blogPostId=${post.id}&page=${page}&pageSize=${pageSize}&order=desc`);
    
    if (!response.ok) {
      console.error('Error fetching comments');
      setTotalPages(1);
      return;
    }

    const data = await response.json();

    console.log(data);

    setComments(data.comments);
    setTotalPages(data.totalPages);

  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (!post) {
    return;
  }

  return (
    <div className="container mx-auto p-4 mb-4">

      <div className="border rounded p-4">

        {post && (
          <>
            <div className="flex justify-between mt-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <span className="font-semibold">Created by: {post.createdBy.userName}</span>
            </div>
            
            <div className="mt-4">
              <p className="text-lg">{post.description}</p>
            </div>

            <div className="mt-4">
              <p>{post.content}</p>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex space-x-2 mt-4">
                {post.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 rounded" id="tag">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {post.codeTemplates && post.codeTemplates.length > 0 && (
              <div>
                <p className="mt-4 font-semibold">Linked Code Templates: </p>

                <div className="flex space-x-2 mt-2">
                  {post.codeTemplates.map((template) => (
                    <span
                      key={template.id}
                      className="px-2 py-1 rounded cursor-pointer"
                      id="template"
                      onClick={() => router.push(`/Templates/detailedView?id=${template.id}`)}>
                      {template.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-semibold">Comments</h3>
          {comments.map((comment) => (
            <CommentComponent key={comment.id} comment={comment} />
          ))}

          <div className="flex justify-between mt-4 px-1">
            <button
              onClick={() => handlePageChange(page - 1)}
              className="py-1 px-2 rounded text-xs"
              disabled={page === 1}>
              Previous
            </button>

            <button
              onClick={() => handlePageChange(page + 1)}
              className="py-1 px-2 rounded text-xs"
              disabled={page === totalPages}>
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );

};

export default DetailedPostView;