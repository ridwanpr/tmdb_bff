export type PaginatedResults<T> = {
  dates: {
    maximum: string;
    minium: string;
  };
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};
