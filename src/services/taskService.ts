const API_URL = "/api/tasks"; // dùng proxy

// ================= GET =================
export const getTasks = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
};

// ================= CREATE =================
export const createTask = async (task: {
  projectId: string;
  title: string;
  description: string;
  assigneeId?: string;
  creatorId: string;
  status: string;
  startDate?: string;
  deadline?: string;
}) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) throw new Error("Failed to create task");
  return response.json();
};

// ================= UPDATE =================
export const updateTask = async (
  id: string, // 🔥 sửa number -> string
  task: {
    title: string;
    description: string;
    assigneeId?: string;
    status: string;
    startDate?: string;
    deadline?: string;
  }
) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) throw new Error("Failed to update task");
  return response.json();
};

// ================= DELETE =================
export const deleteTask = async (id: string) => { // 🔥 sửa number -> string
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete task");
  return response.json();
};