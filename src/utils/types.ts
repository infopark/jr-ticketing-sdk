/* eslint-disable @typescript-eslint/no-explicit-any */
export type Keyable = { [key: string]: any };

export type FileObject = {
  name: string;
  filename: string;
  loading: boolean;
  error: string;
}
