import React from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Clock3 } from 'lucide-react';
import type { ScheduledPost } from '../types';

interface ScheduledPostsProps {
  posts: ScheduledPost[];
}

const StatusIcon = ({ status }: { status: ScheduledPost['status'] }) => {
  switch (status) {
    case 'posted':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'failed':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Clock3 className="h-5 w-5 text-yellow-500" />;
  }
};

export function ScheduledPosts({ posts }: ScheduledPostsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Scheduled Posts</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No scheduled posts yet</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-800 mb-2">{post.title}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.scheduled_time).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(post.scheduled_time).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <StatusIcon status={post.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}