import React, { useState, useEffect } from 'react';
import { HiX, HiPlus, HiTrash } from 'react-icons/hi';
import ImagePickerButton from './ImagePickerButton';

const ProjectForm = ({ project, onSubmit, onCancel, onImageSelect, selectedImage }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    github: '',
    live: '',
    technologies: [],
    category: 'web',
    featured: false,
    year: new Date().getFullYear().toString()
  });
  const [errors, setErrors] = useState({});
  const [newTechnology, setNewTechnology] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        image: project.image || '',
        github: project.github || '',
        live: project.live || '',
        technologies: project.technologies || [],
        category: project.category || 'web',
        featured: project.featured || false,
        year: project.year || new Date().getFullYear().toString()
      });
    }
  }, [project]);

  useEffect(() => {
    if (selectedImage) {
      console.log('ProjectForm: selectedImage changed:', selectedImage);
      setFormData(prev => ({ ...prev, image: selectedImage }));
    }
  }, [selectedImage]);



  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.description.length < 50) {
      newErrors.description = 'Description should be at least 50 characters';
    }

    if (!formData.year) {
      newErrors.year = 'Year is required';
    }

    if (formData.technologies.length === 0) {
      newErrors.technologies = 'At least one technology is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addTechnology = () => {
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
      setErrors(prev => ({ ...prev, technologies: '' }));
    }
  };

  const removeTechnology = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
    }
  };

  const categories = [
    { value: 'web', label: 'Web Development' },
    { value: 'fullstack', label: 'Full Stack' },
    { value: 'ai', label: 'AI & ML' },
    { value: 'mobile', label: 'Mobile Apps' }
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter project title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe your project (minimum 50 characters)"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
            )}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Image
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Image URL or select from gallery"
              />
              <ImagePickerButton
                onImageSelect={(file) => {
                  console.log('ProjectForm: Image selected:', file);
                  setFormData(prev => ({ ...prev, image: file.url }));
                }}
                selectedImage={formData.image}
                buttonText="Gallery"
                buttonVariant="outline"
                buttonSize="md"
              />
            </div>
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-32 h-20 object-cover rounded border"
                />
              </div>
            )}
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GitHub Repository
              </label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="https://github.com/username/repo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Live Demo
              </label>
              <input
                type="url"
                name="live"
                value={formData.live}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="https://your-project.com"
              />
            </div>
          </div>

          {/* Category and Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Year *
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.year ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {years.map(year => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.year && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.year}</p>
              )}
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Technologies *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Add technology (e.g., React, Node.js)"
              />
              <button
                type="button"
                onClick={addTechnology}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <HiPlus className="w-4 h-4" />
                Add
              </button>
            </div>
            
            {/* Technology Tags */}
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <HiTrash className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            {errors.technologies && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.technologies}</p>
            )}
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600"
            />
            <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Mark as featured project
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {project ? 'Update Project' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>


    </div>
  );
};

export default ProjectForm; 