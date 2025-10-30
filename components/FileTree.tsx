
import React, { useState } from 'react';
import type { FileNode } from '../types';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';

interface FileTreeProps {
  node: FileNode;
  onFileSelect: (file: FileNode) => void;
  selectedFile: FileNode | null;
  level?: number;
}

export const FileTree: React.FC<FileTreeProps> = ({ node, onFileSelect, selectedFile, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(level < 2); // Auto-expand first few levels

  const isFolder = node.type === 'folder';
  const isSelected = selectedFile?.name === node.name && selectedFile?.content === node.content;

  const handleToggle = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = () => {
    if (!isFolder) {
      onFileSelect(node);
    }
  };

  const handleClick = () => {
    handleToggle();
    handleSelect();
  };
  
  const iconColor = isFolder ? 'text-yellow-400' : 'text-blue-400';
  const selectedBg = isSelected ? 'bg-blue-400/20' : '';
  const hoverBg = 'hover:bg-gray-700/50';

  return (
    <div>
      <div
        onClick={handleClick}
        style={{ paddingLeft: `${level * 20}px` }}
        className={`flex items-center space-x-2 p-1 cursor-pointer rounded-md ${selectedBg} ${hoverBg}`}
      >
        {isFolder ? (
          isOpen ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronRight size={16} className="text-gray-500" />
        ) : <div className="w-4"></div>}
        {isFolder ? <Folder size={16} className={iconColor} /> : <File size={16} className={iconColor} />}
        <span>{node.name}</span>
      </div>
      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTree 
              key={`${child.name}-${index}`} 
              node={child} 
              onFileSelect={onFileSelect} 
              selectedFile={selectedFile}
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
