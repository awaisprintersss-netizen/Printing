'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { X, Upload, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { GalleryFormData, AdminGalleryItem } from '@/types/gallery';
import { galleryPlaceholder } from '@/lib/gallery-media';
import { galleryImageLimitLabel, getGalleryFileError } from '@/lib/gallery-upload-limits';

interface GalleryFormProps {
  item?: AdminGalleryItem | null;
  onClose: () => void;
  onSubmit: (data: GalleryFormData & { imageFile?: string }) => Promise<void>;
  loading: boolean;
  error?: string | null;
}

const categories = [
  { id: 'business', name: 'Business Cards' },
  { id: 'packaging', name: 'Packaging' },
  { id: 'labels', name: 'Labels & Stickers' },
  { id: 'brochures', name: 'Brochures' },
  { id: 'banners', name: 'Banners' },
  { id: 'specialty', name: 'Specialty Printing' },
];

const initialFormData: GalleryFormData = {
  title: '',
  category: 'business',
  description: '',
  tags: [],
  year: new Date().getFullYear().toString(),
  client: '',
  image: '',
};

export const GalleryForm = ({ item, onClose, onSubmit, loading, error }: GalleryFormProps) => {
  const [formData, setFormData] = useState<GalleryFormData>(() => item ? {
    title: item.title, category: item.category, description: item.description,
    tags: item.tags || [], year: item.year, client: item.client, image: item.image || '',
  } : initialFormData);
  const [tagInput, setTagInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState(item?.image || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!dialog.current?.open) dialog.current?.showModal();
  }, []);
  const close = () => dialog.current?.close();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fileError) return;
    
    let imageFile = '';
    
    // If there's a selected file, convert it to base64
    if (selectedFile) {
      const validationError = getGalleryFileError(selectedFile);
      if (validationError) {
        setFileError(validationError);
        return;
      }
      try {
        setUploading(true);
        imageFile = await convertToBase64(selectedFile);
      } catch {
        setFileError('The image could not be read. Select it again and retry.');
        return;
      } finally {
        setUploading(false);
      }
    }
    
    const submitData: GalleryFormData & { imageFile?: string } = {
      ...formData,
    };
    
    if (imageFile) {
      submitData.imageFile = imageFile;
    }
    
    await onSubmit(submitData);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validationError = getGalleryFileError(file);
      setFileError(validationError);
      if (validationError) {
        e.target.value = '';
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear the URL input when a file is selected
      setFormData({ ...formData, image: '' });
    }
  };

  const handleRemoveImage = () => {
    setFileError(null);
    setSelectedFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const presetImageUrls = [{ url: galleryPlaceholder, label: "Photo unavailable" }];

  const handlePresetImageClick = (url: string) => {
    setFileError(null);
    setSelectedFile(null);
    setImagePreview(url);
    setFormData({ ...formData, image: url });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <dialog
      ref={dialog}
      aria-labelledby="gallery-form-title"
      onClose={onClose}
      onCancel={event => { if (loading || uploading) event.preventDefault(); }}
      onClick={event => { if (event.target === event.currentTarget && !loading && !uploading) close(); }}
      className="m-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl bg-page-secondary text-left text-primary shadow-xl backdrop:bg-gray-900/75"
    >
      <div>
          {/* Header */}
          <div className="px-6 py-4 border-b border-light flex justify-between items-center bg-page-tertiary">
            <div>
              <h3 id="gallery-form-title" className="text-xl font-semibold text-primary">
                {item ? 'Edit Gallery Item' : 'Add New Gallery Item'}
              </h3>
              <p className="text-sm text-secondary mt-1">
                {item ? 'Update the gallery item details' : 'Fill in the details for the new gallery item'}
              </p>
            </div>
            <button
              onClick={close}
              aria-label="Close gallery editor"
              className="p-2 rounded-lg hover:bg-page-primary text-secondary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={loading || uploading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 bg-page-secondary">
            {error && <p role="alert" className="mb-4 rounded-lg border border-light p-3 text-primary">{error}</p>}
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 modal-scrollbar">
              {/* Title */}
              <div>
                <label htmlFor="gallery-title" className="block text-sm font-medium text-secondary mb-2">
                  Title *
                </label>
                <input id="gallery-title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-light rounded-lg bg-page-primary text-primary focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                  placeholder="Enter project title"
                  disabled={loading || uploading}
                />
              </div>

              {/* Category and Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gallery-category" className="block text-sm font-medium text-secondary mb-2">
                    Category *
                  </label>
                  <select id="gallery-category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-light rounded-lg bg-page-primary text-primary focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                    disabled={loading || uploading}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="gallery-year" className="block text-sm font-medium text-secondary mb-2">
                    Year
                  </label>
                  <input id="gallery-year"
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-3 border border-light rounded-lg bg-page-primary text-primary focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                    placeholder="e.g., 2024"
                    disabled={loading || uploading}
                  />
                </div>
              </div>

              {/* Client */}
              <div>
                <label htmlFor="gallery-client" className="block text-sm font-medium text-secondary mb-2">
                  Client *
                </label>
                <input id="gallery-client"
                  type="text"
                  required
                  aria-describedby="gallery-public-details"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full px-4 py-3 border border-light rounded-lg bg-page-primary text-primary focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                  placeholder="Enter client name"
                  disabled={loading || uploading}
                />
                <p id="gallery-public-details" className="mt-1 text-xs text-tertiary">Project details appear in the public gallery. Use approved names and keep customer contact details out.</p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="gallery-description" className="block text-sm font-medium text-secondary mb-2">
                  Description *
                </label>
                <textarea id="gallery-description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-light rounded-lg bg-page-primary text-primary focus:ring-2 focus:ring-accent focus:border-transparent resize-none transition-colors"
                  placeholder="Enter project description"
                  disabled={loading || uploading}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-2 border border-light rounded-lg bg-page-primary text-primary focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                    placeholder="Add a tag and press Enter"
                    disabled={loading || uploading}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-page-tertiary text-secondary rounded-lg hover:bg-page-primary hover:text-primary transition-colors disabled:opacity-50"
                    disabled={loading || uploading || !tagInput.trim()}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-page-tertiary text-secondary text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-accent focus:outline-none"
                        disabled={loading || uploading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-3">
                  Image *
                </label>
                
                {/* File Upload */}
                <div className="mb-4">
                  <div className="border-2 border-dashed border-light rounded-lg p-6 text-center hover:bg-page-tertiary transition-colors">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                      id="file-upload"
                      aria-describedby={fileError ? 'gallery-file-error' : undefined}
                      disabled={loading || uploading}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Upload className="w-12 h-12 text-tertiary" />
                        <div>
                          <p className="text-sm font-medium text-primary">
                            {selectedFile ? selectedFile.name : 'Click to upload image'}
                          </p>
                          <p className="text-xs text-tertiary mt-1">
                            Images up to {galleryImageLimitLabel}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={loading || uploading}
                          className="px-4 py-2 bg-page-primary text-secondary rounded-lg hover:bg-page-tertiary hover:text-primary transition-colors text-sm"
                        >
                          Choose File
                        </button>
                      </div>
                    </label>
                    {fileError && <p id="gallery-file-error" role="alert" className="mt-2 text-sm text-primary">{fileError}</p>}
                  </div>
                  
                  {/* Image Preview */}
                  {(imagePreview || selectedFile) && (
                    <div className="mt-4 relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-secondary">Preview:</span>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                          disabled={loading || uploading}
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-page-tertiary">
                        {imagePreview ? (
                          <Image src={imagePreview} alt="Selected gallery image preview" fill unoptimized className="object-cover" />
                        ) : selectedFile ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-tertiary animate-spin" />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>

                {/* OR separator */}
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-light"></div>
                  <span className="px-4 text-sm text-tertiary">OR</span>
                  <div className="flex-1 border-t border-light"></div>
                </div>

                {/* Image URL Input */}
                <div className="mb-4">
                  <label htmlFor="gallery-image-url" className="block text-sm font-medium text-secondary mb-2">
                    Enter Image URL
                  </label>
                  <input id="gallery-image-url"
                    type="text"
                    value={formData.image}
                    onChange={(e) => {
                      setFileError(null);
                      setFormData({ ...formData, image: e.target.value });
                      setSelectedFile(null);
                      setImagePreview(e.target.value);
                    }}
                    className="w-full px-4 py-2 border border-light rounded-lg bg-page-primary text-primary focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                    placeholder="https://example.com/image.jpg"
                    disabled={loading || uploading || !!selectedFile}
                  />
                </div>

                {/* Preset Images */}
                <div>
                  <p className="text-sm text-secondary mb-2">Quick select from presets:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {presetImageUrls.map((preset, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handlePresetImageClick(preset.url)}
                        className={`p-2 border rounded-lg text-center hover:bg-page-tertiary transition-colors ${
                          imagePreview === preset.url 
                            ? 'border-accent bg-accent/10' 
                            : 'border-light'
                        }`}
                        disabled={loading || uploading}
                      >
                        <div className="w-full h-16 rounded bg-page-tertiary mb-1 flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-tertiary" />
                        </div>
                        <span className="text-xs text-secondary truncate">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 pt-6 border-t border-light flex justify-end gap-3">
              <button
                type="button"
                onClick={close}
                className="px-6 py-3 border border-light text-secondary rounded-lg hover:bg-page-primary hover:text-primary transition-colors font-medium disabled:opacity-50"
                disabled={loading || uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading || !!fileError || (!selectedFile && !formData.image)}
                className="px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
              >
                {(loading || uploading) ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {uploading ? 'Uploading...' : (item ? 'Updating...' : 'Creating...')}
                  </>
                ) : (
                  item ? 'Update Item' : 'Create Item'
                )}
              </button>
            </div>
          </form>
      </div>
    </dialog>
  );
};
