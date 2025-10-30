
import JSZip from 'jszip';
import saveAs from 'file-saver';
import type { FileNode } from '../types';

const addNodeToZip = (node: FileNode, zip: JSZip) => {
  if (node.type === 'folder') {
    const folder = zip.folder(node.name);
    if (folder && node.children) {
      node.children.forEach(child => addNodeToZip(child, folder));
    }
  } else if (node.type === 'file' && node.content !== undefined) {
    zip.file(node.name, node.content);
  }
};

export const createProjectZip = async (rootNode: FileNode): Promise<void> => {
  const zip = new JSZip();
  
  if (rootNode.children) {
    rootNode.children.forEach(child => {
        addNodeToZip(child, zip);
    });
  }

  try {
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${rootNode.name || 'project'}.zip`);
  } catch (error) {
    console.error("Failed to create zip file:", error);
    alert("An error occurred while creating the zip file.");
  }
};
