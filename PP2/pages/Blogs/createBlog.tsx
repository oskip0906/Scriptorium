import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

interface CodeTemplate {
    id: number;
    title: string;
    createdBy: { userName: string };
    forkedFromID: number;
}

const BlogCreator = () => {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    const [codeTemplates, setCodeTemplates] = useState<CodeTemplate[]>([]);
    const [selectedTemplates, setSelectedTemplates] = useState<CodeTemplate[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const pageSize = 5;
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    useEffect(() => {
        fetchCodeTemplates(page);
    }, [page, searchQuery]);

    const handleCreateBlog = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !description || !content) {
            toast.warning('Please fill in all fields!');
            return;
        }

        const response = await fetch('/api/BlogPosts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                title,
                description,
                content,
                tags,
                codeTemplates: selectedTemplates.map((template) => template.id),
            }),
        });

        if (!response.ok) {
            toast.error('Error updating post!');
            return;
        }

        const newBlog = await response.json();

        toast.success('Blog created successfully!');
        setTimeout(() => {
            router.push(`/Blogs/detailedView?id=${newBlog.id}`);
        }, 500);
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const fetchCodeTemplates = async (page: number) => {

        const query = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize),
            title: searchQuery,
        }).toString();

        const response = await fetch(`/api/CodeTemplates?${query}`);

        if (!response.ok) {
            console.error('Failed to fetch code templates');
            return;
        }

        const data = await response.json();

        console.log(data);

        setCodeTemplates(data.codeTemplates);
        setTotalPages(data.totalPages);
    };

    const toggleTemplate = (template: any) => {
        if (selectedTemplates.some((t) => t.id === template.id)) {
            setSelectedTemplates(selectedTemplates.filter((t) => t.id !== template.id));
        } 
        else {
            setSelectedTemplates([...selectedTemplates, template]);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="container mx-auto p-4 mb-4">
            <div className="border rounded p-4">
                <h1 className="text-xl font-bold">Create New Blog Post</h1>

                <label className="block font-medium mt-4 mb-2">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border rounded px-2 py-1 outline-none"
                />

                <label className="block font-medium mt-4 mb-2">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-20 border rounded px-2 py-1 outline-none"
                />

                <label className="block font-medium mt-4 mb-2">Content</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-[25vh] border rounded px-2 py-1 outline-none"
                />

                <label className="block font-medium mt-4 mb-2">Tags</label>

                <div className="flex items-center w-full rounded h-10" id="tagSelect">
                    {tags.map((tag) => (
                        <span className="flex items-center px-2 py-1 rounded mr-1" id="tag" key={tag}>
                            {tag}
                            <button
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 font-bold bg-transparent text-gray-500">
                                &times;
                            </button>
                        </span>
                    ))}
                    <input
                        type="text"
                        placeholder="Add tags..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        className="border-none outline-none flex-grow h-full p-2"
                    />
                </div>

                <label className="block font-medium mt-4 mb-2">Code Templates</label>

                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border rounded px-2 py-1 outline-none"
                />

                <div className="border rounded p-4 max-h-[40vh] mt-2 overflow-y-auto">
                    {codeTemplates.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => toggleTemplate(template)}
                            className={`p-2 rounded mb-2 cursor-pointer border ${
                                selectedTemplates.some((t) => t.id === template.id)
                                    ? '!border-blue-500'
                                    : 'border-gray-500'
                            }`}>
                            <h3 className="font-semibold">{template.title}</h3>

                            {template.forkedFromID && (
                                <p className="text-xs">(Forked Template)</p>
                            )}

                            <p className="text-xs">Created by: {template.createdBy.userName}</p>
                        </div>
                    ))}

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

                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleCreateBlog}
                        className="bg-transparent text-gray-400 border-2 border-gray-400 font-bold py-2 px-4 rounded">
                        Create Blog
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogCreator;