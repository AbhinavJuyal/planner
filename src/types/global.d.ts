interface ApiResponseType {
  status: number;
  data: Record<string, unknown> | null;
  errors: { code: string; message: string }[] | null;
  message: string | null;
}
