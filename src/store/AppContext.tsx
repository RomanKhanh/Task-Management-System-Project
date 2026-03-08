  import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
  import { User, Project, Task, Subtask, Comment, Notification, TaskStatus } from '../types';
  import { v4 as uuidv4 } from 'uuid';
  import axios from "axios";
  import * as taskService from "../services/taskService";
  import * as projectService from "../services/projectService";
  import * as userService from "../services/userService";
  import { commentService } from "../services/commentService";
  import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from "../services/notificationService";
  import * as subtaskService from "../services/subtaskService";

  interface AppContextType {
    currentUser: User | null;
    login: (email: string, password?: string) => Promise<boolean>;
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
    loadSubtasks: (taskId: string) => void;
    markAllRead: (userId: string) => void;
    
    comments: Comment[];
    addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
    
    notifications: Notification[];
    markNotificationRead: (id: string) => void;
    loadNotifications: (userId: string) => void;
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
    const [currentUser, setCurrentUser] = useState<User | null>(() => loadFromStorage('taskflow_user', null));
    const [users, setUsers] = useState<User[]>(() => loadFromStorage('taskflow_users', []));
    useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadUsers();
  }, []);
    const [projects, setProjects] = useState<Project[]>([]);
    useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadProjects();
  }, []);
    const [tasks, setTasks] = useState<Task[]>([]);
    useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await taskService.getTasks();
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    loadTasks();
  }, []);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const loadSubtasks = async (taskId: string) => {
    try {

      const data = await subtaskService.getSubtasks(taskId);

      setSubtasks(data);

    } catch (err) {
      console.error("Load subtasks failed:", err);
    }
  };
    
  


    const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/comments")
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error(err));
  }, []);

  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (currentUser) {
      loadNotifications(currentUser.id);
    }
  }, [currentUser]);
    const loadNotifications = async (userId) => {

    const data = await fetchNotifications(userId);

    setNotifications(data);

  };
    
    // Save to localStorage whenever state changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("taskflow_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("taskflow_user");
    }
  }, [currentUser]);

    // useEffect(() => {
    //   localStorage.setItem('taskflow_users', JSON.stringify(users));
    // }, [users]);
  //   useEffect(() => {
  //   const savedUser = localStorage.getItem("taskflow_user");

  //   if (savedUser) {
  //     setCurrentUser(JSON.parse(savedUser));
  //   }
  // }, []);

    // useEffect(() => {
    //   localStorage.setItem('taskflow_projects', JSON.stringify(projects));
    // }, [projects]);

    useEffect(() => {
      localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
      localStorage.setItem('taskflow_subtasks', JSON.stringify(subtasks));
    }, [subtasks]);

    // useEffect(() => {
    //   localStorage.setItem('taskflow_comments', JSON.stringify(comments));
    // }, [comments]);

    useEffect(() => {
      localStorage.setItem('taskflow_notifications', JSON.stringify(notifications));
    }, [notifications]);

    const login = async (email: string, password: string) => {
    try {
      const user = await userService.loginUser(email, password);
      setCurrentUser(user);
      localStorage.setItem("taskflow_user", JSON.stringify(user));
      return true;
    } catch {
      return false;
    }
  };

    const logout = () => {
    setCurrentUser(null);
  };

    const register = async (userData: any) => {
    try {
      const newUser = await userService.registerUser(userData);
      setCurrentUser(newUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
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

    // const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    //   const newProject: Project = {
    //     ...project,
    //     id: uuidv4(),
    //     createdAt: new Date().toISOString(),
    //   };
    //   setProjects([...projects, newProject]);
    // };
    const addProject = async (projectData: any) => {
    try {
      if (!currentUser) return;

      const dataToSend = {
        ...projectData,
        managerId: currentUser.id
      };

      await projectService.createProject(dataToSend);
      const updated = await projectService.getProjects();
      setProjects(updated);
    } catch (err) {
      console.error(err);
    }
  };
    // const updateProject = (id: string, updatedFields: Partial<Project>) => {
    //   setProjects(projects.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    // };
    const updateProject = async (id: string, updatedFields: any) => {
    try {
      await projectService.updateProject(id, updatedFields);
      const updated = await projectService.getProjects();
      setProjects(updated);
    } catch (err) {
      console.error(err);
    }
  };
    // const deleteProject = (id: string) => {
    //   setProjects(projects.filter(p => p.id !== id));
    //   setTasks(tasks.filter(t => t.projectId !== id));
    // };
    const deleteProject = async (id: string) => {
    try {
      await projectService.deleteProject(id);
      const updated = await projectService.getProjects();
      setProjects(updated);
    } catch (err) {
      console.error(err);
    }
  };

    // const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    //   const newTask: Task = {
    //     ...task,
    //     id: uuidv4(),
    //     createdAt: new Date().toISOString(),
    //   };
    //   setTasks([...tasks, newTask]);
      
    //   if (task.assigneeId && task.assigneeId !== currentUser?.id) {
    //     addNotification(task.assigneeId, `You were assigned to a new task: "${task.title}"`);
    //   }
    // };
    const addTask = async (taskData: any) => {
    try {
      if (!currentUser) return;

      const dataToSend = {
        ...taskData,
        creatorId: currentUser.id
      };

      await taskService.createTask(dataToSend);
      const updatedTasks = await taskService.getTasks();
      setTasks(updatedTasks);
    } catch (err) {
      console.error(err);
    }
  };
    // const updateTask = (id: string, updatedFields: Partial<Task>) => {
    //   const oldTask = tasks.find(t => t.id === id);
    //   setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedFields } : t));
      
    //   if (oldTask && updatedFields.status && oldTask.status !== updatedFields.status) {
    //     if (oldTask.creatorId !== currentUser?.id) {
    //       addNotification(oldTask.creatorId, `Task "${oldTask.title}" status changed to ${updatedFields.status}`);
    //     }
    //   }
    // };
    const updateTask = async (id: string, data: any) => {
    try {
      await taskService.updateTask(id, data);
      const updatedTasks = await taskService.getTasks();
      setTasks(updatedTasks);
    } catch (err) {
      console.error(err);
    }
  };

    // const deleteTask = (id: string) => {
    //   setTasks(tasks.filter(t => t.id !== id));
    //   setSubtasks(subtasks.filter(st => st.taskId !== id));
    //   setComments(comments.filter(c => c.taskId !== id));
    // };
  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      const updatedTasks = await taskService.getTasks();
      setTasks(updatedTasks);
    } catch (err) {
      console.error(err);
    }
  };
    const addSubtask = async (subtaskData: any) => {
    try {

      await subtaskService.createSubtask(subtaskData);

      const updated = await subtaskService.getSubtasks(subtaskData.taskId);

      setSubtasks(updated);

    } catch (err) {
      console.error(err);
    }
  };

    const updateSubtask = async (id: string, status: string) => {
    try {

      await subtaskService.updateSubtaskStatus(id, status);

      setSubtasks(prev =>
        prev.map(st =>
          st.id === id ? { ...st, status } : st
        )
      );

    } catch (err) {
      console.error(err);
    }
  };

    const deleteSubtask = async (id: string) => {
    try {

      await subtaskService.deleteSubtask(id);

      setSubtasks(prev =>
        prev.filter(st => st.id !== id)
      );

    } catch (err) {
      console.error(err);
    }
  };

    // const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    //   const newComment: Comment = {
    //     ...comment,
    //     id: uuidv4(),
    //     createdAt: new Date().toISOString(),
    //   };
    //   setComments([...comments, newComment]);
    // };

  //   const loadComment = async (taskId: number) => {
  //   try {

  //     const data = await commentService.getCommentsByTask(taskId);

  //     setComments(data);

  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const loadComment = async (taskId: string) => {
    const res = await fetch(`/api/comments/${taskId}`);
    const data = await res.json();
    setComments(data);
  };
    const addComment = async (commentData: any) => {
    try {
      await commentService.createComment(commentData);

      const updated = await commentService.getCommentsByTask(commentData.taskId);
      setComments(updated);

    } catch (err) {
      console.error(err);
    }
  };
    const addNotification = (userId: string, message: string) => {
    const newNotification: Notification = {
      id: uuidv4(),
      userId,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications(prev => [...prev, newNotification]);
  };

    const markNotificationReadHandler = async (id: string) => {
    try {
      await markNotificationRead(id);

      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, isRead: true } : n
        )
      );

    } catch (err) {
      console.error(err);
    }
  };
    const markAllRead = async (userId) => {
    try {

      await markAllNotificationsRead(userId);

      setNotifications(prev =>
        prev.map(n =>
          n.userId === userId ? { ...n, isRead: true } : n
        )
      );

    } catch (err) {
      console.error(err);
    }
  };

    return (
      <AppContext.Provider value={{
        currentUser, login, logout, register,
        setCurrentUser,
        users, deleteUser, resetData,
        projects, addProject, updateProject, deleteProject,
        tasks, addTask, updateTask, deleteTask,
        subtasks, addSubtask, updateSubtask, deleteSubtask,loadSubtasks,
        comments, addComment, loadComment,
        notifications, markNotificationRead: markNotificationReadHandler, loadNotifications, markAllRead,
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
