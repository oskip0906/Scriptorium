import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from '@/pages/components/AppVars';
import Editor from '@monaco-editor/react';

interface CodeTemplate {
  id: number;
  title: string;
  code: string;
  explanation: string;
  language: string;
  tags: { name: string }[];
  createdBy: { userName: string; id: number };
  forkedFromID: number;
}

const DetailedTemplateView = () => {
  
  const context = useContext(AppContext);
  const router = useRouter();

  const { id } = router.query;
  const [template, setTemplate] = useState<CodeTemplate>();
  const [originalTemplate, setOriginalTemplate] = useState<CodeTemplate>();
  const [editable, setEditable] = useState(false);

  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedExplanation, setUpdatedExplanation] = useState('');
  const [updatedTags, setUpdatedTags] = useState<string[]>([]);

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

    if (template && String(context?.userID) === String(template?.createdBy.id)) {
      setEditable(true);
      setUpdatedTitle(template.title || '');
      setUpdatedExplanation(template.explanation || '');
      setUpdatedTags(template.tags.map(tag => tag.name) || []);
    }
  }, [template]);

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
      return null;
    }

    const data = await response.json();
    return data;
  };

  const saveChanges = async () => {
    const updatedTemplate = {
      title: updatedTitle,
      explanation: updatedExplanation,
      tags: updatedTags.map(tag => ({ name: tag })),
    };

    const response = await fetch(`/api/CodeTemplates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(updatedTemplate),
    });

    if (response.ok) {
      alert('Template updated successfully');
      fetchTemplateDetails(); // Refresh the template details
    } else {
      alert('Error updating template');
    }
  };

  if (!template) {
    return <p>Loading template...</p>;
  }

  return (
    <div className="container mx-auto p-4 mb-4">
      <div className="border rounded p-4">
        <div className="flex justify-between mt-4">
          {editable ? (
            <input
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              className="border p-2 w-full rounded outline-none focus:ring focus:border"
            />
          ) : (
            <h2 className="text-xl font-semibold">{template.title}</h2>
          )}
            <span className="ml-8 font-semibold">Created by: {template.createdBy.userName}</span>
        </div>

        {originalTemplate && (
          <div className="mt-2">
            <p>
              [ Forked From:
              <span className="font-semibold"> {originalTemplate.title} </span>
              by <span className="font-semibold"> {originalTemplate.createdBy.userName} </span>
              ]
            </p>
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

        <p>Language: <span className="font-bold">{template.language}</span></p>

        <div className="mt-4">
          {editable ? (
            <textarea
              value={updatedExplanation}
              onChange={(e) => setUpdatedExplanation(e.target.value)}
              className="border p-2 w-full rounded outline-none focus:ring focus:border"
              rows={5}
            />
          ) : (
            <p>{template.explanation}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {editable ? (
            updatedTags.map((tag, index) => (
              <input
                key={index}
                value={tag}
                onChange={(e) => {
                  const newTags = [...updatedTags];
                  newTags[index] = e.target.value;
                  setUpdatedTags(newTags);
                }}
                className="border p-1 rounded"
              />
            ))
          ) : (
            template.tags.map(tag => (
              <span key={tag.name} className="px-2 py-1 bg-gray-200 rounded">
                {tag.name}
              </span>
            ))
          )}
        </div>

        {editable && (
          <div className="flex justify-center">
            <button
              onClick={saveChanges}
              className="bg-transparent text-gray-400 border-2 border-gray-400 font-bold py-2 px-4 rounded">
              Save Changes
            </button>
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