import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import CommentComponent from '@/pages/components/Comment';
import { AppContext } from '@/pages/components/AppVars';
interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  tags: { name: string }[];
  codeTemplates: { id: number; title: string }[];
  createdBy: { userName: string };
  rating: number;   
}

interface Comment {
  id: number;
  content: string;
  rating: number;
  createdBy: { userName: string };
}

const DetailedPostView = () => {
  const router = useRouter();
  const context = useContext(AppContext);
  const { id } = router.query;
  const pageSize = 5;

  const [post, setPost] = useState<BlogPost>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [ratingChange, setRatingChange] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlogPostDetails();
    }
  }, [id, ratingChange]);

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
    if (context?.admin === 'True') {}
    else if ((data.inappropriate && data.createdUserId != context?.userID) ) {
      alert('This post has been reported as inappropriate and is currently under review.');
      return;
    }
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

    setComments(data.comments);
    setTotalPages(data.totalPages);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const createRating = async (value: number, id: number) => {

    const response = await fetch(`/api/Ratings/Blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ value: value, id: id }),
    });
  
    if (!response.ok) {
      alert('Error creating rating!');
      return;
    }

    setRatingChange(!ratingChange);

  };

  const handleCommentSubmit = async () => {
    if (newComment.trim() === '') {
      alert('Comment cannot be empty.');
      return;
    }

    const response = await fetch(`/api/Comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ content: newComment, blogPostId: post?.id }),
    });

    if (!response.ok) {
      alert('Error submitting comment!');
      return;
    }

    console.log(response);
    alert('Comment submitted successfully!');

    setNewComment('');
    fetchComments(1);
  };

  if (!post) {
    return;
  }

  return (
    <div className="container mx-auto p-4 mb-4">
      <div className="border rounded p-4">
        {post && (
          <div>
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
          </div>
        )}

        <div className="flex items-center space-x-2 mt-4">
          <button onClick={async () => { await createRating(1, post.id ); }} className="bg-transparent"> ⬆️ </button>
          <div className="my-1 rounded-lg">
            <p className="font-bold">⭐ Rating: {post.rating}</p>
          </div>
          <button onClick={async () => { await createRating(-1, post.id); }} className="bg-transparent"> ⬇️ </button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Comments</h3>
          {comments.map((comment) => (
            <CommentComponent key={comment.id} comment={comment} />
          ))}

          <div className="mt-4 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border rounded outline-none"
              rows={3}
            />

            <button
              onClick={handleCommentSubmit}
              className="py-1 px-4 bg-transparent text-gray-500 absolute bottom-2 right-2 font-semibold">
              Submit Comment
            </button>
          </div>

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