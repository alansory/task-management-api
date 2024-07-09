export class WebResponse<T> {
  access_token?: string;
  data?: T;
  errors?: string;
  paging?: Paging;
}

export class Paging {
  per_page: number;
  total_page: number;
  total: number;
  current_page: number;
}
