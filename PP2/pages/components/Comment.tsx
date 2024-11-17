import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Comment {
  id: number;
  content: string;
  rating: number;
  createdBy: { userName: string };
}

const CommentComponent: React.FC<{ comment: Comment }> = ({ comment }) => {

  const router = useRouter();
  const pageSize = 5;

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [ratingChange, setRatingChange] = useState(false);
  const [currentComment, setCurrentComment] = useState<Comment>(comment);

  useEffect(() => {
    fetchReplies(page);
  }, [page]);

  useEffect(() => {
    fetchComment();
  }, [ratingChange]);

  const fetchComment = async () => {
    const response = await fetch(`/api/Comments?id=${comment.id}`);
    
    if (!response.ok) {
      console.error(`Error fetching comment ${comment.id}`);
      return;
    }

    const updatedComment = await response.json();
    setCurrentComment(updatedComment);
  };

  const fetchReplies = async (page: number) => {
    const response = await fetch(`/api/Comments?repliedToId=${comment.id}&page=${page}&pageSize=${pageSize}&order=desc`);
    
    if (!response.ok) {
      console.error(`Error fetching replies for comment ${comment.id}`);
      setTotalPages(1);
      setHasMore(false);
      return;
    }

    const data = await response.json();

    setReplies((prevReplies) => (page === 1 ? data.comments : [...prevReplies, ...data.comments]));
    setTotalPages(data.totalPages);
  };

  const createRating = async (value: number, id: number, type: string) => {

    if (type === 'Comment' || type === 'Blog') {
      
      const response = await fetch(`/api/Ratings/${type}`, {
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
    }
  };

  const toggleExpand = () => {
    if (!isExpanded) {
      setPage(1);
      fetchReplies(1);
    } 
    else {
      setReplies([]);
    }
    setIsExpanded(!isExpanded);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (!currentComment) {
    return null;
  }

  return (
    <div className="border p-4 m-1">

      <div className="flex justify-between items-center">
        <p className="inline-block ml-2">{currentComment.content} 
        <span className="italic font-semibold"> - {currentComment.createdBy.userName}</span>
        </p>

        {hasMore && (
          <button onClick={toggleExpand} className="p-1 mt-2 rounded text-xs">
          {isExpanded ? '<< collapse' : 'expand >>'}
          </button>
        )}
      </div>

        <div className="flex items-center space-x-2">
          <button onClick={async () => { await createRating(1, currentComment.id, 'Comment'); }} className="bg-transparent"> ⬆️ </button>
          <span>{currentComment.rating}</span>
          <button onClick={async () => { await createRating(-1, currentComment.id, 'Comment'); }} className="bg-transparent"> ⬇️ </button>
        </div>

      {isExpanded && (
        <div className="ml-2 mt-2">
          {replies.map((reply) => (
            <CommentComponent key={reply.id} comment={reply} />
          ))}

          <div className="flex justify-between mt-2">
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
      )}
    </div>
  );
};

export default CommentComponent;