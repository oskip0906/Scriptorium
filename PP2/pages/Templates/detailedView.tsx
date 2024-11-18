import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from '@/pages/components/AppVars'
import Editor from '@monaco-editor/react';

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
  const [template, setTemplate] = useState<CodeTemplate>();
  const [originalTemplate, setOriginalTemplate] = useState<CodeTemplate>();

  useEffect(() => {
    if (id) {
      fetchTemplateDetails();
    }
  }, [id]);

  useEffect(() => {
    const fetchOriginal = async () => {
      if (template?.forkedFromID) {
        const original = await fetchOriginalTemplate(template.forkedFromID);
        setOriginalTemplate(original);
      }
    };
    fetchOriginal();
  }, [template?.forkedFromID]);

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

  const fetchOriginalTemplate = async (id: number) => {
    const response = await fetch(`/api/CodeTemplates?id=${id}`);

    if (!response.ok) {
      console.error('Error fetching original template');
      return;
    }

    const data = await response.json();
    console.log(data);
    return data;
  }

  if (!template) {
    return;
  }

  return (
    <div className="container mx-auto p-4 mb-4">
    
      <div className="border rounded p-4">

        <div className="flex justify-between mt-4">
          <h2 className="text-xl font-semibold">{template.title}</h2>
          <span className="font-semibold">Created by: {template.createdBy.userName}</span>
        </div>

        {originalTemplate && (
            <div className="mt-2">
              <p>[ Forked From: 
              <span className="font-semibold"> {originalTemplate.title} </span> 
              by <span className="font-semibold"> {originalTemplate.createdBy.userName} </span>
              ]</p>
            </div>
        )}

        <Editor
          height="25vh"
          language={template.language}
          value={template.code}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollbar: { vertical: 'auto', horizontal: 'auto' },
            fontSize: 14,
          }}
          theme={context?.theme === 'light' ? 'vs-light' : 'vs-dark'}
          className="my-4 border border-accent rounded"
        />

        <div className="mt-2">
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

        <div className="flex justify-between mt-6">
          <button
            onClick={() => router.push(`/Runner?id=${template.id}`)}
            className="text-button-text py-2 px-4 rounded">
            Try or Edit Template
          </button>

          {template.forkedFromID && (
            <button
              onClick={() => router.push(`/Templates/detailedView?id=${template.forkedFromID}`)}
              className="bg-gray-400 text-button-text py-2 px-4 rounded">
              View Original Template
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedTemplateView;