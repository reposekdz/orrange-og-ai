
import React, { useState, useRef } from 'react';
import type { TechOptions } from '../types';
import { FRONTEND_OPTIONS, BACKEND_OPTIONS, DATABASE_OPTIONS } from '../constants';
import { Sparkles, UploadCloud, XCircle } from 'lucide-react';

interface ControlsProps {
  onGenerate: (description: string, options: TechOptions, image: string | null) => void;
  isLoading: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ onGenerate, isLoading }) => {
  const [description, setDescription] = useState('A simple To-Do list application with user authentication.');
  const [techOptions, setTechOptions] = useState<TechOptions>({
    frontend: 'React',
    backend: 'Node.js (Express)',
    database: 'PostgreSQL',
  });
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOptionChange = (field: keyof TechOptions, value: string) => {
    setTechOptions(prev => ({ ...prev, [field]: value }));
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(description, techOptions, image);
  };
  
  const selectStyles = "w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none";
  const labelStyles = "block mb-2 text-sm font-medium text-gray-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full">
        <h2 className="text-xl font-semibold text-white">Project Configuration</h2>
        
        <div>
          <label htmlFor="description" className={labelStyles}>
            App Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            placeholder="e.g., A social media app for sharing photos"
          />
        </div>
        
        <div>
          <label className={labelStyles}>Visual Reference (Optional)</label>
          {image ? (
             <div className="relative group">
                <img src={image} alt="Upload preview" className="w-full h-32 object-cover rounded-md border-2 border-gray-600"/>
                <button 
                  type="button"
                  onClick={handleRemoveImage} 
                  className="absolute top-1 right-1 bg-gray-900/70 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <XCircle size={20} />
                </button>
             </div>
          ) : (
            <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700/80 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                <p className="text-xs text-gray-500">A mockup, sketch, or receipt</p>
              </div>
              <input ref={fileInputRef} id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          )}
        </div>

        <div>
          <label htmlFor="frontend" className={labelStyles}>Frontend</label>
          <select id="frontend" value={techOptions.frontend} onChange={(e) => handleOptionChange('frontend', e.target.value)} className={selectStyles}>
            {FRONTEND_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="backend" className={labelStyles}>Backend</label>
          <select id="backend" value={techOptions.backend} onChange={(e) => handleOptionChange('backend', e.target.value)} className={selectStyles}>
            {BACKEND_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="database" className={labelStyles}>Database</label>
          <select id="database" value={techOptions.database} onChange={(e) => handleOptionChange('database', e.target.value)} className={selectStyles}>
            {DATABASE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div className="flex-grow"></div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            'Generating...'
          ) : (
            <>
              <Sparkles size={20} className="mr-2" />
              Generate Architecture
            </>
          )}
        </button>
    </form>
  );
};