import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface CodeTemplate {
  id: number;
  title: string;
  language: string;
  tags: { name: string }[],
  code: string;
  createdBy: { userName: string };
  forkedFromID: number;
}

const CodeTemplatesList = () => {

  const router = useRouter();
  const pageSize = 5;
  
  const [templates, setTemplates] = useState<CodeTemplate[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchUser, setSearchUser] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLanguage, setSearchLanguage] = useState('');
  const [searchExplanation, setSearchExplanation] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [searchTags, setSearchTags] = useState<string[]>([]);

  const [tagInput, setTagInput] = useState('');
  const [tagsPlaceHolder, setPlaceholder] = useState('Add tags (press Enter)');

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      fetchTemplates();
    }, 500);
  
    return () => {
      clearTimeout(handler);
    };
  }, [searchUser, searchTitle, searchLanguage, searchExplanation, searchCode, searchTags]);
  
  useEffect(() => {
    fetchTemplates();
  }, [page]);

  const fetchTemplates = async () => {
    
    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      createdUser: searchUser,
      title: searchTitle,
      language: searchLanguage,
      code: searchCode,
      explanation: searchExplanation,
      tags: searchTags.join(','),
    }).toString();

    console.log(query);

    const response = await fetch(`/api/CodeTemplates?${query}`);

    if (!response.ok) {
      console.error('Error fetching templates');
      setTemplates([]);
      setTotalPages(1);
      return;
    }

    const data = await response.json();

    console.log(data);

    setTemplates(data.codeTemplates);
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
      <h1 className="text-2xl font-bold mb-4">All Code Templates</h1>

      <div className="mb-4 flex flex-wrap gap-2 items-center justify-center bg-gray-500 bg-opacity-10 p-1">
        <select 
          value={searchLanguage} 
          onChange={(e) => setSearchLanguage(e.target.value)} 
          className="border p-2 rounded pr-8 outline-none">
            <option value="">Select language</option>
            <option value="c">C</option>
            <option value="cpp">Cpp</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="csharp">Csharp</option>
            <option value="rust">Rust</option>
            <option value="swift">Swift</option>
            <option value="go">Go</option>
            <option value="r">R</option>
            <option value="php">PHP</option>
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
          placeholder="Search by explanation" 
          value={searchExplanation} 
          onChange={(e) => setSearchExplanation(e.target.value)} 
          className="p-2 rounded w-full md:w-1/3 lg:w-1/4 outline-none" 
        />

        <input 
          type="text" 
          placeholder="Search by code" 
          value={searchCode} 
          onChange={(e) => setSearchCode(e.target.value)} 
          className="p-2 rounded w-full md:w-1/3 lg:w-1/4 outline-none"
        />

        <input 
          type="text" 
          placeholder="Search by user" 
          value={searchUser} 
          onChange={(e) => setSearchUser(e.target.value)} 
          className="p-2 rounded w-full md:w-1/3 lg:w-1/6 outline-none"
        />

        <div className="flex items-center w-full md:w-1/2 lg:w-1/2 rounded h-10" id="tagSelect">
          {searchTags.map((tag) => (
            <span className="flex items-center px-2 py-1 rounded mr-1" id="tag" key={tag}> 
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
            setSearchLanguage('');
            setSearchExplanation('');
            setSearchTags([]);
            setTagInput('');
            setPlaceholder('Add tags (press Enter)');
          }}
          className="px-6 py-2 rounded">
          Clear
        </button>

      </div>

      <div className="overflow-y-auto h-[60vh] p-4 border">
        {templates.map((template) => (
          <div className="p-4 border-b rounded shadow" key={template.id}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{template.title}</h2>
              <span className="font-semibold">Created by: {template.createdBy.userName}</span>
            </div>

            {template.forkedFromID && (
             <p>[ Forked Template ]</p>
            )}
            
            <p className="mt-2">Language: {template.language}</p>

            {template.tags && template.tags.length !== 0 && (
              <div className="flex space-x-2 mt-4">
                {template.tags.map((tag) => (
                  <span className="px-2 py-1 rounded" id="tag" key={tag.name}>
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => router.push(`Templates/detailedView?id=${template.id}`)}
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

export default CodeTemplatesList;