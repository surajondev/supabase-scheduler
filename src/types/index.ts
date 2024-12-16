export interface ScheduledPost {
  content: string;
  scheduled_time: string;
  status: 'pending' | 'posted' | 'failed';
  title:string;
  tags: Array<string>
}

export interface CreatePostData {
  content: string;
  title:string;
  scheduledTime: string;
  tags: Array<string>
}