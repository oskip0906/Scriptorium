import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  tags: { name: string }[];
  codeTemplates: { id: number }[];
  createdBy: { userName: string };
}

const BlogPostsList = () => {

  const router = useRouter();
  const pageSize = 3;

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
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
      setCurrentPage(1);
      fetchPosts();
    }, 500);
  
    return () => {
      clearTimeout(handler);
    };
  }, [searchUser, searchTitle, searchDescription, searchContent, searchTags, order]);
  
  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      const query = new URLSearchParams({
        page: String(currentPage),
        pageSize: String(pageSize),
        order: order,
        description: searchDescription,
        content: searchContent,
        createdUser: searchUser,
        title: searchTitle,
        tags: searchTags.join(','),
      }).toString();

      console.log(query);

      const response = await fetch(`/api/BlogPosts?${query}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

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
    } 
    catch (error) {
      console.error('Error fetching blog posts');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>

      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <select 
          value={order} 
          onChange={(e) => setOrder(e.target.value)} 
          className="border p-2 rounded pr-8">
          <option value="desc">Most Valued</option>
          <option value="asc">Most Controversial</option>
        </select>

        <input 
          type="text"   
          placeholder="Search by title" 
          value={searchTitle} 
          onChange={(e) => setSearchTitle(e.target.value)} 
          className="border p-2 rounded w-1/8" 
        />
        
        <input 
          type="text" 
          placeholder="Search by description" 
          value={searchDescription} 
          onChange={(e) => setSearchDescription(e.target.value)} 
          className="border p-2 rounded w-1/8" 
        />

        <input 
          type="text" 
          placeholder="Search by content" 
          value={searchContent} 
          onChange={(e) => setSearchContent(e.target.value)} 
          className="border p-2 rounded w-1/8" 
        />

        <input 
          type="text" 
          placeholder="Search by username" 
          value={searchUser} 
          onChange={(e) => setSearchUser(e.target.value)} 
          className="border p-2 rounded w-1/8"
        />

        <div className="flex items-center border p-2 w-1/4 rounded h-10">
          {searchTags.map((tag) => (
            <span key={tag} className="flex items-center bg-blue-200 text-blue-800 px-2 py-1 rounded mr-1">
              {tag}
              <button
                onClick={() => {
                  handleRemoveTag(tag);
                  if (searchTags.length === 1) {
                    setPlaceholder('Add tags (press Enter)');
                  }
                }}
                className="ml-1 font-bold">
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
            className="border-none outline-none flex-grow h-full"
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
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Clear
        </button>

      </div>

      <div className="space-y-4">
        {blogPosts.map((post) => (
          <div key={post.id} className="p-4 border rounded shadow">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              
              <div className="text-gray-500">
                <span className="font-semibold">Created by: {post.createdBy.userName}</span>
              </div>
            </div>

            <p className="my-2">{post.description}</p>
            
            <div className="flex space-x-2 mt-2">
              {post.tags.map((tag) => (
                <span key={tag.name} className="px-2 py-1 bg-blue-200 rounded">
                  {tag.name}
                </span>
              ))}
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => router.push(`/blog/${post.id}`)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          disabled={currentPage === 1}>
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

    </div>
  );
}

export default BlogPostsList;