import { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaTimes, FaSpinner } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CloudinaryUpload = ({ value, onChange, label = 'Image', accept = 'image' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      if (accept !== 'pdf') {
        formData.append('folder', 'shabdham/news');
      }

      const endpoint = accept === 'pdf' ? '/upload/pdf' : '/upload/image';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearValue = () => {
    onChange('');
  };

  const acceptTypes = accept === 'pdf' ? '.pdf' : 'image/jpeg,image/png,image/gif,image/webp';

  return (
    <div>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
        {label}
      </label>

      {/* Preview */}
      {value && (
        <div className="relative mb-3">
          {accept === 'pdf' ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between">
              <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 font-bold hover:underline truncate flex-1">
                📄 {value.split('/').pop()}
              </a>
              <button type="button" onClick={clearValue} className="ml-2 w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 shrink-0">
                <FaTimes size={10} />
              </button>
            </div>
          ) : (
            <div className="relative inline-block">
              <img
                src={value}
                alt="Preview"
                className="h-24 w-auto rounded-lg object-cover border border-gray-200 shadow-sm"
              />
              <button
                type="button"
                onClick={clearValue}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600"
              >
                <FaTimes size={10} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-red-500 text-xs font-bold mb-2">{error}</div>
      )}

      {/* Upload button + manual URL fallback */}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptTypes}
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors disabled:opacity-50 shrink-0"
        >
          {uploading ? (
            <FaSpinner size={16} className="animate-spin" />
          ) : (
            <FaCloudUploadAlt size={16} />
          )}
          {uploading ? 'Uploading...' : `Upload ${accept === 'pdf' ? 'PDF' : 'Image'}`}
        </button>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={accept === 'pdf' ? 'Or paste PDF URL...' : 'Or paste image URL...'}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
        />
      </div>
    </div>
  );
};

export default CloudinaryUpload;
