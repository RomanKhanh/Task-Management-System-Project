import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { TaskStatus, Task, Subtask } from '../types';
import { Plus, MoreHorizontal, Calendar, MessageSquare, ArrowLeft, XCircle, Trash2, Clock, CheckCircle2, AlertCircle, TrendingUp, ListTodo, ArrowRight, LayoutGrid, AlignLeft } from 'lucide-react';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';
import { GanttChart } from '../components/GanttChart';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STATUSES: TaskStatus[] = ['To Do', 'In Progress', 'Done', 'Cancel'];

const STATUS_CONFIG: Record<TaskStatus, { color: string, bg: string, icon: any }> = {
  'To Do': { color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Clock },
  'In Progress': { color: 'text-amber-600', bg: 'bg-amber-50', icon: TrendingUp },
  'Done': { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
  'Cancel': { color: 'text-rose-600', bg: 'bg-rose-50', icon: XCircle },
};

export const ProjectBoard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, tasks, subtasks, users, currentUser, addTask, updateTask, deleteTask, comments, addComment, addSubtask, updateSubtask, deleteSubtask } = useAppContext();
  
  const project = projects.find(p => p.id === id);
  const projectTasks = tasks.filter(t => t.projectId === id);
  const projectSubtasks = subtasks.filter(st => projectTasks.some(t => t.id === st.taskId));

  const [viewMode, setViewMode] = useState<'board' | 'gantt'>('board');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('To Do');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskStartDate, setTaskStartDate] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  
  const [newComment, setNewComment] = useState('');
  
  // Subtask form state
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskStart, setNewSubtaskStart] = useState('');
  const [newSubtaskEnd, setNewSubtaskEnd] = useState('');

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="h-20 w-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
          <AlertCircle className="h-10 w-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Project not found</h2>
        <button onClick={() => navigate('/projects')} className="mt-4 text-indigo-600 font-bold hover:underline">
          Back to Projects
        </button>
      </div>
    );
  }

  const handleOpenTaskModal = (task?: Task) => {
    if (task) {
      setSelectedTask(task);
      setTaskTitle(task.title);
      setTaskDesc(task.description);
      setTaskStatus(task.status);
      setTaskAssignee(task.assigneeId || '');
      setTaskStartDate(task.startDate.split('T')[0]);
      setTaskDeadline(task.deadline.split('T')[0]);
    } else {
      setSelectedTask(null);
      setTaskTitle('');
      setTaskDesc('');
      setTaskStatus('To Do');
      setTaskAssignee('');
      const today = new Date().toISOString().split('T')[0];
      setTaskStartDate(today);
      setTaskDeadline(today);
    }
    setNewSubtaskTitle('');
    setNewSubtaskStart(new Date().toISOString().split('T')[0]);
    setNewSubtaskEnd(new Date().toISOString().split('T')[0]);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (selectedTask) {
      updateTask(selectedTask.id, {
        title: taskTitle,
        description: taskDesc,
        status: taskStatus,
        assigneeId: taskAssignee || null,
        startDate: new Date(taskStartDate).toISOString(),
        deadline: new Date(taskDeadline).toISOString(),
      });
    } else {
      addTask({
        projectId: project.id,
        title: taskTitle,
        description: taskDesc,
        status: taskStatus,
        assigneeId: taskAssignee || null,
        creatorId: currentUser.id,
        startDate: new Date(taskStartDate).toISOString(),
        deadline: new Date(taskDeadline).toISOString(),
      });
    }
    setIsTaskModalOpen(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedTask || !newComment.trim()) return;
    
    addComment({
      taskId: selectedTask.id,
      userId: currentUser.id,
      content: newComment.trim(),
    });
    setNewComment('');
  };

  const handleAddSubtask = () => {
    if (!selectedTask || !newSubtaskTitle.trim()) return;
    addSubtask({
      taskId: selectedTask.id,
      title: newSubtaskTitle.trim(),
      status: 'To Do',
      startDate: new Date(newSubtaskStart).toISOString(),
      deadline: new Date(newSubtaskEnd).toISOString(),
    });
    setNewSubtaskTitle('');
  };

  return (
    <div className="h-full flex flex-col space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <motion.button 
            whileHover={{ x: -4 }}
            onClick={() => navigate('/projects')}
            className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl border border-transparent hover:border-slate-200 shadow-sm transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black tracking-tight text-slate-900">{project.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest">Active</span>
            </div>
            <p className="text-slate-500 mt-1 font-medium">{project.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-2xl border border-slate-200">
            <button 
              onClick={() => setViewMode('board')} 
              className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all", viewMode === 'board' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              <LayoutGrid className="h-4 w-4" />
              Board
            </button>
            <button 
              onClick={() => setViewMode('gantt')} 
              className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all", viewMode === 'gantt' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              <AlignLeft className="h-4 w-4" />
              Gantt
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOpenTaskModal()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-500 transition-all"
          >
            <Plus className="h-5 w-5" />
            Add Task
          </motion.button>
        </div>
      </div>

      {viewMode === 'board' ? (
        <div className="flex-1 overflow-x-auto pb-6 -mx-6 px-6">
          <div className="flex gap-8 h-full min-w-max">
            {STATUSES.map((status) => {
              const columnTasks = projectTasks.filter(t => t.status === status);
              const config = STATUS_CONFIG[status];
              
              return (
                <div key={status} className="flex flex-col w-80">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-2">
                      <div className={cn("p-1.5 rounded-lg", config.bg)}>
                        <config.icon className={cn("h-4 w-4", config.color)} />
                      </div>
                      <h3 className="font-bold text-slate-900 tracking-tight">{status}</h3>
                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {columnTasks.length}
                      </span>
                    </div>
                    <button className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-4 min-h-[200px] p-2 rounded-3xl bg-slate-100/30 border border-slate-200/40">
                    <AnimatePresence mode="popLayout">
                      {columnTasks.map(task => {
                        const assignee = users.find(u => u.id === task.assigneeId);
                        const taskComments = comments.filter(c => c.taskId === task.id);
                        const taskSubtasks = subtasks.filter(st => st.taskId === task.id);
                        const completedSubtasks = taskSubtasks.filter(st => st.status === 'Done').length;
                        const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'Done' && task.status !== 'Cancel';

                        return (
                          <motion.div 
                            key={task.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={() => handleOpenTaskModal(task)}
                            className="group bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 cursor-pointer hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2 mb-4 font-medium leading-relaxed">{task.description}</p>
                            
                            {taskSubtasks.length > 0 && (
                              <div className="mb-4">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                                  <span>Progress</span>
                                  <span>{completedSubtasks}/{taskSubtasks.length}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                                    style={{ width: `${(completedSubtasks / taskSubtasks.length) * 100}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg",
                                  isOverdue ? "text-rose-600 bg-rose-50" : "text-slate-400 bg-slate-50"
                                )}>
                                  <Calendar className="h-3 w-3" />
                                  <span>{format(new Date(task.deadline), 'MMM d')}</span>
                                </div>
                                {taskComments.length > 0 && (
                                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <MessageSquare className="h-3 w-3" />
                                    <span>{taskComments.length}</span>
                                  </div>
                                )}
                              </div>
                              {assignee && (
                                <div className="relative">
                                  <img 
                                    src={assignee.avatar} 
                                    alt={assignee.name} 
                                    className="h-7 w-7 rounded-xl border-2 border-white shadow-sm" 
                                  />
                                  <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 border border-white" />
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <GanttChart tasks={projectTasks} subtasks={projectSubtasks} />
        </div>
      )}

      {/* Task Modal */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsTaskModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
                    <ListTodo className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-none">
                      {selectedTask ? 'Task Details' : 'New Task'}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
                      {project.name} • {selectedTask ? `Created ${format(new Date(selectedTask.createdAt), 'MMM d')}` : 'Draft'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {selectedTask && (currentUser?.role === 'Admin' || currentUser?.role === 'Manager' || currentUser?.id === selectedTask.creatorId) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this task?')) {
                          deleteTask(selectedTask.id);
                          setIsTaskModalOpen(false);
                        }
                      }}
                      className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsTaskModalOpen(false)}
                    className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 flex flex-col lg:flex-row gap-12">
                {/* Left Column: Form */}
                <div className="flex-1 space-y-8">
                  <form id="task-form" onSubmit={handleSaveTask} className="space-y-8">
                    <div>
                      <label htmlFor="title" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Title</label>
                      <input
                        type="text"
                        id="title"
                        required
                        className="block w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-lg font-bold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="What needs to be done?"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Description</label>
                      <textarea
                        id="description"
                        rows={4}
                        className="block w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:ring-indigo-500 transition-all resize-none placeholder:text-slate-300"
                        value={taskDesc}
                        onChange={(e) => setTaskDesc(e.target.value)}
                        placeholder="Add more context, links, or requirements..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <label htmlFor="status" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Status</label>
                        <select
                          id="status"
                          className="block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                          value={taskStatus}
                          onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="startDate" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Start Date</label>
                        <input
                          type="date"
                          id="startDate"
                          required
                          className="block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                          value={taskStartDate}
                          onChange={(e) => setTaskStartDate(e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="deadline" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Deadline</label>
                        <input
                          type="date"
                          id="deadline"
                          required
                          className="block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                          value={taskDeadline}
                          onChange={(e) => setTaskDeadline(e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="assignee" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Assignee</label>
                        <select
                          id="assignee"
                          className="block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                          value={taskAssignee}
                          onChange={(e) => setTaskAssignee(e.target.value)}
                        >
                          <option value="">Unassigned</option>
                          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </form>

                  {/* Subtasks Section */}
                  {selectedTask && (
                    <div className="pt-8 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Subtasks</h4>
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {subtasks.filter(st => st.taskId === selectedTask.id).length}
                        </span>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        {subtasks.filter(st => st.taskId === selectedTask.id).map(st => (
                          <div key={st.id} className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <button 
                              onClick={() => updateSubtask(st.id, { status: st.status === 'Done' ? 'To Do' : 'Done' })}
                              className={cn(
                                "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                                st.status === 'Done' ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 text-transparent hover:border-indigo-500"
                              )}
                            >
                              <CheckCircle2 className="h-3 w-3" />
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-sm font-bold truncate", st.status === 'Done' ? "text-slate-400 line-through" : "text-slate-700")}>
                                {st.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  {format(new Date(st.startDate), 'MMM d')} - {format(new Date(st.deadline), 'MMM d')}
                                </span>
                                <span className={cn(
                                  "text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md",
                                  st.status === 'Done' ? "bg-emerald-50 text-emerald-600" :
                                  st.status === 'In Progress' ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"
                                )}>
                                  {st.status}
                                </span>
                              </div>
                            </div>
                            <button 
                              onClick={() => deleteSubtask(st.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                          <div className="sm:col-span-6">
                            <input
                              type="text"
                              placeholder="New subtask title..."
                              className="block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                              value={newSubtaskTitle}
                              onChange={(e) => setNewSubtaskTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddSubtask();
                                }
                              }}
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <input
                              type="date"
                              className="block w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                              value={newSubtaskStart}
                              onChange={(e) => setNewSubtaskStart(e.target.value)}
                            />
                          </div>
                          <div className="sm:col-span-3 flex gap-2">
                            <input
                              type="date"
                              className="block w-full rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                              value={newSubtaskEnd}
                              onChange={(e) => setNewSubtaskEnd(e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={handleAddSubtask}
                              disabled={!newSubtaskTitle.trim()}
                              className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 transition-colors shrink-0"
                            >
                              <Plus className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Comments */}
                {selectedTask && (
                  <div className="w-full lg:w-80 flex flex-col border-t lg:border-t-0 lg:border-l border-slate-100 pt-8 lg:pt-0 lg:pl-12">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Discussion
                      </h4>
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {comments.filter(c => c.taskId === selectedTask.id).length}
                      </span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-2 custom-scrollbar">
                      {comments.filter(c => c.taskId === selectedTask.id).length === 0 ? (
                        <div className="text-center py-12">
                          <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                            <MessageSquare className="h-6 w-6 text-slate-200" />
                          </div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No activity yet</p>
                        </div>
                      ) : (
                        comments.filter(c => c.taskId === selectedTask.id).map(comment => {
                          const user = users.find(u => u.id === comment.userId);
                          return (
                            <div key={comment.id} className="group">
                              <div className="flex items-center gap-2 mb-2">
                                <img src={user?.avatar} alt="" className="h-6 w-6 rounded-lg shadow-sm" />
                                <span className="text-xs font-bold text-slate-900">{user?.name}</span>
                                <span className="text-[10px] font-medium text-slate-400 ml-auto">
                                  {format(new Date(comment.createdAt), 'MMM d')}
                                </span>
                              </div>
                              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                                <p className="text-sm text-slate-600 leading-relaxed">{comment.content}</p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <form onSubmit={handleAddComment} className="mt-auto">
                      <div className="relative">
                        <textarea
                          rows={3}
                          className="block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:ring-indigo-500 transition-all resize-none shadow-inner"
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleAddComment(e);
                            }
                          }}
                        />
                        <button
                          type="submit"
                          disabled={!newComment.trim()}
                          className="absolute bottom-3 right-3 p-2 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-500 disabled:opacity-50 disabled:shadow-none transition-all"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
              
              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="rounded-2xl px-8 py-3 text-sm font-bold text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="task-form"
                  className="rounded-2xl bg-indigo-600 px-10 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-100 hover:bg-indigo-500 transition-all"
                >
                  {selectedTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

