import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useContext } from 'react'
import { AppContext } from '@/pages/components/AppVars'
import Editor from '@monaco-editor/react';
import NavBar from '@/pages/components/Navbar';

interface CodeTemplate {
  id: number;
  title: string;
  code: string;
  explanation: string;
  language: string;
  tags: { name: string }[];
  createdBy: { userName: string };
  forkedFromID: number;
}

const DetailedTemplateView = () => {

  const context = useContext(AppContext);
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
    const response = await fetch(`/api/CodeTemplates?id=${id}`);

    if (!response.ok) {
      console.error('Error fetching template details');
      return;
    }

    const data = await response.json();
    console.log(data);
    setTemplate(data);
  };

  
  const handleFork = async (id: number) => {
    if (!token) {
      alert('Please login first!');
      setTimeout(() => {
        router.push('/Login');
      }, 500);
      return;
    }
    
    const response = await fetch(`/api/CodeTemplates/Fork`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    });

    if (!response.ok) {
      alert('Error forking template!');
      return;
    }

    alert('Code template forked successfully');
  };

  if (!template) {
    return;
  }

  return (
    <div className="fade-in container mx-auto p-4 mb-4">
      <NavBar />
    
      <div className="border rounded p-4">

        <div className="flex justify-between mt-4">
          <h2 className="text-xl font-semibold">{template.title} [ID: {template.id}]</h2>
          <span className="font-semibold">Created by: {template.createdBy.userName}</span>
        </div>

        {template.forkedFromID && (
          <button
            onClick={() => router.push(`/Templates/detailedView?id=${template.forkedFromID}`)}
            className="bg-gray-400 p-2 rounded my-4 text-center w-full">
            Note: This is a forked version. Click here to view original template!
          </button>
        )}

        {context && (
          <Editor
            height="40vh"
            language={template.language}
            value={template.code}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollbar: { vertical: 'auto', horizontal: 'auto' },
              fontSize: 14,
            }}
            theme={context.theme === 'light' ? 'vs-light' : 'vs-dark'}
            className="my-4 border border-accent rounded"
          />
        )}

        <div className="mt-4">
          <p>{template.explanation}</p>
        </div>
        
        <p className="mt-4">Language: {template.language}</p>

        {template.tags && template.tags.length !== 0 && (
          <div className="flex space-x-2 mt-4">
            {template.tags.map((tag) => (
              <span className="px-2 py-1 rounded" id="tag" key={tag.name}>
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-4">
          <button
            onClick={() => handleFork(template.id)}
            className="bg-button text-button-text py-2 px-4 rounded">
            Fork Template
          </button>

          <button
            onClick={() => router.push(`/Runner?id=${template.id}`)}
            className="bg-button text-button-text py-2 px-4 rounded">
            Try or Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailedTemplateView;