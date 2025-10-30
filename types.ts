
export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
}

export interface TechOptions {
  frontend: string;
  backend: string;
  database: string;
}
