interface ApiError {
  code: string;
  message: string;
}

interface ApiResponse {
  status: number;
  data: Record<string, unknown> | null;
  errors: ApiError[] | null;
  message: string | null;
}
