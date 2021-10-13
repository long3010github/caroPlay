export enum HttpErrorType {
  REQUEST_ERROR = 'REQUEST_ERROR',
  CONFIG_ERROR = 'CONFIG_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
}

export interface ErrorDetail {
  domain: string;
  reason: string;
  message: string;
}
