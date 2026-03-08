const API_URL = "http://localhost:5000/api/projects";

// GET
export const getProjects = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
};

// CREATE
export const createProject = async (project: { name: string }) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });

  if (!res.ok) throw new Error("Failed to create project");
  return res.json();
};

// UPDATE
export const updateProject = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update project");
  return res.json();
};

// DELETE
export const deleteProject = async (id: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete project");
  return res.json();
};