import React, { useState } from 'react';
import { Calendar, Send } from 'lucide-react';
import type { CreatePostData } from '../types';
import { tagOptions } from './tagOptions';

interface PostFormProps {
  onSubmit: (data: CreatePostData) => void;
}

export function PostForm({ onSubmit }: PostFormProps) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>(['javascript', 'react']);
  const [scheduledTime, setScheduledTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ content, title, scheduledTime, tags });
    setContent('');
    setTitle('');
    setScheduledTime('');
    setTags([]);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedTags = selectedOptions.map(option => option.value);

    if(tags.length<4){
setTags(prevTags => {
      const newTags = selectedTags.filter(tag => !prevTags.includes(tag));
      return [...prevTags, ...newTags];
    });
    }

    
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Post Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Title of the post"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Post Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          maxLength={280}
          placeholder="What's happening?"
          required
        />
      </div>

      <div>
        <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-2">
          Schedule Time
        </label>
        <div className="relative">
          <input
            type="datetime-local"
            id="scheduledTime"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
            required
          />
          <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
            >
              {tag}
              <button
                type="button"
                className="ml-1 text-gray-500 hover:text-gray-700"
                onClick={() => removeTag(tag)}
              >
                x
              </button>
            </span>
          ))}
          <select
            id="tags"
            value={tags}
            onChange={handleTagChange}
            multiple
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            size={4}
            required
          >
            {tagOptions.map((tag) => (
              <option key={tag.value} value={tag.value}>
                {tag.label}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Select up to 4 tags
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        <Send className="h-5 w-5" />
        Schedule Post
      </button>
    </form>
  );
}

