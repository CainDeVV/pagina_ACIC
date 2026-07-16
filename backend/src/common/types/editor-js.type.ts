export type EditorJsContent = {
  time?: number;
  blocks: { type: string; data: Record<string, any>; [key: string]: any }[];
  version?: string;
  [key: string]: any;
};
