export type Role = 'Admin' | 'Manager' | 'Member';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  managerId: string;
  memberIds: string[];
  createdAt: string;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Done' | 'Cancel';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assigneeId: string | null;
  creatorId: string;
  status: TaskStatus;
  startDate: string;
  deadline: string;
  createdAt: string;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  startDate: string;
  deadline: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}
