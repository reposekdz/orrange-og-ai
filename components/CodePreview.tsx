
import React, { useState, useEffect } from 'react';
import type { FileNode } from '../types';
import { Copy, Check, TerminalSquare } from 'lucide-react';

interface CodePreviewProps {
  file: FileNode | null;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ file }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
      setCopied(false);
  }, [file]);

  const handleCopy = () => {
    if (file?.content) {
      navigator.clipboard.writeText(file.content);
      setCopied(true);
    }
  };

  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
        <TerminalSquare size={48} />
        <p className="mt-4">Select a file to view its content.</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-gray-900 rounded-md overflow-hidden">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
        title="Copy code"
      >
        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
      </button>
      <pre className="h-full w-full overflow-auto p-4 text-sm">
        <code className="font-mono">{file.content}</code>
      </pre>
    </div>
  );
};
