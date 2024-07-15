enum TaskStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class TaskResponse {
  id: number         
  title: string      
  description: string
  creator_id: number  
  assignee_id: number
  status: string     
  due_date: Date     
  created_at: Date  
  updated_at: Date   
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export class TaskRequest {
  id?: number         
  title?: string      
  description?: string
  creator_id?: number  
  assignee_id?: number
  status?: TaskStatus     
  due_date?: Date
  page?: number;
  per_page?: number;     
}