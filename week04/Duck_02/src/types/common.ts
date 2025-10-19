export type commonResponse<T> = {
  status: number;
  statusCode: number;
  message: string;
  data: T;
};
