import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, UserCircle2, Trash2, Mail, Briefcase, Calendar, Search, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { format } from 'date-fns';

export const Members = () => {
  const { currentUser, users, deleteUser, tasks } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  if (currentUser?.role !== 'Admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="h-20 w-20 rounded-3xl bg-rose-50 flex items-center justify-center mb-4 border border-rose-100">
          <ShieldCheck className="h-10 w-10 text-rose-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Access Denied</h2>
        <p className="text-slate-500 mt-2 font-medium">Only administrators can view this page.</p>
      </div>
    );
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      setUserToDelete(null);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Team Members</h2>
          <p className="text-slate-500 mt-1 font-medium">Manage your team, view their workload, and control access.</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredUsers.map((user, index) => {
            const userTasks = tasks.filter(t => t.assigneeId === user.id);
            const completedTasks = userTasks.filter(t => t.status === 'Done').length;
            const inProgressTasks = userTasks.filter(t => t.status === 'In Progress').length;
            const isCurrentUser = user.id === currentUser.id;

            return (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-2xl shadow-sm object-cover" />
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{user.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                          user.role === 'Admin' ? 'bg-rose-50 text-rose-600' :
                          user.role === 'Manager' ? 'bg-indigo-50 text-indigo-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {user.role}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600">
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {!isCurrentUser && (
                    <button
                      onClick={() => setUserToDelete(user.id)}
                      className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      title="Remove Member"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Workload Summary</h4>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-2xl p-3 text-center">
                      <div className="text-2xl font-black text-slate-700">{userTasks.length}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Total</div>
                    </div>
                    <div className="bg-amber-50 rounded-2xl p-3 text-center">
                      <div className="text-2xl font-black text-amber-600">{inProgressTasks}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mt-1">Active</div>
                    </div>
                    <div className="bg-emerald-50 rounded-2xl p-3 text-center">
                      <div className="text-2xl font-black text-emerald-600">{completedTasks}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mt-1">Done</div>
                    </div>
                  </div>
                </div>

                {/* Delete Confirmation Overlay */}
                <AnimatePresence>
                  {userToDelete === user.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center"
                    >
                      <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center mb-4 text-rose-600">
                        <AlertCircle className="h-6 w-6" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">Remove Member?</h4>
                      <p className="text-sm text-slate-500 mb-6">
                        Are you sure you want to remove <span className="font-bold text-slate-700">{user.name}</span>? Their tasks will be unassigned.
                      </p>
                      <div className="flex gap-3 w-full">
                        <button
                          onClick={() => setUserToDelete(null)}
                          className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={confirmDelete}
                          className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredUsers.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No members found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};
