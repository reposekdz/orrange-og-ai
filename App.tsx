
import React, { useState, useCallback } from 'react';
import { Controls } from './components/Controls';
import { FileTree } from './components/FileTree';
import { CodePreview } from './components/CodePreview';
import { Loader } from './components/Loader';
import type { FileNode, TechOptions } from './types';
import { generateProjectStructure } from './services/geminiService';
import { createProjectZip } from './services/zipService';
import { HardDriveDownload, LayoutGrid, FileCode, Bot } from 'lucide-react';

const App: React.FC = () => {
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (description: string, options: TechOptions, image: string | null) => {
    setIsLoading(true);
    setError(null);
    setFileTree(null);
    setSelectedFile(null);
    try {
      const generatedTree = await generateProjectStructure(description, options, image);
      setFileTree(generatedTree);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFileSelect = useCallback((file: FileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file);
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (fileTree) {
      createProjectZip(fileTree);
    }
  }, [fileTree]);

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-300 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot size={32} className="text-cyan-400"/>
            <h1 className="text-2xl font-bold text-white">Full-Stack App Architect AI</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        <aside className="lg:col-span-3 bg-gray-800 p-4 rounded-lg shadow-lg h-full">
          <Controls onGenerate={handleGenerate} isLoading={isLoading} />
        </aside>

        <section className="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
          <div className="md:col-span-4 bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col min-h-[300px] lg:min-h-0">
            <div className="flex items-center space-x-2 text-lg font-semibold mb-3 border-b border-gray-700 pb-2">
              <LayoutGrid size={20} className="text-blue-400" />
              <span>Project Structure</span>
            </div>
            <div className="flex-grow overflow-y-auto pr-2">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader />
                  <p className="mt-4 text-gray-500">Architecting your app...</p>
                </div>
              ) : error ? (
                <div className="text-red-400 p-4 bg-red-900/20 rounded-md">{error}</div>
              ) : fileTree ? (
                <FileTree node={fileTree} onFileSelect={handleFileSelect} selectedFile={selectedFile} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
                  <p>Your generated project structure will appear here.</p>
                </div>
              )}
            </div>
            {fileTree && !isLoading && (
              <button
                onClick={handleDownload}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                <HardDriveDownload size={20} className="mr-2" />
                Download Project (.zip)
              </button>
            )}
          </div>

          <div className="md:col-span-8 bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col min-h-[400px] lg:min-h-0">
            <div className="flex items-center space-x-2 text-lg font-semibold mb-3 border-b border-gray-700 pb-2">
              <FileCode size={20} className="text-green-400" />
              <span>Code Preview</span>
            </div>
            <div className="flex-grow overflow-hidden">
              <CodePreview file={selectedFile} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;