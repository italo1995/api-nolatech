export interface IError {
  key: string,
  message: string,
  stack: string,
  path: string,
  method: string,
  request: string,
  time: string
}