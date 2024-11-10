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
  createdBy: { userName: string };
}

const DetailedView = () => {

  const router = useRouter();
  const { id } = router.query;
  const [token, setToken] = useState('');

  const [template, setTemplate] = useState<CodeTemplate>();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken') || '';
    setToken(accessToken);
  }, []);

  useEffect(() => {
    if (id) {
      fetchTemplateDetails();
    }
  }, [id]);

  const fetchTemplateDetails = async () => {
    try {
      const response = await fetch(`/api/CodeTemplates?id=${id}`);
      if (!response.ok) {
        console.error('Error fetching template details');
        return;
      }
      const data = await response.json();
      setTemplate(data);
    } catch (error) {
      console.error('Error fetching template details', error);
    }
  };

  
  const handleFork = async (templateId: number) => {
    if (!token) {
      alert('Please login first!');
      setTimeout(() => {
        router.push('/Login');
      }, 500);
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

  if (!template) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">

        <div className="flex justify-center">
            <button
            onClick={() => router.push('/Templates')}
            className="text-blue-500 border border-gray-500 py-2 px-4 rounded hover:bg-blue-100">
            Back to Templates
            </button>
        </div>

        <div className="flex justify-between items-center mt-8">
            <h2 className="text-xl font-semibold">{template.title}</h2>
            
            <div className="text-gray-500">
                <span className="font-semibold">Created by: {template.createdBy.userName}</span>
            </div>
        </div>
        
        <Editor
            height="300px"
            language={template.language === 'c++' ? 'cpp' : template.language === 'c#' ? 'csharp' : template.language}
            value={template.code}
            options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollbar: { vertical: 'auto', horizontal: 'auto' },
                fontSize: 14,
                theme: 'vs-light',
            }}
            className="my-4 border border-blue-300 rounded"
        />

        <div className="mt-4">
            <p>{template.explanation}</p>
        </div>
        
        <p className="text-gray-500 mt-4">Language: {template.language}</p>

        <div className="flex space-x-2 mt-4">
            {template.tags.map((tag) => (
            <span key={tag.name} className="px-2 py-1 bg-blue-200 rounded">
                {tag.name}
            </span>
            ))}
        </div>

        <div className="flex justify-between mt-8">
            <button
            onClick={() => handleFork(template.id)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Fork Template
            </button>

            <button
            onClick={() => router.push(`/`)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Try or Edit
            </button>
        </div>

    </div>
  );
};

export default DetailedView;