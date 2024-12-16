import React, { useEffect, useState } from 'react';
import { Newspaper } from 'lucide-react';
import { PostForm } from './components/PostForm';
import { ScheduledPosts } from './components/ScheduledPosts';
import type { ScheduledPost, CreatePostData } from './types';
import {supabase} from '../lib/supabase'

function App() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);

  const handleSchedulePost = async (data: CreatePostData) => {
    // In a real app, this would make an API call to your edge function
    const newPost: ScheduledPost = {
      content: data.content,
      scheduled_time: data.scheduledTime,
      status: 'pending',
      title: data.title,
      tags: data.tags
    };

    const { error } = await supabase
  .from('scheduled_posts')
  .insert(newPost)

  if (error){
    alert(`Erorr: ${error}`)
    return
  }

    // setPosts((prev) => [...prev, newPost]);
  };

  const fetchScheduedPost = async () => {
    const { data, error } = await supabase
  .from('scheduled_posts')
  .select()

  if(error){
    alert(`Erorr Fetching Data: ${error}`)
    return
  }

  setPosts(data)

  } 

  useEffect(() => {
    fetchScheduedPost()
  },[])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Newspaper className="h-8 w-8 text-blue-500" />
            <h1 className="text-xl font-bold text-gray-900">Dev.to Post Scheduler</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Schedule New Post</h2>
            <PostForm onSubmit={handleSchedulePost} />
          </div>
          <div>
            <ScheduledPosts posts={posts} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;