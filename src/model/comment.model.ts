export class CommentRequest {
  id?: number         
  content?: string      
  user_id?: number  
  task_id?: number
  page?: number;
  per_page?: number;   
}

export class CommentResponse {
  id: number         
  content: string      
  user_id: number  
  task_id: number
  created_at: Date  
  updated_at: Date 
  user: {
    id: number;
    name: string;
    email: string;
  };
}