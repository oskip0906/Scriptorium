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

  const pageSize = 3;

  const [templates, setTemplates] = useState<CodeTemplate[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  useEffect(() => {
    fetchTemplates(currentPage, pageSize, localStorage.getItem('accessToken') || '');
  }, [currentPage]);

  const fetchTemplates = async (page: number, pageSize: number, token: string) => {
    try {
        const response = await fetch(`/api/CodeTemplates?page=${page}&pageSize=${pageSize}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.error('Unauthorized. Redirecting to login.');
                router.push('/Login');
            }
            throw new Error('Failed to fetch templates');
        }

        const data = await response.json();
        setTemplates(data.codeTemplates);
        setTotalPages(data.totalPages);
    } catch (error) {
        console.error('Error fetching templates:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto p-4">
      
      <h1 className="text-2xl font-bold mb-4">Code Templates</h1>

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