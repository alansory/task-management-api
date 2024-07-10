export class WebResponse<T> {  
  data?: T;
  status_code?: number;
  message?: string;
  access_token?: string;
  errors?: string;
  paging?: Paging;
}

export class Paging {
  per_page: number;
  total_page: number;
  total: number;
  current_page: number;
}
