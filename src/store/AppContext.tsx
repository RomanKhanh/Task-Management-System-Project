import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Project, Task, Subtask, Comment, Notification, TaskStatus } from '../types';
import { v4 as uuidv4 } from 'uud';

interface AppContextType {
  currentUser: User | null;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  register: (user: Omit<User, 'id' | 'avatar'>) => { success: boolean; message?: string };
  
  users: User[];
  deleteUser: (id: string) => void;
  resetData: () => void;
  
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  subtasks: Subtask[];
  addSubtask: (subtask: Omit<Subtask, 'id'>) => void;
  updateSubtask: (id: string, subtask: Partial<Subtask>) => void;
  deleteSubtask: (id: string) => void;
  
  comments: Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to load from localStorage
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error(`Error loading ${key} from localStorage`, e);
  }
  return defaultValue;
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadFromStorage('taskflow_currentUser', null));
  const [users, setUsers] = useState<User[]>(() => loadFromStorage('taskflow_users', []));
  const [projects, setProjects] = useState<Project[]>(() => loadFromStorage('taskflow_projects', []));
  const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage('taskflow_tasks', []));
  const [subtasks, setSubtasks] = useState<Subtask[]>(() => loadFromStorage('taskflow_subtasks', []));
  const [comments, setComments] = useState<Comment[]>(() => loadFromStorage('taskflow_comments', []));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadFromStorage('taskflow_notifications', []));

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('taskflow_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('taskflow_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('taskflow_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('taskflow_subtasks', JSON.stringify(subtasks));
  }, [subtasks]);

  useEffect(() => {
    localStorage.setItem('taskflow_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('taskflow_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const login = (email: string, password?: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const register = (user: Omit<User, 'id' | 'avatar'>) => {
    if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
      return { success: false, message: 'Email already exists' };
    }
    
    if (user.role === 'Admin' && users.some(u => u.role === 'Admin')) {
      return { success: false, message: 'An Admin account already exists' };
    }

    const newUser: User = {
      ...user,
      id: uuidv4(),
      avatar: `https://i.pravatar.cc/150?u=${uuidv4()}`
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    // Also reassign tasks or handle them appropriately
    // For simplicity, we just unassign tasks from the deleted user
    setTasks(tasks.map(t => t.assigneeId === id ? { ...t, assigneeId: null } : t));
  };

  const resetData = () => {
    localStorage.clear();
    setCurrentUser(null);
    setUsers([]);
    setProjects([]);
    setTasks([]);
    setSubtasks([]);
    setComments([]);
    setNotifications([]);
  };

  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    setTasks(tasks.filter(t => t.projectId !== id));
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    
    if (task.assigneeId && task.assigneeId !== currentUser?.id) {
      addNotification(task.assigneeId, `You were assigned to a new task: "${task.title}"`);
    }
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    const oldTask = tasks.find(t => t.id === id);
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedFields } : t));
    
    if (oldTask && updatedFields.status && oldTask.status !== updatedFields.status) {
      if (oldTask.creatorId !== currentUser?.id) {
        addNotification(oldTask.creatorId, `Task "${oldTask.title}" status changed to ${updatedFields.status}`);
      }
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    setSubtasks(subtasks.filter(st => st.taskId !== id));
    setComments(comments.filter(c => c.taskId !== id));
  };

  const addSubtask = (subtask: Omit<Subtask, 'id'>) => {
    const newSubtask: Subtask = {
      ...subtask,
      id: uuidv4(),
    };
    setSubtasks([...subtasks, newSubtask]);
  };

  const updateSubtask = (id: string, updatedFields: Partial<Subtask>) => {
    setSubtasks(subtasks.map(st => st.id === id ? { ...st, ...updatedFields } : st));
  };

  const deleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
  };

  const addNotification = (userId: string, message: string) => {
    const newNotification: Notification = {
      id: uuidv4(),
      userId,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications([...notifications, newNotification]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, logout, register,
      users, deleteUser, resetData,
      projects, addProject, updateProject, deleteProject,
      tasks, addTask, updateTask, deleteTask,
      subtasks, addSubtask, updateSubtask, deleteSubtask,
      comments, addComment,
      notifications, markNotificationRead
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
