import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import CommentComponent from '@/pages/components/Comment';
import { AppContext } from '@/pages/components/AppVars';
import { toast } from 'react-toastify';
import { BackgroundGradient } from '../components/BackgroundGradient';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  tags: { name: string }[];
  codeTemplates: CodeTemplate[];
  createdBy: { id: number; userName: string };
  rating: number;
}

interface Comment {
  id: number;
  content: string;
  rating: number;
  createdBy: { userName: string };
}

interface CodeTemplate {
  id: number;
  title: string;
  createdBy: { userName: string };
  forkedFromID: number;
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
  const [editable, setEditable] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedContent, setUpdatedContent] = useState('');
  
  const [tagInput, setTagInput] = useState('');
  const [updatedTags, setUpdatedTags] = useState<string[]>([]);
  const [codeTemplates, setCodeTemplates] = useState<CodeTemplate[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<CodeTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (id) {
      fetchBlogPostDetails();
    }
  }, [id, ratingChange]);

  useEffect(() => {
    if (post) {
      fetchComments(page);

      if (String(context?.userID) === String(post?.createdBy.id)) {
        setEditable(true);
        setUpdatedTitle(post.title || '');
        setUpdatedDescription(post.description || '');
        setUpdatedContent(post.content || '');
        setUpdatedTags(post.tags.map((tag) => tag.name) || []);
        setSelectedTemplates(post.codeTemplates || []);
      }
    }
  }, [post, page]);

  useEffect(() => {
    fetchCodeTemplates();
  }, [searchQuery, page, isEditing]);

  const fetchBlogPostDetails = async () => {
    const response = await fetch(`/api/BlogPosts?id=${id}`);

    if (!response.ok) {
      console.error('Error fetching blog post details');
      return;
    }

    const data = await response.json();

    if (!context?.admin && data.inappropriate && String(context?.userID) === String(data.createdBy.id)) {
      toast.info('This post has been reported as inappropriate and is currently under review.');
      return;
    }
    
    setPost(data);
  };

  const fetchComments = async (page: number) => {
    if (!post) return;

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

  const fetchCodeTemplates = async () => {

    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      title: searchQuery,
    }).toString();

    const response = await fetch(`/api/CodeTemplates?${query}`);

    if (!response.ok) {
      console.error('Failed to fetch code templates');
      return;
    }

    const data = await response.json();

    setCodeTemplates(data.codeTemplates);
    setTotalPages(data.totalPages);
  };

  const toggleTemplate = (template: any) => {
    if (selectedTemplates.some((t) => t.id === template.id)) {
        setSelectedTemplates(selectedTemplates.filter((t) => t.id !== template.id));
    } 
    else {
        setSelectedTemplates([...selectedTemplates, template]);
    }
};

  const saveChanges = async () => {
    const updatedPost = {
      title: updatedTitle,
      description: updatedDescription,
      content: updatedContent,
      tags: updatedTags,
      codeTemplates: selectedTemplates.map((template) => template.id),
    };

    const response = await fetch(`/api/BlogPosts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(updatedPost),
    });

    if (!response.ok) {
      toast.error('Error updating post!');
      return;
    }

    fetchBlogPostDetails();
    setIsEditing(false);
  };

  const createRating = async (value: number, id: number) => {
    const response = await fetch('/api/Ratings/Blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ value: value, id: id }),
    });

    if (!response.ok) {
      toast.error('Error creating rating!');
      return;
    }

    setRatingChange(!ratingChange);
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim() === '') {
      toast.warning('Comment cannot be empty.');
      return;
    }

    const response = await fetch('/api/Comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ content: newComment, blogPostId: post?.id }),
    });

    if (!response.ok) {
      toast.error('Error submitting comment!');
      return;
    }

    console.log(response);
    toast.success('Comment submitted successfully!');

    setNewComment('');
    fetchComments(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!updatedTags.includes(tagInput.trim())) {
        setUpdatedTags([...updatedTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setUpdatedTags(updatedTags.filter((t) => t !== tag));
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  if (!post) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <BackgroundGradient className="p-4 rounded-2xl bg-cta-background">
        <div className="flex justify-between">
          {isEditing ? (
            <input
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              className="border p-2 w-full rounded outline-none focus:ring focus:border"
            />
          ) : (
            <h2 className="text-xl font-semibold">{post.title}</h2>
          )}
          <span className="ml-8 font-semibold">Created by: {post.createdBy.userName}</span>
        </div>

        <div className="mt-4">
          {isEditing ? (
            <textarea
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
              className="border p-2 w-full rounded outline-none focus:ring focus:border"
              rows={3}
            />
          ) : (
            <p className="text-lg">{post.description}</p>
          )}
        </div>

        <div className="mt-4">
          {isEditing ? (
            <textarea
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              className="border p-2 w-full rounded outline-none focus:ring focus:border"
              rows={5}
            />
          ) : (
            <p>{post.content}</p>
          )}
        </div>

        {isEditing ? (
          <div className="flex items-center w-full rounded mt-4 h-10" id="tagSelect"
            onClick={() => {
              const inputElement = document.getElementById('tagInput') as HTMLInputElement;
              inputElement?.focus();
            }}
          >
            {updatedTags.map((tag) => (
                <span className="flex items-center px-2 py-1 rounded mr-1" id="tag" key={tag}>
                    {tag}
                    <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 font-bold bg-transparent text-gray-500">
                        &times;
                    </button>
                </span>
            ))}
            
            <input
                type="text"
                id="tagInput"
                placeholder="Add tags..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="border-none outline-none flex-grow h-full p-2"
            />
        </div>
        ) : (
          post.tags && post.tags.length > 0 && (
            <div className="flex space-x-2 mt-4">
              {post.tags.map((tag) => (
                <span key={tag.name} className="px-2 py-1 rounded" id="tag">
                  {tag.name}
                </span>
              ))}
            </div>
          )
        )}

        {isEditing ? (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border rounded px-2 py-1 outline-none"
            />

          <div className="border rounded p-4 max-h-[40vh] mt-2 overflow-y-auto">
            {codeTemplates.map((template) => (
                <div
                    key={template.id}
                    onClick={() => toggleTemplate(template)}
                    className={`p-2 rounded mb-2 cursor-pointer border ${
                        selectedTemplates.some((t) => t.id === template.id)
                            ? '!border-blue-500'
                            : 'border-gray-500'
                    }`}>
                    <h3 className="font-semibold">{template.title}</h3>

                    {template.forkedFromID && (
                        <p className="text-xs">(Forked Template)</p>
                    )}

                    <p className="text-xs">Created by: {template.createdBy.userName}</p>
                </div>
            ))}

            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    className="px-4 py-2 rounded"
                    disabled={page === 1}>
                    Previous
                </button>

                <span>
                    Page {page} of {totalPages}
                </span>

                <button
                    onClick={() => handlePageChange(page + 1)}
                    className="px-4 py-2 rounded"
                    disabled={page === totalPages}>
                    Next
                </button>
            </div>
          </div>
        </div>
        ) : (
          post.codeTemplates && post.codeTemplates.length > 0 && (
            <div className="flex space-x-2 mt-4">
              {post.codeTemplates.map((template) => (
                <span key={template.id} className="px-2 py-1 rounded border border-blue-500" id="template">
                  {template.title}
                </span>
              ))}
            </div>
          )
        )}

        {editable && (
          <div className="flex justify-center mt-6">
            <button
              onClick={isEditing ? saveChanges : toggleEditMode}
              className="bg-transparent text-gray-400 border-2 border-gray-400 font-bold py-2 px-4 rounded">
              {isEditing ? 'Save Changes' : 'Edit'}
            </button>
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

          <div className="flex justify-between mt-1 px-1">
            <button
              onClick={() => handlePageChange(page - 1)}
              className="bg-transparent font-bold text-gray-400 py-1 px-2 rounded text-sm"
              disabled={page === 1}>
              Previous
            </button>

            <button
              onClick={() => handlePageChange(page + 1)}
              className="bg-transparent font-bold text-gray-400 py-1 px-2 rounded text-sm"
              disabled={page === totalPages}>
              Next
            </button>
          </div>
        </div>
      </BackgroundGradient>
    </div>
  );

};

export default DetailedPostView;