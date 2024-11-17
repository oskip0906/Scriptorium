import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  tags: { name: string }[];
  rating: number;
  createdBy: { userName: string };
}

const BlogPostsList = () => {

  const router = useRouter();
  const pageSize = 5;

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [order, setOrder] = useState('desc');
  const [searchUser, setSearchUser] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [searchDescription, setSearchDescription] = useState('');
  const [searchContent, setSearchContent] = useState('');
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tagsPlaceHolder, setPlaceholder] = useState('Add tags (press Enter)');

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      fetchPosts();
    }, 500);
  
    return () => {
      clearTimeout(handler);
    };
  }, [searchUser, searchTitle, searchDescription, searchContent, searchTags, order]);
  
  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {

    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      order: order,
      description: searchDescription,
      content: searchContent,
      createdUser: searchUser,
      title: searchTitle,
      tags: searchTags.join(','),
    }).toString();

    console.log(query);

    const response = await fetch(`/api/BlogPosts?${query}`);

    if (!response.ok) {
      console.error('Error fetching blog posts');
      setBlogPosts([]);
      setTotalPages(1);
      return;
    }

    const data = await response.json();

    console.log(data);

    setBlogPosts(data.posts);
    setTotalPages(data.totalPages);

  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!searchTags.includes(tagInput.trim())) {
        setSearchTags([...searchTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSearchTags(searchTags.filter((t) => t !== tag));
  };

  return (
    <div className="container mx-auto p-4 mb-4">
      
      <h1 className="text-2xl font-bold mb-4">All Blog Posts</h1>

      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <select 
          value={order} 
          onChange={(e) => setOrder(e.target.value)} 
          className="border p-2 rounded pr-8 outline-none">
          <option value="desc">Most Valued</option>
          <option value="asc">Most Controversial</option>
        </select>

        <input 
          type="text"   
          placeholder="Search by title" 
          value={searchTitle} 
          onChange={(e) => setSearchTitle(e.target.value)} 
          className="p-2 rounded w-full md:w-1/3 lg:w-1/4 outline-none" 
        />

        <input 
          type="text" 
          placeholder="Search by description" 
          value={searchDescription} 
          onChange={(e) => setSearchDescription(e.target.value)} 
          className="p-2 rounded w-full md:w-1/3 lg:w-1/4 outline-none" 
        />

        <input 
          type="text" 
          placeholder="Search by content" 
          value={searchContent} 
          onChange={(e) => setSearchContent(e.target.value)} 
          className="p-2 rounded w-full md:w-1/3 lg:w-1/4 outline-none" 
        />

        <input 
          type="text" 
          placeholder="Search by user" 
          value={searchUser} 
          onChange={(e) => setSearchUser(e.target.value)} 
          className="p-2 rounded w-full md:w-1/3 lg:w-1/4 outline-none"
        />

        <div className="flex items-center w-full md:w-3/4 lg:w-1/2 rounded h-10" id="tagSelect">
          {searchTags.map((tag) => (
            <span className="flex items-center px-2 py-1 rounded mr-1" id="tag">
              {tag}
                <button
                  onClick={() => {
                    handleRemoveTag(tag);
                    if (searchTags.length === 1) {
                    setPlaceholder('Add tags (press Enter)');
                    }
                  }}
                  className="ml-1 font-bold bg-transparent text-gray-500">
                  &times;
                </button>
            </span>
          ))}

          <input
            type="text"
            placeholder={tagsPlaceHolder}
            value={tagInput}
            onChange={(e) => { setTagInput(e.target.value); setPlaceholder(''); }}
            onKeyDown={handleAddTag}
            className="border-none outline-none flex-grow h-full p-2"
          />
        </div>

        <button
          onClick={() => {
            setSearchUser('');
            setSearchTitle('');
            setSearchDescription('');
            setSearchContent('');
            setSearchTags([]);
            setTagInput('');
            setPlaceholder('Add tags (press Enter)');
            setOrder('desc');
          }}
          className="px-6 py-2 rounded">
          Clear
        </button>
      </div>

      <div className="overflow-y-auto h-[60vh] p-4 border">
        {blogPosts.map((post) => (
          <div className="p-4 border-b rounded shadow" key={post.id}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <span className="font-semibold">Created by: {post.createdBy.userName}</span>
            </div>

            <p className="my-2">{post.description}</p>

            {post.tags && post.tags.length !== 0 && (
              <div className="flex space-x-2 mt-4">
                {post.tags.map((tag) => (
                  <span className="px-2 py-1 rounded" id="tag" key={tag.name}>
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => router.push(`Blogs/detailedView?id=${post.id}`)}
              className="mt-4 px-4 py-2 rounded">
              Read More
            </button>
          </div>
        ))}
      </div>

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
  );
}

export default BlogPostsList;