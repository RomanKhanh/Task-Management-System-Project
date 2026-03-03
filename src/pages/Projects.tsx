import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { Plus, MoreVertical, Calendar, Users, FolderKanban, ArrowRight, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export const Projects = () => {
  const { projects, currentUser, users, addProject, deleteProject } = useAppContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const canCreateProject = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName && currentUser) {
      addProject({
        name: newProjectName,
        description: newProjectDesc,
        managerId: currentUser.id,
        memberIds: [currentUser.id],
      });
      setIsCreateModalOpen(false);
      setNewProjectName('');
      setNewProjectDesc('');
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">Projects</h2>
          <p className="text-slate-500 mt-2 font-medium max-w-md">
            Manage your team's workflow and track progress across all active initiatives.
          </p>
        </div>
        {canCreateProject && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-500 transition-all"
          >
            <Plus className="h-5 w-5" />
            Create Project
          </motion.button>
        )}
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => {
            const manager = users.find(u => u.id === project.managerId);
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/projects/${project.id}`}
                  className="group relative flex flex-col h-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-200 hover:border-indigo-200"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                      <FolderKanban className="h-7 w-7" />
                    </div>
                    <div className="flex gap-1">
                      {currentUser?.role === 'Admin' && (
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            if (window.confirm('Are you sure you want to delete this project?')) {
                              deleteProject(project.id);
                            }
                          }}
                          className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {project.name}
                    </h3>
                    <p className="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-3 font-medium">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {project.memberIds.slice(0, 3).map((id, i) => {
                        const user = users.find(u => u.id === id);
                        return (
                          <img 
                            key={id}
                            src={user?.avatar} 
                            className="h-7 w-7 rounded-full border-2 border-white shadow-sm" 
                            alt=""
                          />
                        );
                      })}
                      {project.memberIds.length > 3 && (
                        <div className="h-7 w-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          +{project.memberIds.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                      View Board
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsCreateModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-900">New Project</h3>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Project Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    autoFocus
                    className="block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                    placeholder="e.g. Q4 Marketing Campaign"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Description</label>
                  <textarea
                    id="description"
                    rows={4}
                    className="block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-indigo-500 focus:ring-indigo-500 transition-all resize-none"
                    placeholder="Briefly describe the project goals..."
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 rounded-2xl px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-500 transition-all"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
