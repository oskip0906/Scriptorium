import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Editor from '@monaco-editor/react';

interface CodeTemplate {
  id: number;
  title: string;
  code: string;
  explanation: string;
  language: string;
  tags: { name: string }[];
}

const codeTemplatesList = () => {

  const router = useRouter();
  const pageSize = 3;

  const [token, setToken] = useState('');
  const [templates, setTemplates] = useState<CodeTemplate[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTitle, setSearchTitle] = useState('');
  const [searchLanguage, setSearchLanguage] = useState('');
  const [searchExplanation, setSearchExplanation] = useState('');
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tagsPlaceHolder, setPlaceholder] = useState('Add tags (press Enter)');

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken') || '';
    setToken(accessToken);
  }, []);

  useEffect(() => {
    fetchTemplates(currentPage, pageSize);
  }, [currentPage, token]);

  const fetchTemplates = async (page: number, pageSize: number) => {
    try {
      const query = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        title: searchTitle,
        language: searchLanguage,
        explanation: searchExplanation,
        tags: searchTags.join(','),
      }).toString();

      console.log(query);

      const response = await fetch(`/api/CodeTemplates?${query}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Error fetching templates');
        setTemplates([]);
        setTotalPages(1);
        return;
      }

      const data = await response.json();

      setTemplates(data.codeTemplates);
      setTotalPages(data.totalPages);
    } 
    catch (error) {
      console.error('Error fetching templates');
    }
  };

  const handleFork = async (templateId: number) => {
    if (!token) {
      console.error('No authentication token found');
      setTimeout(() => {
        router.push('/login');
      }, 1000);
      return;
    }

    try {
      const response = await fetch(`/api/CodeTemplates/Fork`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: templateId }),
      });

      if (!response.ok) {
        console.error('Error forking template');
        return;
      } 

      console.log('Code template forked successfully');
    } 
    catch (error) {
      console.error('Error forking code template');
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
      <h1 className="text-2xl font-bold mb-4">Code Templates</h1>

      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <input 
          type="text" 
          placeholder="Search by title" 
          value={searchTitle} 
          onChange={(e) => setSearchTitle(e.target.value)} 
          className="border p-2 rounded w-1/5 min-w-[150px]" 
        />

        <input 
          type="text" 
          placeholder="Search by language" 
          value={searchLanguage} 
          onChange={(e) => setSearchLanguage(e.target.value)} 
          className="border p-2 rounded w-1/5 min-w-[150px]" 
        />

        <input 
          type="text" 
          placeholder="Search by explanation" 
          value={searchExplanation} 
          onChange={(e) => setSearchExplanation(e.target.value)} 
          className="border p-2 rounded w-1/5 min-w-[150px]" 
        />

        <div className="flex items-center border p-2 rounded w-1/5 min-w-[150px]">
          {searchTags.map((tag) => (
            <span key={tag} className="flex items-center bg-blue-200 text-blue-800 px-2 py-1 rounded">
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
            className="border-none outline-none flex-grow"
          />
        </div>

        <button 
          onClick={() => fetchTemplates(currentPage, pageSize)} 
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Search
        </button>
      </div>

      <div className="space-y-4">
        {templates.map((template) => (
          <div key={template.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{template.title}</h2>
            <p className="text-gray-700">{template.explanation}</p>

            <Editor
              height="200px"
              language={template.language || 'javascript'}
              value={template.code}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollbar: { vertical: 'auto', horizontal: 'auto' },
                fontSize: 14,
                theme: 'vs-light',
              }}
              className="mt-8"
            />
            
            <p className="text-gray-500">Language: {template.language}</p>
            <div className="flex space-x-2 mt-2">
              {template.tags.map((tag) => (
                <span key={tag.name} className="px-2 py-1 bg-blue-200 rounded">
                  {tag.name}
                </span>
              ))}
            </div>

            <button
              onClick={() => handleFork(template.id)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Fork Template
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 rounded"
          disabled={currentPage === 1}>
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
          disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default codeTemplatesList;