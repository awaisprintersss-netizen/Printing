'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Eye, Search, Filter, 
  Download, Upload, RefreshCw,
  ChevronLeft, ChevronRight, AlertCircle, CheckCircle
} from 'lucide-react';
import { AdminGalleryItem, GalleryFormData } from '@/types/gallery';
import { GalleryForm } from './GalleryForm';
import { AdminLoading } from './AdminLoading';
import { galleryImageSource } from '@/lib/gallery-media';
import { galleryJsonLimit } from '@/lib/gallery-upload-limits';

export const GalleryManager = () => {
  const [items, setItems] = useState<AdminGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminGalleryItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'business', name: 'Business Cards' },
    { id: 'packaging', name: 'Packaging' },
    { id: 'labels', name: 'Labels & Stickers' },
    { id: 'brochures', name: 'Brochures' },
    { id: 'banners', name: 'Banners' },
    { id: 'specialty', name: 'Specialty Printing' },
  ];

  const fetchItems = () => {
    setLoading(true);
    setError(null);
    setRefresh(value => value + 1);
  };

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/admin/gallery", { signal: controller.signal });
        const data = await response.json();
        if (controller.signal.aborted) return;
        if (response.ok && data.success) setItems(data.items);
        else setError(data.error || "Failed to fetch items");
      } catch {
        if (!controller.signal.aborted) setError("Error fetching gallery items");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [refresh]);

  // Handle form submission
  const handleSubmit = async (formData: GalleryFormData & { imageFile?: string }) => {
    try {
      setFormLoading(true);
      setError(null);
      
      const url = '/api/admin/gallery';
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem 
        ? { ...formData, _id: editingItem._id }
        : formData;
      const payload = JSON.stringify(body);
      const sizeError = 'The request is too large. Choose a smaller image or shorten the project details.';
      if (new TextEncoder().encode(payload).byteLength > galleryJsonLimit) {
        setError(sizeError);
        return;
      }
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });
      if (response.status === 413 && !response.headers.get('content-type')?.includes('application/json')) {
        setError(sizeError);
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage(data.message || `Item ${editingItem ? 'updated' : 'created'} successfully!`);
        setShowForm(false);
        setEditingItem(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
        
        fetchItems(); // Refresh the list
      } else {
        setError(data.error || `Failed to ${editingItem ? 'update' : 'create'} item`);
      }
    } catch (err) {
      setError('Error saving item. Please try again.');
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      setDeleteLoading(id);
      const response = await fetch(`/api/admin/gallery?id=${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('Item deleted successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchItems(); // Refresh the list
      } else {
        setError(data.error || 'Failed to delete item');
      }
    } catch (err) {
      setError('Error deleting item');
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const latestUpdate = items.reduce((latest, item) => Math.max(latest, new Date(item.updatedAt || item.createdAt || 0).getTime() || 0), 0);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  if (loading && items.length === 0) {
    return <AdminLoading />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">
            Gallery Management
          </h2>
          <p className="text-secondary">
            Manage your printing gallery items ({filteredItems.length} items)
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchItems()}
            disabled={loading}
            className="px-4 py-2 border border-light text-secondary rounded-lg hover:bg-page-primary hover:text-primary transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
              setError(null);
            }}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" />
            Add New Item
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="bg-green-100/50 border border-green-200 rounded-lg p-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-600 hover:text-green-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-100/50 border border-red-200 rounded-lg p-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-page-secondary rounded-xl p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary">Total Items</p>
              <p className="text-2xl font-bold text-primary mt-1">{items.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/10">
              <Eye className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-page-secondary rounded-xl p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary">Categories</p>
              <p className="text-2xl font-bold text-primary mt-1">
                {new Set(items.map(item => item.category)).size}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10">
              <Filter className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-page-secondary rounded-xl p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary">This Year</p>
              <p className="text-2xl font-bold text-primary mt-1">
                {items.filter(item => item.year === new Date().getFullYear().toString()).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Download className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-page-secondary rounded-xl p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary">Last Updated</p>
              <p className="text-lg font-bold text-primary mt-1">
                {latestUpdate ? new Date(latestUpdate).toLocaleDateString() : "Never"}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10">
              <Upload className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-page-secondary rounded-xl p-4 shadow">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-tertiary" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-light rounded-lg bg-page-primary text-primary focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-light rounded-lg bg-page-primary text-primary focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-page-secondary rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-light">
            <thead className="bg-page-tertiary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-tertiary">
                      {searchQuery || selectedCategory !== 'all' 
                        ? 'No items match your filters'
                        : 'No gallery items found'
                      }
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item._id} className="hover:bg-page-primary transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10 rounded-lg bg-page-tertiary flex items-center justify-center mr-3">
                          <span className="text-tertiary">🖼️</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-primary">
                            {item.title}
                          </div>
                          <div className="text-sm text-secondary line-clamp-1">
                            {item.description.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.category === 'business' ? 'bg-blue-100 text-blue-800' :
                        item.category === 'packaging' ? 'bg-green-100 text-green-800' :
                        item.category === 'labels' ? 'bg-purple-100 text-purple-800' :
                        item.category === 'brochures' ? 'bg-yellow-100 text-yellow-800' :
                        item.category === 'banners' ? 'bg-red-100 text-red-800' :
                        'bg-page-tertiary text-secondary'
                      }`}>
                        {categories.find(c => c.id === item.category)?.name || item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-primary">
                      {item.client}
                    </td>
                    <td className="px-6 py-4 text-sm text-primary">
                      {item.year}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {item.tags?.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-page-tertiary text-secondary rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags && item.tags.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-page-tertiary text-secondary rounded">
                            +{item.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setShowForm(true);
                            setError(null);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:text-blue-700"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(item._id!)}
                          disabled={deleteLoading === item._id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors hover:text-red-700 disabled:opacity-50"
                          title="Delete"
                        >
                          {deleteLoading === item._id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                        
                        {galleryImageSource(item.image) && (
                          <a href={galleryImageSource(item.image)!} target="_blank" rel="noopener noreferrer" className="p-2 text-secondary hover:bg-page-tertiary rounded-lg transition-colors hover:text-primary" aria-label={"Preview image: " + item.title}>
                            <Eye className="w-4 h-4" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-light">
            <div className="flex items-center justify-between">
              <div className="text-sm text-secondary">
                Showing <span className="font-medium text-primary">{startIndex + 1}</span> to{' '}
                <span className="font-medium text-primary">{Math.min(startIndex + itemsPerPage, filteredItems.length)}</span> of{' '}
                <span className="font-medium text-primary">{filteredItems.length}</span> results
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-light text-secondary rounded-lg hover:bg-page-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg font-medium ${
                        currentPage === pageNum
                          ? 'bg-accent text-white'
                          : 'text-secondary hover:bg-page-tertiary hover:text-primary'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-light text-secondary rounded-lg hover:bg-page-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <GalleryForm
          key={editingItem?._id ?? "new"}
          item={editingItem}
          error={error}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
            setError(null);
          }}
          onSubmit={handleSubmit}
          loading={formLoading}
        />
      )}
    </div>
  );
};
