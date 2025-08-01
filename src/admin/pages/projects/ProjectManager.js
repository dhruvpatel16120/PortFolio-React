import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { toast } from 'react-toastify';
import { 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiStar,
  HiLink,
  HiCode
} from 'react-icons/hi';
import ProjectForm from '../../components/ProjectForm';
import MediaGallery from '../../components/MediaGallery';
import ImagePicker from '../../components/ImagePicker';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(projectsQuery);
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (projectData) => {
    try {
      const newProject = {
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await addDoc(collection(db, 'projects'), newProject);
      toast.success('Project added successfully');
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Failed to add project');
    }
  };

  const handleUpdateProject = async (projectData) => {
    try {
      const projectRef = doc(db, 'projects', editingProject.id);
      const updatedProject = {
        ...projectData,
        updatedAt: new Date()
      };
      
      await updateDoc(projectRef, updatedProject);
      toast.success('Project updated successfully');
      setShowForm(false);
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteDoc(doc(db, 'projects', projectId));
        toast.success('Project deleted successfully');
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowMediaGallery(false);
  };

  const getCategoryColor = (category) => {
    const colors = {
      web: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      fullstack: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      ai: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      mobile: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Project Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <HiPlus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {/* Project Image */}
            <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <HiCode className="w-12 h-12" />
                </div>
              )}
              
              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <HiStar className="w-3 h-3" />
                  Featured
                </div>
              )}
              
              {/* Actions */}
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={() => handleEdit(project)}
                  className="bg-white/90 hover:bg-white text-gray-700 p-1 rounded"
                >
                  <HiPencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="bg-red-500/90 hover:bg-red-500 text-white p-1 rounded"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Project Content */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {project.title}
                </h3>
                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {project.year}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {project.description}
              </p>

              {/* Category */}
              <div className="mb-3">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(project.category)}`}>
                  {project.category}
                </span>
              </div>

              {/* Technologies */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {project.technologies?.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies?.length > 3 && (
                    <span className="text-gray-500 text-xs">+{project.technologies.length - 3} more</span>
                  )}
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <HiCode className="w-4 h-4" />
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <HiLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <HiCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No projects yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Get started by adding your first project to showcase your work.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Add Your First Project
          </button>
        </div>
      )}

      {/* Project Form Modal */}
      {showForm && (
        <ProjectForm
          project={editingProject}
          onSubmit={editingProject ? handleUpdateProject : handleAddProject}
          onCancel={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
          onImageSelect={() => setShowMediaGallery(true)}
          selectedImage={selectedImage}
        />
      )}

      {/* Image Picker Modal */}
      {showMediaGallery && (
        <ImagePicker
          onSelect={(file) => handleImageSelect(file.url)}
          onCancel={() => setShowMediaGallery(false)}
          selectedImage={selectedImage}
          title="Select Project Image"
          description="Choose an image for your project from the media library"
        />
      )}
    </div>
  );
};

export default ProjectManager; 