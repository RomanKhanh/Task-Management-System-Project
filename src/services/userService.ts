const API_URL = "http://localhost:5000/api/users"

export const loginUser = async (email: string, password: string) => {
  const res = await fetch("http://localhost:5000/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
//   check status
  console.log("STATUS:", res.status);
//   check res backend
  const data = await res.json();
  console.log("LOGIN RESPONSE:", data);

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

export const registerUser = async (data: any) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Register failed");
  return res.json();
};

export const getUsers = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};